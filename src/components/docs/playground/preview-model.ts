import type {
  PlaygroundPackageType,
  PlaygroundThemeType,
  PreviewItemType,
  PreviewModelType,
} from '@/types';

type RuleType = { head: string; body: string };
type DeclarationType = [name: string, value: string];

const THEME_HEAD = /^\[data-theme=['"]?([\w-]+)['"]?\]$/;

// Верхний уровень CSS → правила `голова { тело }`. Комментарии вырезаются.
function splitRules(css: string): RuleType[] {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: RuleType[] = [];
  let depth = 0;
  let last = 0;
  let head = '';
  let bodyStart = 0;

  for (let index = 0; index < source.length; index++) {
    const char = source[index];

    if (char === '{') {
      if (depth === 0) {
        head = source.slice(last, index).trim();
        bodyStart = index + 1;
      }
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        rules.push({ head, body: source.slice(bodyStart, index) });
        last = index + 1;
      }
    } else if (char === ';' && depth === 0) {
      last = index + 1;
    }
  }

  return rules;
}

// Тело правила → объявления кастомных свойств и вложенные блоки (например, @keyframes).
function parseBody(body: string) {
  const decls: DeclarationType[] = [];
  const nested: string[] = [];
  let depth = 0;
  let start = 0;

  const pushDeclaration = (segment: string) => {
    const colon = segment.indexOf(':');
    const name = segment.slice(0, colon).trim();

    if (colon > 0 && name.startsWith('--') && !name.includes('*')) {
      decls.push([name, segment.slice(colon + 1).trim()]);
    }
  };

  for (let index = 0; index < body.length; index++) {
    const char = body[index];

    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        nested.push(body.slice(start, index + 1).trim());
        start = index + 1;
      }
    } else if (char === ';' && depth === 0) {
      pushDeclaration(body.slice(start, index));
      start = index + 1;
    }
  }

  return { decls, nested };
}

function toBlock(selector: string, decls: DeclarationType[]) {
  return `${selector} {\n${decls.map(([name, value]) => `  ${name}: ${value};`).join('\n')}\n}`;
}

function collectDefs(rules: RuleType[]) {
  const defs: Record<string, string> = {};
  const byTheme: Record<string, Record<string, string>> = {};

  rules.forEach(({ head, body }) => {
    const { decls } = parseBody(body);
    const themeName = THEME_HEAD.exec(head)?.[1];

    if (head === ':root') Object.assign(defs, Object.fromEntries(decls));
    if (themeName) byTheme[themeName] = { ...byTheme[themeName], ...Object.fromEntries(decls) };
  });

  return { defs, byTheme };
}

// Переменные `--color-*`, `--radius-*` и т. д. → элементы превью. Имена tailwind-dictionary
// (`--text-h32--line-height`) и mixin-dictionary (`--font-h32-font-size`) различаются.
function classify(decls: DeclarationType[]): PreviewItemType[] {
  const map = new Map(decls);
  const items: PreviewItemType[] = [];
  const optional = (name: string) => (map.has(name) ? `var(${name})` : undefined);

  decls.forEach(([name, value]) => {
    const color = /^--color-(.+)$/.exec(name);
    const radius = /^--(?:radius|rounded)-(.+)$/.exec(name);
    const shadow = /^--shadow-(.+)$/.exec(name);
    const mixinText = /^--font-(.+)-font-size$/.exec(name);
    const font = /^--font-(?:family-)?([a-z0-9]+)$/i.exec(name);
    const text = /^--text-(.+?)(--(?:line-height|font-weight|letter-spacing))?$/.exec(name);

    if (color) {
      items.push({ kind: 'color', name: color[1], value: `var(${name})` });
    } else if (radius) {
      items.push({ kind: 'radius', name: radius[1], value: `var(${name})` });
    } else if (shadow) {
      items.push({ kind: 'shadow', name: shadow[1], value: `var(${name})` });
    } else if (mixinText) {
      items.push({
        kind: 'text',
        name: mixinText[1],
        value: `var(${name})`,
        lineHeight: optional(`--font-${mixinText[1]}-line-height`),
        weight: optional(`--font-${mixinText[1]}-font-weight`),
      });
    } else if (font && /[,'"]/.test(value)) {
      items.push({ kind: 'font', name: font[1], value: `var(${name})` });
    } else if (text && !text[2]) {
      const lineHeight = optional(`--text-${text[1]}--line-height`);
      const weight = optional(`--text-${text[1]}--font-weight`);

      if (lineHeight || weight) {
        items.push({ kind: 'text', name: text[1], value: `var(${name})`, lineHeight, weight });
      }
    }
  });

  return items;
}

function flatten(value: unknown, prefix = ''): Array<[string, string]> {
  if (typeof value === 'string' || typeof value === 'number') return [[prefix, String(value)]];
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return [];

  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}-${key}` : key)
  );
}

function fromTailwindV3(themeJs: string, css: string): PreviewModelType | null {
  let theme: Record<string, Record<string, unknown>>;

  try {
    theme = JSON.parse(themeJs.replace(/^\s*module\.exports\s*=\s*/, '').replace(/;\s*$/, ''));
  } catch {
    return null;
  }

  const extend = (theme.extend ?? {}) as Record<string, unknown>;
  const read = (key: string) => theme[key] ?? extend[key];
  const items: PreviewItemType[] = [];

  flatten(read('colors')).forEach(([name, value]) => items.push({ kind: 'color', name, value }));
  flatten(read('borderRadius')).forEach(([name, value]) =>
    items.push({ kind: 'radius', name, value })
  );
  flatten(read('boxShadow')).forEach(([name, value]) =>
    items.push({ kind: 'shadow', name, value })
  );
  flatten(read('fontFamily')).forEach(([name, value]) => items.push({ kind: 'font', name, value }));

  Object.entries((read('fontSize') ?? {}) as Record<string, unknown>).forEach(([name, value]) => {
    if (!Array.isArray(value)) return;
    const [size, options] = value as [string, Record<string, unknown>?];

    items.push({
      kind: 'text',
      name,
      value: String(size),
      lineHeight: options?.lineHeight === undefined ? undefined : String(options.lineHeight),
      weight: options?.fontWeight === undefined ? undefined : String(options.fontWeight),
    });
  });

  return { css, items, ...collectDefs(splitRules(css)) };
}

function fromTailwindV4(source: string): PreviewModelType {
  const kept: string[] = [];
  const themeDecls: DeclarationType[] = [];
  const inlineDecls: DeclarationType[] = [];
  const hoisted: string[] = [];
  const rules = splitRules(source);

  rules.forEach((rule) => {
    if (rule.head === '@theme' || rule.head === '@theme inline') {
      const { decls, nested } = parseBody(rule.body);

      (rule.head === '@theme' ? themeDecls : inlineDecls).push(...decls);
      hoisted.push(...nested);
    } else {
      kept.push(`${rule.head} {${rule.body}}`);
    }
  });

  // `@theme` в браузере не работает: переменные кладём в :root. Значения `@theme inline`
  // ссылаются на переменные тем, поэтому пересчитываются на каждом элементе с data-theme.
  const css = [
    ...kept,
    toBlock(':root', themeDecls),
    toBlock(':root, [data-theme]', inlineDecls),
    ...hoisted,
  ].join('\n\n');

  const { defs, byTheme } = collectDefs(rules);

  return {
    css,
    items: classify([...themeDecls, ...inlineDecls]),
    defs: { ...defs, ...Object.fromEntries([...themeDecls, ...inlineDecls]) },
    byTheme,
  };
}

function fromPlainCss(css: string): PreviewModelType {
  const rules = splitRules(css);
  const rootDecls = rules
    .filter(({ head }) => head === ':root')
    .flatMap(({ body }) => parseBody(body).decls);

  return { css, items: classify(rootDecls), ...collectDefs(rules) };
}

export function buildPreviewModel(
  packageName: PlaygroundPackageType,
  tailwindVersion: 3 | 4,
  files: Record<string, string>
): PreviewModelType | null {
  if (packageName === 'mixin-dictionary') {
    const css = files['css/index.css'];
    return css ? fromPlainCss(css) : null;
  }

  if (tailwindVersion === 3) {
    const themeJs = files['tailwind/theme.js'];
    return themeJs ? fromTailwindV3(themeJs, files['tailwind/theme.css'] ?? '') : null;
  }

  const css = files['tailwind/theme.css'];
  return css ? fromTailwindV4(css) : null;
}

export function resolveValue(model: PreviewModelType, theme: PlaygroundThemeType, value: string) {
  const vars = { ...model.defs, ...model.byTheme[theme] };
  let result = value;

  for (let depth = 0; depth < 6 && /var\(/.test(result); depth++) {
    const next = result.replace(/var\((--[\w-]+)(?:\s*,[^)]*)?\)/g, (match, name: string) => {
      return vars[name] ?? match;
    });

    if (next === result) break;
    result = next;
  }

  return result;
}

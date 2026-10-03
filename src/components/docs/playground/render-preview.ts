import type { LangType, PlaygroundThemeType, PreviewItemType, PreviewModelType } from '@/types';
import { resolveValue } from './preview-model';

const TITLES: Record<LangType, Record<PreviewItemType['kind'] | 'empty', string>> = {
  ru: {
    color: 'Цвета',
    font: 'Шрифты',
    text: 'Текстовые стили',
    radius: 'Скругления',
    shadow: 'Тени',
    empty: 'В результате нет цветов, шрифтов, скруглений и теней для превью.',
  },
  en: {
    color: 'Colors',
    font: 'Fonts',
    text: 'Text styles',
    radius: 'Radii',
    shadow: 'Shadows',
    empty: 'The result has no colors, fonts, radii or shadows to preview.',
  },
};

const SAMPLE: Record<LangType, string> = {
  ru: 'Съешь же ещё этих мягких булок',
  en: 'The quick brown fox jumps over',
};

// Свои стили оформления превью не зависят от токенов пользователя: цвета подмешиваются из currentColor.
const LAYOUT_CSS = `
*{box-sizing:border-box}
html{color-scheme:light;--pv-line:color-mix(in srgb,currentColor 18%,transparent);--pv-muted:color-mix(in srgb,currentColor 60%,transparent)}
html[data-theme='dark']{color-scheme:dark}
body{margin:0;padding:20px;font:13px/1.45 system-ui,-apple-system,sans-serif;background:var(--color-background,Canvas);color:var(--color-foreground,CanvasText)}
h4{margin:24px 0 10px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--pv-muted)}
h4:first-child{margin-top:0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:12px}
.card{display:grid;gap:6px;font-size:11px;color:var(--pv-muted);word-break:break-all}
.card b{color:currentColor;font-weight:600}
.sw{height:56px;border:1px solid var(--pv-line);border-radius:8px}
.box{height:56px;background:var(--color-background,Canvas);border:1px solid var(--pv-line)}
.row{display:grid;gap:4px;padding:10px 0;border-top:1px solid var(--pv-line)}
.row small{color:var(--pv-muted);font-size:11px}
.empty{color:var(--pv-muted)}
`;

function esc(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function section(title: string, body: string) {
  return `<h4>${esc(title)}</h4>${body}`;
}

function renderItems(model: PreviewModelType, theme: PlaygroundThemeType, locale: LangType) {
  const titles = TITLES[locale];
  const of = (kind: PreviewItemType['kind']) => model.items.filter((item) => item.kind === kind);
  const shown = (value: string) => esc(resolveValue(model, theme, value));
  const parts: string[] = [];

  const colors = of('color');
  if (colors.length) {
    parts.push(
      section(
        titles.color,
        `<div class="grid">${colors
          .map(
            ({ name, value }) =>
              `<div class="card"><div class="sw" style="background:${esc(value)}"></div><b>${esc(name)}</b><span>${shown(value)}</span></div>`
          )
          .join('')}</div>`
      )
    );
  }

  const fonts = of('font');
  if (fonts.length) {
    parts.push(
      section(
        titles.font,
        fonts
          .map(
            ({ name, value }) =>
              `<div class="row"><small>${esc(name)} · ${shown(value)}</small><div style="font-family:${esc(value)};font-size:20px">${esc(SAMPLE[locale])}</div></div>`
          )
          .join('')
      )
    );
  }

  const texts = of('text');
  if (texts.length) {
    parts.push(
      section(
        titles.text,
        texts
          .map(({ name, value, lineHeight, weight }) => {
            const style = [
              `font-size:${value}`,
              lineHeight && `line-height:${lineHeight}`,
              weight && `font-weight:${weight}`,
            ]
              .filter(Boolean)
              .join(';');

            return `<div class="row"><small>${esc(name)} · ${shown(value)}</small><div style="${esc(style)}">${esc(SAMPLE[locale])}</div></div>`;
          })
          .join('')
      )
    );
  }

  const radii = of('radius');
  if (radii.length) {
    parts.push(
      section(
        titles.radius,
        `<div class="grid">${radii
          .map(
            ({ name, value }) =>
              `<div class="card"><div class="box" style="border-radius:${esc(value)}"></div><b>${esc(name)}</b><span>${shown(value)}</span></div>`
          )
          .join('')}</div>`
      )
    );
  }

  const shadows = of('shadow');
  if (shadows.length) {
    parts.push(
      section(
        titles.shadow,
        `<div class="grid">${shadows
          .map(
            ({ name, value }) =>
              `<div class="card"><div class="box" style="border-radius:8px;box-shadow:${esc(value)}"></div><b>${esc(name)}</b></div>`
          )
          .join('')}</div>`
      )
    );
  }

  return parts.length ? parts.join('') : `<p class="empty">${esc(titles.empty)}</p>`;
}

// Документ для iframe. CSP запрещает любые загрузки (картинки, шрифты, запросы): превью не ходит в сеть.
export default function renderPreviewHtml(
  model: PreviewModelType,
  theme: PlaygroundThemeType,
  locale: LangType
) {
  const css = model.css.replace(/<\/style/gi, '<\\/style');

  return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><style>${LAYOUT_CSS}</style><style>${css}</style></head><body>${renderItems(model, theme, locale)}</body></html>`;
}

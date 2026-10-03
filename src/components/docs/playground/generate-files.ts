import type {
  AnyObjectType,
  PlaygroundErrorType,
  PlaygroundInputFileType,
  PlaygroundInputType,
  PlaygroundResultType,
} from '@/types';

type ParsedType = { ok: true; value: AnyObjectType } | { ok: false; error: PlaygroundErrorType };

function isPlainObject(value: unknown): value is AnyObjectType {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJson(file: PlaygroundInputFileType, text: string, allowEmpty = false): ParsedType {
  if (!text.trim()) {
    return allowEmpty
      ? { ok: true, value: {} }
      : { ok: false, error: { file, message: 'The file is empty' } };
  }

  try {
    const value: unknown = JSON.parse(text);

    if (!isPlainObject(value)) {
      return { ok: false, error: { file, message: 'The file must contain a JSON object' } };
    }

    return { ok: true, value };
  } catch (error) {
    return { ok: false, error: { file, message: (error as Error).message } };
  }
}

function pick(source: unknown, keys: string[]): AnyObjectType {
  if (!isPlainObject(source)) return {};

  return Object.fromEntries(
    keys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]])
  );
}

// Генераторы грузятся лениво: Style Dictionary весит около 800 КБ в gzip.
export default async function generateFiles(
  input: PlaygroundInputType
): Promise<PlaygroundResultType> {
  const parsed = {
    tokens: parseJson('tokens', input.tokens),
    light: parseJson('light', input.light, true),
    dark: parseJson('dark', input.dark, true),
    config: parseJson('config', input.config),
  };

  const errors = Object.values(parsed).flatMap((item) => (item.ok ? [] : [item.error]));

  if (errors.length) return { status: 'error', errors };

  const tokens = parsed.tokens.ok ? parsed.tokens.value : {};
  const config = parsed.config.ok ? parsed.config.value : {};
  const light = parsed.light.ok ? parsed.light.value : {};
  const dark = parsed.dark.ok ? parsed.dark.value : {};

  const themeTrees: AnyObjectType = {};
  if (Object.keys(light).length) themeTrees.light = light;
  if (Object.keys(dark).length) themeTrees.dark = dark;

  const isTailwind = input.packageName === 'tailwind-dictionary';
  const themeOptions = pick(config.themes, isTailwind ? ['default', 'prefix'] : ['default']);
  const themes = Object.keys(themeTrees).length ? { ...themeTrees, ...themeOptions } : null;

  const warnings: string[] = [];
  const logger = { warn: (message: string) => warnings.push(message) };

  try {
    if (isTailwind) {
      const { generate } = await import('tailwind-dictionary/generate');
      const files = await generate({
        tokens,
        themes,
        themeAliases: config.themeAliases,
        version: input.tailwindVersion,
        logger,
      });

      return { status: 'ok', files, warnings };
    }

    const { generate } = await import('mixin-dictionary/generate');
    const files = await generate({
      tokens,
      themes,
      platforms: config.platforms,
      mediaAliases: config.mediaAliases,
      keyframesAliases: config.keyframesAliases,
      logger,
    });

    return { status: 'ok', files, warnings };
  } catch (error) {
    return {
      status: 'error',
      errors: [{ file: 'generator', message: String((error as Error).message ?? error).trim() }],
    };
  }
}

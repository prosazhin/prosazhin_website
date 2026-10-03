'use client';

import '@/styles/playground.css';
import type {
  LangType,
  PlaygroundInputFileType,
  PlaygroundInputType,
  PlaygroundPackageType,
  PlaygroundResultType,
  PlaygroundThemeType,
} from '@/types';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';

import generateFiles from './generate-files';
import {
  DARK_PRESET,
  LIGHT_PRESET,
  MIXIN_CONFIG_PRESET,
  TAILWIND_V3_CONFIG_PRESET,
  TAILWIND_V4_CONFIG_PRESET,
  TOKENS_PRESET,
} from './presets';
import { buildPreviewModel } from './preview-model';
import renderPreviewHtml from './render-preview';

type ConfigKey = 'tailwind4' | 'tailwind3' | 'mixin';
type SuccessType = {
  input: PlaygroundInputType;
  files: Record<string, string>;
  warnings: string[];
};

const INPUT_FILES: PlaygroundInputFileType[] = ['tokens', 'light', 'dark', 'config'];

const CONFIG_PRESETS: Record<ConfigKey, string> = {
  tailwind4: TAILWIND_V4_CONFIG_PRESET,
  tailwind3: TAILWIND_V3_CONFIG_PRESET,
  mixin: MIXIN_CONFIG_PRESET,
};

const TEXT = {
  ru: {
    reset: 'Сбросить',
    input: 'Вход',
    output: 'Результат',
    preview: 'Превью',
    copy: 'Копировать',
    copied: 'Скопировано',
    building: 'Сборка…',
    light: 'Светлая',
    dark: 'Тёмная',
    warnings: 'Предупреждения',
    errorsKept: 'Есть ошибки, показан последний успешный результат.',
    noResult: 'Результата пока нет.',
    noPreview: 'Не удалось построить превью.',
    noPreviewCss: 'Для превью нужен файл css/index.css: добавьте платформу css в config.json.',
    frameTitle: 'Превью результата в светлой или тёмной теме',
  },
  en: {
    reset: 'Reset',
    input: 'Input',
    output: 'Result',
    preview: 'Preview',
    copy: 'Copy',
    copied: 'Copied',
    building: 'Building…',
    light: 'Light',
    dark: 'Dark',
    warnings: 'Warnings',
    errorsKept: 'There are errors, the last successful result is shown.',
    noResult: 'No result yet.',
    noPreview: 'Could not build the preview.',
    noPreviewCss: 'The preview needs css/index.css: add the css platform to config.json.',
    frameTitle: 'Result preview in the light or dark theme',
  },
} satisfies Record<LangType, Record<string, string>>;

const FILE_NAMES: Record<PlaygroundInputFileType, string> = {
  tokens: 'tokens.json',
  light: 'light.json',
  dark: 'dark.json',
  config: 'config.json',
};

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      className='pg-seg'
      role='group'
      aria-label={label}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type='button'
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function TokensPlayground({
  packageName,
  locale = 'ru',
}: {
  packageName: PlaygroundPackageType;
  locale?: LangType;
}) {
  const text = TEXT[locale];
  const [tailwindVersion, setTailwindVersion] = useState<3 | 4>(4);
  const [tokens, setTokens] = useState(TOKENS_PRESET);
  const [light, setLight] = useState(LIGHT_PRESET);
  const [dark, setDark] = useState(DARK_PRESET);
  const [configs, setConfigs] = useState(CONFIG_PRESETS);
  const [activeInput, setActiveInput] = useState<PlaygroundInputFileType>('tokens');
  const [activeFile, setActiveFile] = useState('');
  const [theme, setTheme] = useState<PlaygroundThemeType>('light');
  const [copied, setCopied] = useState(false);

  const configKey: ConfigKey =
    packageName === 'mixin-dictionary'
      ? 'mixin'
      : tailwindVersion === 3
        ? 'tailwind3'
        : 'tailwind4';
  const config = configs[configKey];

  const input = useMemo<PlaygroundInputType>(
    () => ({ packageName, tailwindVersion, tokens, light, dark, config }),
    [packageName, tailwindVersion, tokens, light, dark, config]
  );

  // Сборка запускается после паузы в наборе; результат хранит вход, для которого посчитан.
  const [debounced, setDebounced] = useState(input);
  const [result, setResult] = useState<{
    input: PlaygroundInputType;
    data: PlaygroundResultType;
  }>();
  const [lastOk, setLastOk] = useState<SuccessType>();

  useDebounce(() => setDebounced(input), 300, [input]);

  useEffect(() => {
    let cancelled = false;

    generateFiles(debounced).then((data) => {
      if (cancelled) return;

      setResult({ input: debounced, data });
      if (data.status === 'ok') {
        setLastOk({ input: debounced, files: data.files, warnings: data.warnings });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const building = result?.input !== input;
  // Ошибки остаются на экране, пока не придёт новый результат: сообщение не мигает при наборе.
  const errors = result?.data.status === 'error' ? result.data.errors : [];
  const shown =
    lastOk &&
    lastOk.input.packageName === packageName &&
    (packageName === 'mixin-dictionary' || lastOk.input.tailwindVersion === tailwindVersion)
      ? lastOk
      : undefined;

  const fileNames = Object.keys(shown?.files ?? {});
  const currentFile = fileNames.includes(activeFile) ? activeFile : fileNames[0];

  const previewHtml = useMemo(() => {
    if (!shown) return '';

    const model = buildPreviewModel(
      shown.input.packageName,
      shown.input.tailwindVersion,
      shown.files
    );

    return model ? renderPreviewHtml(model, theme, locale) : '';
  }, [shown, theme, locale]);

  const values = { tokens, light, dark, config };
  const setters = {
    tokens: setTokens,
    light: setLight,
    dark: setDark,
    config: (value: string) => setConfigs((current) => ({ ...current, [configKey]: value })),
  };
  const activeErrors = errors.filter((error) => error.file === activeInput);
  const generatorErrors = errors.filter((error) => error.file === 'generator');

  const reset = () => {
    setTokens(TOKENS_PRESET);
    setLight(LIGHT_PRESET);
    setDark(DARK_PRESET);
    setConfigs(CONFIG_PRESETS);
  };

  const copy = async () => {
    if (!shown || !currentFile) return;

    try {
      await navigator.clipboard.writeText(shown.files[currentFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className='pg not-prose'>
      <div className='pg-bar'>
        {packageName === 'tailwind-dictionary' && (
          <Segmented
            label='Tailwind'
            value={String(tailwindVersion)}
            options={[
              { value: '4', label: 'Tailwind 4' },
              { value: '3', label: 'Tailwind 3' },
            ]}
            onChange={(value) => setTailwindVersion(value === '3' ? 3 : 4)}
          />
        )}
        <div className='pg-bar-group pg-bar-end'>
          {building && <span className='pg-status'>{text.building}</span>}
          <button
            type='button'
            className='pg-button'
            onClick={reset}
          >
            {text.reset}
          </button>
        </div>
      </div>

      <section className='pg-panel'>
        <div className='pg-tabs'>
          <div
            className='pg-tab-list'
            role='tablist'
            aria-label={text.input}
          >
            {INPUT_FILES.map((file) => (
              <button
                key={file}
                type='button'
                role='tab'
                aria-selected={file === activeInput}
                className={clsx(
                  'pg-tab',
                  errors.some((error) => error.file === file) && 'pg-tab-error'
                )}
                onClick={() => setActiveInput(file)}
              >
                {FILE_NAMES[file]}
              </button>
            ))}
          </div>
        </div>
        <textarea
          className='pg-editor'
          aria-label={FILE_NAMES[activeInput]}
          value={values[activeInput]}
          spellCheck={false}
          autoCapitalize='off'
          autoCorrect='off'
          wrap='off'
          onChange={(event) => setters[activeInput](event.target.value)}
        />
        {activeErrors.map((error) => (
          <p
            key={error.message}
            className='pg-error'
          >
            {FILE_NAMES[activeInput]}: {error.message}
          </p>
        ))}
      </section>

      {generatorErrors.map((error) => (
        <p
          key={error.message}
          className='pg-error pg-error-box'
        >
          {error.message}
        </p>
      ))}

      <section className='pg-panel'>
        <div className='pg-tabs'>
          <div
            className='pg-tab-list'
            role='tablist'
            aria-label={text.output}
          >
            {fileNames.map((file) => (
              <button
                key={file}
                type='button'
                role='tab'
                aria-selected={file === currentFile}
                className='pg-tab'
                onClick={() => setActiveFile(file)}
              >
                {file}
              </button>
            ))}
          </div>
          <button
            type='button'
            className='pg-button'
            disabled={!shown}
            onClick={copy}
          >
            {copied ? text.copied : text.copy}
          </button>
        </div>
        {errors.length > 0 && shown && <p className='pg-note'>{text.errorsKept}</p>}
        {shown && currentFile ? (
          <pre className='pg-code'>
            <code>{shown.files[currentFile]}</code>
          </pre>
        ) : (
          <p className='pg-note'>{building ? text.building : text.noResult}</p>
        )}
        {shown && shown.warnings.length > 0 && (
          <div className='pg-warnings'>
            <b>{text.warnings}</b>
            <ul>
              {shown.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className='pg-panel'>
        <div className='pg-tabs'>
          <span className='pg-title'>{text.preview}</span>
          <Segmented
            label={text.preview}
            value={theme}
            options={[
              { value: 'light', label: text.light },
              { value: 'dark', label: text.dark },
            ]}
            onChange={setTheme}
          />
        </div>
        {previewHtml ? (
          <iframe
            className='pg-frame'
            title={text.frameTitle}
            sandbox=''
            srcDoc={previewHtml}
          />
        ) : (
          <p className='pg-note'>
            {shown
              ? packageName === 'mixin-dictionary'
                ? text.noPreviewCss
                : text.noPreview
              : building
                ? text.building
                : text.noResult}
          </p>
        )}
      </section>
    </div>
  );
}

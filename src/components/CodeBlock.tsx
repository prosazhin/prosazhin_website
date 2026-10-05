import clsx from 'clsx';

// Фрагмент кода с именем файла на лендинговых страницах (дизайн-система, tailwind-dictionary).
// wrap={false} — строки не переносятся, длинный код прокручивается по горизонтали
// (для JSON и CSS, где важна структура отступов). Высоту ограничивают через preClassName.
const CodeBlock = ({
  file,
  code,
  wrap = true,
  className,
  preClassName,
}: {
  file: string;
  code: string;
  wrap?: boolean;
  className?: string;
  preClassName?: string;
}) => (
  <figure
    className={clsx(
      'rounded-16 border-secondary-200 bg-secondary-50 w-full min-w-0 overflow-hidden border',
      className
    )}
  >
    <figcaption className='border-secondary-200 text-t12 text-basic-300 border-b px-16 py-8 font-mono'>
      {file}
    </figcaption>
    <pre
      // Прокручиваемый блок должен быть доступен с клавиатуры.
      tabIndex={wrap ? undefined : 0}
      className={clsx(
        'text-t14 text-basic-400 p-16 font-mono',
        wrap ? '[overflow-wrap:anywhere] whitespace-pre-wrap' : 'overflow-x-auto whitespace-pre',
        preClassName
      )}
    >
      <code>{code}</code>
    </pre>
  </figure>
);

export default CodeBlock;

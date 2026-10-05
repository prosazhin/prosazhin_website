'use client';

import CodeBlock from '@/components/CodeBlock';
import { InlineRadio, InlineRadioGroup } from '@prosazhin/pbcomponents';
import { ReactElement, useState } from 'react';

type FileType = { file: string; code: string };
type VersionType = '4' | '3';

const VERSIONS: VersionType[] = ['4', '3'];

// Обе колонки одной высоты на десктопе: длинный код прокручивается внутри блока,
// а два файла Tailwind 3 делят высоту колонки пополам.
const CODE_CLASS_NAME = 'lg-min:min-h-0 lg-min:flex-1 flex flex-col';
const PRE_CLASS_NAME = 'lg-min:max-h-none lg-min:min-h-0 max-h-[360px] flex-1 overflow-auto';

const Column = ({
  title,
  control,
  files,
}: {
  title: string;
  control: ReactElement;
  files: FileType[];
}) => (
  <div className='flex min-w-0 flex-col gap-y-12'>
    <div className='flex flex-row flex-wrap items-center justify-between gap-12'>
      <h3 className='text-tm16 text-basic-400'>{title}</h3>
      {control}
    </div>
    <div className='lg-min:h-[440px] flex flex-col gap-y-12'>
      {files.map(({ file, code }) => (
        <CodeBlock
          key={file}
          file={file}
          code={code}
          wrap={false}
          className={CODE_CLASS_NAME}
          preClassName={PRE_CLASS_NAME}
        />
      ))}
    </div>
  </div>
);

// Демо на первом экране: файл токенов на входе и тема для выбранной версии Tailwind на выходе.
const TokensDemo = ({
  input,
  output,
  labels,
}: {
  input: FileType[];
  output: Record<VersionType, FileType[]>;
  labels: { input: string; inputFile: string; output: string; version: string };
}) => {
  const [file, setFile] = useState(input[0].file);
  const [version, setVersion] = useState<VersionType>('4');

  return (
    <div className='lg-min:grid-cols-2 grid w-full grid-cols-1 gap-16'>
      <Column
        title={labels.input}
        files={input.filter((item) => item.file === file)}
        control={
          <InlineRadioGroup
            size='s'
            value={file}
            onChange={setFile}
            aria-label={labels.inputFile}
          >
            {input.map((item) => (
              <InlineRadio
                key={item.file}
                value={item.file}
              >
                {item.file.split('/').pop()}
              </InlineRadio>
            ))}
          </InlineRadioGroup>
        }
      />
      <Column
        title={labels.output}
        files={output[version]}
        control={
          <InlineRadioGroup
            size='s'
            value={version}
            onChange={(value) => setVersion(value as VersionType)}
            aria-label={labels.version}
          >
            {VERSIONS.map((item) => (
              <InlineRadio
                key={item}
                value={item}
              >
                {`Tailwind ${item}`}
              </InlineRadio>
            ))}
          </InlineRadioGroup>
        }
      />
    </div>
  );
};

export default TokensDemo;

'use client';

import { CheckIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import { Button, Tooltip } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

// surface='base' — белый фон для команды внутри серой карточки (bg-basic-50),
// где серый фон по умолчанию сливается с подложкой.
const CopyCommand = ({
  command,
  copyLabel,
  copiedLabel,
  surface = 'muted',
}: {
  command: string;
  copyLabel: string;
  copiedLabel: string;
  surface?: 'muted' | 'base';
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Clipboard недоступен (например, без HTTPS) — команду можно выделить вручную.
    }
  };

  return (
    <div
      className={clsx(
        'rounded-12 border-secondary-200 desktop:w-auto flex w-full max-w-full flex-row items-center gap-x-12 border py-6 pr-6 pl-16',
        surface === 'base' ? 'bg-basic-0' : 'bg-secondary-50'
      )}
    >
      <code className='text-t14 max-xs:text-t12 text-basic-400 min-w-0 flex-1 overflow-x-auto font-mono whitespace-nowrap'>
        <span
          aria-hidden='true'
          className='text-basic-300 select-none'
        >
          ${' '}
        </span>
        {command}
      </code>
      <Tooltip
        content={copied ? copiedLabel : copyLabel}
        placement='top'
      >
        <Button
          size='xs'
          color='secondary'
          theme='ghost'
          leftIcon={copied ? CheckIcon : Square2StackIcon}
          aria-label={copied ? copiedLabel : copyLabel}
          onClick={copy}
          // У Button в pbcomponents на телефоне w-full — здесь кнопка-иконка не должна растягиваться.
          className='max-xs:w-auto! shrink-0'
        />
      </Tooltip>
    </div>
  );
};

export default CopyCommand;

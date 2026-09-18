'use client';

import { getYearsDiff } from '@/utils/formatter';
import { type Profession } from '@/utils/resume';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Badge, Button } from '@prosazhin/pbcomponents';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const AsideProfile = ({ profession }: { profession?: Profession }) => {
  const { t, i18n } = useTranslation();

  const showDesign = profession !== 'developer';
  const showDev = profession !== 'designer';

  const role = profession ?? 'developer';
  const locale = i18n.resolvedLanguage === 'en' ? 'en' : 'ru';
  // Узкие телефоны (≤ xs) и xl — фото над текстом; между ними — в одну строку.
  return (
    <div className='max-xs:flex-col max-xs:gap-x-0 max-xs:gap-y-16 flex w-full flex-row gap-x-20 xl:flex-col xl:gap-x-0 xl:gap-y-16'>
      <Image
        className='rounded-999 size-96 xl:size-128'
        width={128}
        height={128}
        src='/avatar.jpg'
        alt='avatar'
        loading='eager'
      />
      <div className='flex w-full flex-col gap-y-16'>
        <div className='text-t14 flex w-full flex-col gap-y-2'>
          <div className='mb-8 flex w-full flex-col gap-y-8'>
            <span className='text-tm16 block w-full'>{t('name')}</span>
            <span className='text-tm14 text-basic-400 block w-full'>{t(`jobTitle.${role}`)}</span>
          </div>
          <div className='mb-16 flex w-full flex-row flex-wrap gap-4'>
            {(t(`jobTags.${role}`, { returnObjects: true }) as unknown as string[]).map((tag) => (
              <Badge
                key={tag}
                size='s'
                color='primary'
                theme='light'
              >
                {tag}
              </Badge>
            ))}
          </div>
          {showDesign && (
            <span className='w-full'>
              {t('plurals.year.year', {
                count: getYearsDiff('2011-01-01', String(new Date())),
              })}{' '}
              {t('inDesign')}
            </span>
          )}
          {showDev && (
            <span className='w-full'>
              {t('plurals.year.year', {
                count: getYearsDiff('2014-01-01', String(new Date())),
              })}{' '}
              {t('inDevelopment')}
            </span>
          )}
          <span className='w-full'>{t('location')}</span>
          <span className='w-full'>{t('remote')}</span>
        </div>
        <Button
          size='s'
          className='print:hidden!'
          leftIcon={ArrowDownTrayIcon}
          href={`/resume/cv-${locale}-${role}.pdf`}
          download={`${t(`cv.filename.${role}`)}.pdf`}
        >
          {t('download')}
        </Button>
      </div>
    </div>
  );
};

export default AsideProfile;

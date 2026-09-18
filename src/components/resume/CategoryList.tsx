'use client';

import { LangType, MatrixLevelType, MatrixType } from '@/types';
import { Badge, Collapse, CollapseGroup } from '@prosazhin/pbcomponents';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const getRating = (locale: LangType, value: number) => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

// Название уровня без цифры-префикса ("3. Экспертиза" → "Экспертиза") — саму оценку
// рядом уже показывает бейдж, дублировать цифру в названии не нужно.
const getLevelName = (levels: MatrixLevelType[], rating: number) =>
  levels[Math.round(rating) - 1]?.title.replace(/^\d+\.\s*/, '');

const CategoryList = ({ matrix, levels, locale }: MatrixType) => {
  const { t } = useTranslation();

  const { categories, totalRating } = useMemo(() => {
    const result = [...matrix.category];

    const total = matrix.category.reduce((acc, { competencies }, index) => {
      const summary = competencies.reduce((acc, cur) => acc + cur.rating, 0) / competencies.length;
      result[index].rating = getRating(locale, summary);

      return acc + summary;
    }, 0);

    return { categories: result, totalRating: getRating(locale, total) };
  }, [matrix, locale]);

  if (!categories.length) {
    return;
  }

  return (
    <div className='mt-16 flex w-full flex-col'>
      <span className='mb-8 flex w-full flex-row items-center gap-x-16 px-16'>
        <h2 className='text-tm20 text-basic-400 flex-1'>{t('result')}</h2>
        <Badge size='s'>{totalRating}</Badge>
      </span>
      <CollapseGroup joined>
        {categories.map(({ id, title, rating, competencies }) => (
          <Collapse
            key={id}
            summary={
              <>
                <h3 className='text-t16 text-basic-400 flex-1'>{title}</h3>
                <Badge
                  size='s'
                  color='primary'
                  theme='border'
                >
                  {rating}
                </Badge>
              </>
            }
          >
            <ul className='divide-secondary-100 flex w-full flex-col divide-y'>
              {competencies.map((item) => {
                const itemLevel = getLevelName(levels, item.rating);

                return (
                  <li
                    className='flex w-full flex-row items-center gap-x-16 py-12'
                    key={item.id}
                  >
                    <h4 className='text-t16 text-basic-400 flex-1'>{item.title}</h4>
                    <span className='flex flex-row items-center gap-x-8'>
                      {itemLevel && (
                        <Badge
                          size='s'
                          color='secondary'
                          theme='border'
                        >
                          {itemLevel}
                        </Badge>
                      )}
                      <Badge
                        size='s'
                        color='secondary'
                        theme='border'
                      >
                        {item.rating}
                      </Badge>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Collapse>
        ))}
      </CollapseGroup>
    </div>
  );
};

export default CategoryList;

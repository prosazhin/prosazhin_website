import { getFormatJobPeriod } from '@/utils/formatter';
import { Badge } from '@prosazhin/pbcomponents';
import clsx from 'clsx';

// Содержимое места работы: рамку задаёт отдельная карточка или общая карточка группы.
const JobCard = ({ job, locale, t, showPeriod = true, nested = false }) => {
  const { entry, extra, positions } = job;
  const { url, dateFrom, dateTo } = extra;
  const period = showPeriod ? getFormatJobPeriod(dateFrom, dateTo, locale, t) : null;
  const Title = nested ? 'h4' : 'h3';
  const PositionTitle = nested ? 'h5' : 'h4';

  return (
    <section
      className='flex w-full scroll-mt-96 flex-col gap-y-8'
      id={entry.type}
    >
      <div className='flex w-full flex-col gap-y-8'>
        {period && (
          <span className={clsx('text-basic-300 w-full', nested ? 'text-t14' : 'text-t16')}>
            {period}
          </span>
        )}
        <div className={clsx('flex w-full flex-col', nested ? 'gap-y-2' : 'gap-y-4')}>
          <Title className={clsx('text-basic-400 link w-full', nested ? 'text-tm20' : 'text-h32')}>
            {url ? (
              <a
                href={url}
                target='_blank'
                rel='noreferrer'
              >
                {entry.title}
              </a>
            ) : (
              <>{entry.title}</>
            )}
          </Title>
          {entry.subtitle && (
            <span className={clsx('text-basic-400 w-full', nested ? 'text-t14' : 'text-t16')}>
              {entry.subtitle}
            </span>
          )}
        </div>
      </div>
      <ul className={clsx('flex w-full flex-col', nested ? 'gap-y-12' : 'gap-y-16')}>
        {positions.map((position) => {
          const detailsList = entry.details?.[position.type];
          const hasDetails = Array.isArray(detailsList) && detailsList.length > 0;
          return (
            <li
              className='mt-4 mr-4'
              key={position.type}
            >
              <PositionTitle
                className={clsx('text-basic-400 w-full', nested ? 'text-tm16' : 'text-tm20')}
              >
                {t(`career:positions.${position.type}`)}
              </PositionTitle>
              <p className='text-t16 text-basic-400 mt-4 w-full'>
                {entry.positions?.[position.type] ?? ''}
              </p>
              {hasDetails && (
                <ul className='mt-8 flex w-full flex-col gap-4'>
                  {detailsList.map((detail, i) => {
                    const { text, items } = typeof detail === 'string' ? { text: detail } : detail;
                    const hasItems = Array.isArray(items) && items.length > 0;

                    return (
                      <li
                        key={`${position.type}-${i}`}
                        className='flex w-full flex-col gap-4'
                      >
                        <div className='flex gap-x-8'>
                          <span className='text-t14'>—</span>
                          <span
                            className='text-t14 text-basic-400 flex-1'
                            dangerouslySetInnerHTML={{ __html: text }}
                          />
                        </div>
                        {hasItems && (
                          <ul className='flex w-full flex-col gap-4 pl-20'>
                            {items.map((subItem, j) => (
                              <li
                                key={`${position.type}-${i}-${j}`}
                                className='flex gap-x-8'
                              >
                                <span className='text-t14'>—</span>
                                <span
                                  className='text-t14 text-basic-400 flex-1'
                                  dangerouslySetInnerHTML={{ __html: subItem }}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              <ul
                className={clsx('flex w-full flex-row flex-wrap gap-4', nested ? 'mt-12' : 'mt-16')}
              >
                {position.stack.map((tool) => (
                  <li key={tool}>
                    <Badge
                      size='s'
                      color='secondary'
                      theme='light'
                      className='print:border-secondary-200 print:border'
                    >
                      {tool}
                    </Badge>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default JobCard;

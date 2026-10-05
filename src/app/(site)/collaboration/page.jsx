import LinkList from '@/components/LinkList';
import SectionHeader from '@/components/SectionHeader';
import { initTranslations } from '@/i18n';
import { getLocale } from '@/utils/get-locale';
import getMetadata from '@/utils/get-metadata';
import {
  CheckIcon as CheckSolidIcon,
  XMarkIcon as XMarkSolidIcon,
} from '@heroicons/react/20/solid';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Badge, Button, Container } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import Image from 'next/image';
import NextLink from 'next/link';

const HELP_ICONS = {
  design: PencilSquareIcon,
  development: CodeBracketIcon,
  ai: SparklesIcon,
};

const WHY_ICONS = {
  chart: ChartBarIcon,
  rocket: RocketLaunchIcon,
  building: BuildingOffice2Icon,
  users: UserGroupIcon,
  shield: ShieldCheckIcon,
  globe: GlobeAltIcon,
};

const FIT = {
  yes: { Icon: CheckSolidIcon, iconClassName: 'text-success-300' },
  no: { Icon: XMarkSolidIcon, iconClassName: 'text-danger-300' },
};

const formatIndex = (index) => String(index + 1).padStart(2, '0');

// Карточка проекта целиком — ссылка на его документацию или страницу
const ProjectLink = ({ title, description, url }) => (
  <NextLink
    href={url}
    className='group rounded-16 border-secondary-200 bg-basic-0 hover:border-primary-300 flex w-full flex-col gap-y-4 border p-20 no-underline! transition-colors duration-150'
  >
    <span className='text-tm20 text-basic-400 group-hover:text-primary-400 flex flex-row items-center justify-between gap-x-8 transition-colors duration-150'>
      {title}
      <ArrowRightIcon
        aria-hidden='true'
        className='size-20 shrink-0'
      />
    </span>
    <span className='text-t16 text-basic-300'>{description}</span>
  </NextLink>
);

// Секция с заголовком слева (от 1200px он «прилипает» при прокрутке) и контентом справа;
// уже — заголовок над контентом, иначе правая колонка слишком узкая
const SideSection = ({ title, description, children }) => (
  <section className='grid w-full grid-cols-1 gap-y-24 min-[1200px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[1200px]:gap-x-64'>
    <div className='flex flex-col gap-y-12 self-start min-[1200px]:sticky min-[1200px]:top-112'>
      <h2 className='text-h32 text-basic-400 tracking-[-0.02em]'>{title}</h2>
      {description && <p className='text-t16 text-basic-400'>{description}</p>}
    </div>
    <div className='min-w-0'>{children}</div>
  </section>
);

// Вертикальная цепочка шагов для схемы «Обычно / Со мной»
const StepChain = ({ steps, inverted }) => (
  <ol className='flex flex-col'>
    {steps.map((step, index) => (
      <li
        key={step}
        className='flex flex-row gap-x-12'
      >
        <span
          aria-hidden='true'
          className='flex w-12 shrink-0 flex-col items-center pt-6'
        >
          <span
            className={clsx(
              'rounded-999 size-12 shrink-0 border-2',
              inverted ? 'border-basic-0 bg-basic-0' : 'border-basic-300'
            )}
          />
          {index < steps.length - 1 && (
            <span
              className={clsx(
                'mt-6 min-h-16 w-0 flex-1 border-l-2',
                inverted ? 'border-basic-0' : 'border-secondary-200 border-dashed'
              )}
            />
          )}
        </span>
        <span
          className={clsx(
            'text-t16 pb-16',
            inverted ? 'text-basic-0 font-semibold' : 'text-basic-400'
          )}
        >
          {step}
        </span>
      </li>
    ))}
  </ol>
);

const CollaborationPage = async () => {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);
  const [{ default: contacts }, { DESIGN_SYSTEM_URL, projectLinks, moreLinks }] = await Promise.all(
    [import('@/data/contacts'), import('@/data/collaboration')]
  );

  const tr = (key, options) => t(key, { ns: 'collaboration', ...options });
  const list = (key) => tr(key, { returnObjects: true });

  const email = contacts.find(({ url }) => url.startsWith('mailto:'));
  const telegram = contacts.find(({ url }) => url.startsWith('https://t.me/'));
  const steps = list('how.steps');
  // Названия и описания пакетов — из общего namespace projects
  const projectEntries = t('projects:entries', { returnObjects: true });
  const toProject = ({ slug, url }) => {
    const { title, description } = projectEntries.find((entry) => entry.slug === slug);
    return { slug, title, description, url };
  };
  const designSystem = {
    url: DESIGN_SYSTEM_URL,
    packages: projectLinks.designSystem.map(toProject),
  };
  const tools = projectLinks.tools.map(toProject);

  return (
    <Container size='m'>
      <div className='desktop:gap-y-112 flex w-full flex-col gap-y-72'>
        {/* Первый экран: текст и визитка */}
        <section className='grid w-full grid-cols-1 items-center gap-y-40 min-[1200px]:grid-cols-[minmax(0,1fr)_360px] min-[1200px]:gap-x-64'>
          <div className='desktop:gap-y-32 flex flex-col items-start gap-y-24'>
            <h1 className='text-h32 sm-min:text-h48 lg-min:text-h64 text-basic-400 tracking-[-0.03em]'>
              {tr('hero.titleStart')}
              <span className='text-primary-300'>{tr('hero.titleAccent')}</span>
            </h1>
            <p className='text-t16 desktop:text-t20 text-basic-400 max-w-[640px]'>
              {tr('hero.description')}
            </p>
            <div className='desktop:mt-24 mt-16 flex flex-row flex-wrap gap-12'>
              <Button
                size='l'
                color='primary'
                theme='filled'
                href={telegram.url}
                target='_blank'
                rel='noreferrer'
              >
                {tr('hero.telegram')}
              </Button>
              <Button
                size='l'
                color='secondary'
                theme='border'
                href={email.url}
              >
                {tr('hero.email')}
              </Button>
            </div>
          </div>

          <div className='rounded-24 border-secondary-200 bg-basic-0 flex flex-col gap-y-20 border p-24'>
            <div className='flex flex-row items-center gap-x-16'>
              <Image
                className='rounded-999 size-64 shrink-0'
                width={64}
                height={64}
                src='/avatar.jpg'
                alt=''
              />
              <div className='flex min-w-0 flex-col gap-y-2'>
                <span className='text-tm20 text-basic-400'>{t('name')}</span>
                <span className='text-t14 text-basic-300'>{tr('card.role')}</span>
              </div>
            </div>
            <dl className='sm-min:grid-cols-2 sm-min:gap-x-24 grid grid-cols-1 min-[1200px]:grid-cols-1'>
              {list('card.rows').map((row) => (
                <div
                  key={row.label}
                  className='border-secondary-200 flex flex-col gap-y-2 border-t py-12 last:pb-0'
                >
                  <dt className='text-t14 text-basic-300'>{row.label}</dt>
                  <dd className='text-t16 text-basic-400'>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Чем могу помочь */}
        <SideSection
          title={tr('help.title')}
          description={tr('help.description')}
        >
          <ul className='flex flex-col'>
            {Object.entries(HELP_ICONS).map(([key, HelpIcon]) => (
              <li
                key={key}
                className='border-secondary-200 flex flex-col gap-y-16 border-t py-32 first:border-t-0 first:pt-0'
              >
                <div className='flex flex-row items-center gap-x-12'>
                  <span className='rounded-12 bg-primary-50 text-primary-400 flex size-40 shrink-0 items-center justify-center'>
                    <HelpIcon
                      aria-hidden='true'
                      className='size-20'
                    />
                  </span>
                  <h3 className='text-h24 text-basic-400 tracking-[-0.02em]'>
                    {tr(`help.items.${key}.title`)}
                  </h3>
                </div>
                <p className='text-t16 text-basic-400 max-w-[640px]'>
                  {tr(`help.items.${key}.text`)}
                </p>
                <ul className='flex flex-row flex-wrap gap-8'>
                  {list(`help.items.${key}.features`).map((feature) => (
                    <li key={feature}>
                      <Badge
                        size='m'
                        color='secondary'
                        theme='light'
                      >
                        {feature}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </SideSection>

        {/* Почему дизайн и код у одного человека */}
        <SideSection
          title={tr('why.title')}
          description={tr('why.description')}
        >
          <div className='flex flex-col gap-y-40'>
            <div className='md-min:grid-cols-2 grid grid-cols-1 gap-16'>
              <div className='rounded-24 border-secondary-200 flex flex-col gap-y-20 border border-dashed p-24'>
                <h3 className='text-tm20 text-basic-300'>{tr('why.usual.title')}</h3>
                <StepChain steps={list('why.usual.steps')} />
                <p className='text-t14 text-basic-300 mt-auto'>{tr('why.usual.text')}</p>
              </div>
              <div className='rounded-24 bg-primary-300 flex flex-col gap-y-20 p-24'>
                <h3 className='text-tm20 text-basic-0'>{tr('why.me.title')}</h3>
                <StepChain
                  steps={list('why.me.steps')}
                  inverted
                />
                <p className='text-t14 text-basic-0 mt-auto'>{tr('why.me.text')}</p>
              </div>
            </div>
            <ul className='sm-min:grid-cols-2 grid grid-cols-1 gap-16'>
              {list('why.items').map((item) => {
                const ItemIcon = WHY_ICONS[item.icon];

                return (
                  <li
                    key={item.title}
                    className='rounded-24 bg-basic-50 flex flex-col items-start gap-y-12 p-24'
                  >
                    <div className='flex flex-row items-center gap-x-12'>
                      <ItemIcon
                        aria-hidden='true'
                        className='text-primary-300 size-24 shrink-0'
                      />
                      <h3 className='text-tm20 text-basic-400'>{item.title}</h3>
                    </div>
                    <div className='flex flex-col items-start gap-y-4'>
                      <p className='text-t16 text-basic-400'>{item.text}</p>
                      {item.link && (
                        <LinkList
                          className='mt-8'
                          items={[{ title: item.link, url: DESIGN_SYSTEM_URL }]}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </SideSection>

        {/* Проекты: дизайн-система с пакетами внутри и два генератора тем */}
        <section className='desktop:gap-y-32 flex w-full flex-col gap-y-24'>
          <SectionHeader
            title={tr('projects.title')}
            description={tr('projects.description')}
          />
          <div className='grid w-full grid-cols-1 gap-16 min-[1200px]:grid-cols-3'>
            <div className='rounded-24 bg-basic-50 desktop:p-32 flex flex-col gap-y-24 p-24 min-[1200px]:col-span-2'>
              <NextLink
                href={designSystem.url}
                className='group flex flex-col items-start gap-y-8 no-underline!'
              >
                <span className='text-h24 desktop:text-h32 text-basic-400 group-hover:text-primary-400 flex flex-row items-center gap-x-8 tracking-[-0.02em] transition-colors duration-150'>
                  {tr('projects.designSystem.title')}
                  <ArrowRightIcon
                    aria-hidden='true'
                    className='size-24 shrink-0'
                  />
                </span>
                <span className='text-t16 text-basic-400'>{tr('projects.designSystem.text')}</span>
              </NextLink>
              <ul className='sm-min:grid-cols-2 mt-auto grid grid-cols-1 gap-12'>
                {designSystem.packages.map((item) => (
                  <li
                    key={item.slug}
                    className='flex'
                  >
                    <ProjectLink {...item} />
                  </li>
                ))}
              </ul>
            </div>
            <ul className='sm-min:grid-cols-2 grid grid-cols-1 gap-16 min-[1200px]:flex min-[1200px]:flex-col'>
              {tools.map((item) => (
                <li
                  key={item.slug}
                  className='flex flex-1'
                >
                  <ProjectLink {...item} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Как мы будем работать: шкала с точками — горизонтальная от 1200px, вертикальная ниже */}
        <section className='desktop:gap-y-56 flex w-full flex-col gap-y-32'>
          <SectionHeader title={tr('how.title')} />
          <ol className='relative grid grid-cols-1 min-[1200px]:grid-cols-4 min-[1200px]:gap-x-32'>
            <span
              aria-hidden='true'
              className='bg-secondary-200 absolute top-15 right-[calc((100%_-_96px)/4_-_16px)] left-16 hidden h-2 min-[1200px]:block'
            />
            {steps.map((step, index) => (
              <li
                key={step.title}
                className='relative flex flex-row gap-x-16 pb-32 last:pb-0 min-[1200px]:flex-col min-[1200px]:gap-y-20 min-[1200px]:pb-0'
              >
                {index < steps.length - 1 && (
                  <span
                    aria-hidden='true'
                    className='bg-secondary-200 absolute top-32 bottom-0 left-15 w-2 min-[1200px]:hidden'
                  />
                )}
                <span className='rounded-999 bg-primary-300 text-t12 text-basic-0 ring-basic-0 relative flex size-32 shrink-0 items-center justify-center font-mono ring-4'>
                  {formatIndex(index)}
                </span>
                <div className='flex flex-col gap-y-8'>
                  <h3 className='text-tm20 text-basic-400'>{step.title}</h3>
                  <p className='text-t16 text-basic-400'>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Кому подойду */}
        <section className='desktop:gap-y-32 flex w-full flex-col gap-y-24'>
          <SectionHeader title={tr('fit.title')} />
          <div className='md-min:grid-cols-2 grid w-full grid-cols-1 gap-16'>
            {Object.entries(FIT).map(([key, { Icon: FitIcon, iconClassName }]) => (
              <div
                key={key}
                className='rounded-24 bg-basic-50 desktop:p-40 flex flex-col gap-y-20 p-24'
              >
                <h3 className='text-tm24 text-basic-400'>{tr(`fit.${key}Title`)}</h3>
                <ul className='flex flex-col gap-y-12'>
                  {list(`fit.${key}`).map((item) => (
                    <li
                      key={item}
                      className='text-t16 text-basic-400 flex flex-row items-start gap-x-12'
                    >
                      <FitIcon
                        aria-hidden='true'
                        className={clsx('mt-2 size-20 shrink-0', iconClassName)}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Контакты */}
        <section className='rounded-24 bg-basic-400 desktop:p-64 flex w-full flex-col gap-y-40 p-24'>
          <div className='desktop:gap-y-16 flex max-w-[720px] flex-col gap-y-12'>
            <h2 className='text-h32 desktop:text-h48 text-basic-0 tracking-[-0.02em]'>
              {tr('contact.title')}
            </h2>
            <p className='text-t16 desktop:text-t20 text-basic-0'>{tr('contact.text')}</p>
          </div>
          <div className='flex flex-col items-start gap-y-12'>
            <a
              href={telegram.url}
              target='_blank'
              rel='noreferrer'
              className='group text-h24 sm-min:text-h32 desktop:text-h48 text-basic-0 hover:text-primary-200 flex max-w-full flex-row items-center gap-x-12 tracking-[-0.02em] break-all no-underline! transition-colors duration-150'
            >
              @{telegram.url.split('/').pop()}
              <ArrowUpRightIcon
                aria-hidden='true'
                className='desktop:size-40 size-24 shrink-0'
              />
            </a>
            <a
              href={email.url}
              className='group text-tm16 desktop:text-tm20 text-basic-0 no-underline! transition-colors duration-150'
            >
              {tr('contact.email')}{' '}
              <span className='group-hover:text-primary-200 underline decoration-1 underline-offset-4'>
                {email.title}
              </span>
            </a>
          </div>
          <div className='border-basic-0/15 flex flex-col gap-y-12 border-t pt-24'>
            <span className='text-t14 text-basic-0'>{tr('contact.more')}</span>
            <ul className='sm-min:flex-row sm-min:flex-wrap sm-min:gap-x-24 flex flex-col gap-y-8'>
              {moreLinks.map(({ key, url }) => {
                const className =
                  'text-tm16 text-basic-0 hover:text-primary-200 no-underline! transition-colors duration-150';

                return (
                  <li key={key}>
                    {url.startsWith('/') ? (
                      <NextLink
                        href={url}
                        className={className}
                      >
                        {tr(`contact.links.${key}`)}
                      </NextLink>
                    ) : (
                      <a
                        href={url}
                        target='_blank'
                        rel='noreferrer'
                        className={clsx(className, 'inline-flex items-center gap-x-4')}
                      >
                        {tr(`contact.links.${key}`)}
                        <ArrowUpRightIcon
                          aria-hidden='true'
                          className='size-16'
                        />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </Container>
  );
};

export async function generateMetadata() {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);

  return getMetadata({
    locale,
    title: `${t('collaboration:metaTitle')} | ${t('metaTitle')}`,
    description: t('collaboration:metaDescription'),
    pathname: '/collaboration',
  });
}

export default CollaborationPage;

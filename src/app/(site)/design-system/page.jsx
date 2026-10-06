import ActionButtons from '@/components/ActionButtons';
import CodeBlock from '@/components/CodeBlock';
import ContactSection from '@/components/ContactSection';
import CopyCommand from '@/components/CopyCommand';
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
  CheckIcon,
  MoonIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  SwatchIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { Badge, Button, Container } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import NextLink from 'next/link';

const WHY_ICONS = {
  shield: ShieldCheckIcon,
  squares: Squares2X2Icon,
  swatch: SwatchIcon,
  moon: MoonIcon,
  rocket: RocketLaunchIcon,
  user: UserPlusIcon,
};

const FIT = {
  yes: { Icon: CheckSolidIcon, iconClassName: 'text-success-300' },
  no: { Icon: XMarkSolidIcon, iconClassName: 'text-danger-300' },
};

const formatIndex = (index) => String(index + 1).padStart(2, '0');

const DesignSystemPage = async () => {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);
  const [
    { default: projectsBySlug },
    { INSTALL_COMMAND, ctaButtons, ctaLinks, libraries, flowSteps, cycleSteps },
  ] = await Promise.all([import('@/data/projects'), import('@/data/design-system')]);

  const tr = (key, options) => t(key, { ns: 'design-system', ...options });
  const list = (key) => tr(key, { returnObjects: true });

  const flowTitles = list('flow.items');

  const docsButtons = ctaButtons.map(({ key, ...rest }) => ({
    ...rest,
    title: tr(`cta.buttons.${key}`),
  }));
  const repoLinks = ctaLinks.map(({ key, url }) => ({ title: tr(`cta.links.${key}`), url }));

  // Карточка целиком ведёт на href проекта (по умолчанию — документация), поэтому эта
  // ссылка из тегов убирается. У tailwind-dictionary своя страница, и docs остаётся тегом.
  const libraryCards = libraries.map(({ slug, accent }) => {
    const { href, resourceLinks } = projectsBySlug[slug];
    const cardHref = href ?? resourceLinks[0].url;

    return {
      slug,
      accent,
      href: cardHref,
      role: tr(`libraries.items.${slug}.role`),
      description: tr(`libraries.items.${slug}.description`),
      features: list(`libraries.items.${slug}.features`),
      links: resourceLinks
        .filter((link) => link.url !== cardHref)
        .map((link) => ({
          title: link.title === 'docs' ? tr('libraries.docs') : link.title,
          url: link.url,
        })),
    };
  });

  const steps = list('cycle.steps').map((step, index) => {
    const { links, ...rest } = cycleSteps[index];
    return {
      ...step,
      ...rest,
      links: links?.map(({ key, url }) => ({ title: tr(`cycle.links.${key}`), url })),
    };
  });

  return (
    <Container size='m'>
      <div className='desktop:gap-y-112 flex w-full flex-col gap-y-72'>
        {/* Первый экран, попробовать и путь цвета идут плотнее остальных секций */}
        <div className='desktop:gap-y-56 flex w-full flex-col gap-y-40'>
          {/* Первый экран */}
          <section className='desktop:gap-y-32 flex w-full flex-col items-start gap-y-24'>
            <h1 className='text-h32 sm-min:text-h48 lg-min:text-h64 text-basic-400 max-w-[960px] tracking-[-0.03em]'>
              {tr('hero.titleStart')}
              <span className='text-primary-300'>{tr('hero.titleAccent')}</span>
            </h1>
            <p className='text-t16 desktop:text-t20 text-basic-400 max-w-[760px]'>
              {tr('hero.description')}
            </p>
          </section>

          {/* Попробовать: установка, документация, репозитории и файлы Figma */}
          <section className='rounded-24 bg-basic-50 desktop:p-40 desktop:gap-y-24 flex w-full flex-col items-start gap-y-20 p-24'>
            <div className='desktop:gap-y-16 flex max-w-[720px] flex-col gap-y-12'>
              <h2 className='text-h32 desktop:text-h48 text-basic-400 tracking-[-0.02em]'>
                {tr('cta.title')}
              </h2>
              <p className='text-t16 desktop:text-t20 text-basic-400'>{tr('cta.text')}</p>
            </div>
            <div className='flex w-full min-w-0 flex-col items-start gap-y-16'>
              <CopyCommand
                command={INSTALL_COMMAND}
                copyLabel={tr('cta.copy')}
                copiedLabel={tr('cta.copied')}
                surface='base'
              />
              <ActionButtons items={docsButtons} />
              <LinkList items={repoLinks} />
            </div>
          </section>

          {/* Путь одного цвета: токен primary-300 на каждом шаге, меняется вместе с темой.
              Пять карточек в ряд помещаются только от ~1200px, ниже — столбик. */}
          <section className='rounded-24 bg-basic-50 desktop:p-32 flex w-full flex-col gap-y-24 p-20'>
            <div className='flex max-w-[640px] flex-col gap-y-4'>
              <h2 className='text-tm20 text-basic-400'>{tr('flow.title')}</h2>
              <p className='text-t16 text-basic-400'>{tr('flow.text')}</p>
            </div>
            <ol className='relative grid w-full grid-cols-1 gap-12 min-[1200px]:grid-cols-5'>
              <span
                aria-hidden='true'
                className='bg-primary-200 absolute inset-x-0 top-1/2 hidden h-2 min-[1200px]:block'
              />
              {flowSteps.map((step, index) => (
                <li
                  key={flowTitles[index]}
                  className='rounded-16 border-secondary-200 bg-basic-0 relative flex flex-col gap-12 border p-16 min-[1200px]:min-h-144 min-[1200px]:gap-16'
                >
                  <span className='text-t14 text-basic-300 flex flex-row gap-x-8'>
                    <span className='text-primary-300 font-mono'>{formatIndex(index)}</span>
                    {flowTitles[index]}
                  </span>
                  <div className='flex min-h-32 flex-row items-center gap-x-8 min-[1200px]:mt-auto'>
                    {step.swatch && (
                      <span
                        aria-hidden='true'
                        className='rounded-8 bg-primary-300 size-32 shrink-0'
                      />
                    )}
                    {step.code && (
                      <code className='text-t14 text-basic-400 font-mono whitespace-nowrap'>
                        {step.code}
                      </code>
                    )}
                    {step.button && (
                      <Button
                        size='m'
                        color='primary'
                        theme='filled'
                        // Декоративная кнопка-пример: не фокусируется и скрыта от скринридеров.
                        tabIndex={-1}
                        aria-hidden='true'
                        className='max-xs:w-auto! pointer-events-none'
                      >
                        {tr('flow.button')}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Зачем */}
        <section className='desktop:gap-y-32 flex w-full flex-col gap-y-24'>
          <SectionHeader
            title={tr('why.title')}
            description={tr('why.description')}
          />
          <div className='flex w-full flex-col gap-16'>
            {/* Два главных аргумента — в одну строку, под ними подробности */}
            <ul className='md-min:grid-cols-2 grid w-full grid-cols-1 gap-16'>
              <li className='rounded-24 bg-primary-300 desktop:p-40 flex flex-col gap-y-12 p-24'>
                <h3 className='text-h24 desktop:text-h32 text-basic-0 tracking-[-0.02em]'>
                  {tr('why.accent.title')}
                </h3>
                <p className='text-t16 desktop:text-t20 text-basic-0'>{tr('why.accent.text')}</p>
              </li>
              <li className='rounded-24 bg-basic-400 desktop:p-40 flex flex-col gap-y-12 p-24'>
                <h3 className='text-h24 desktop:text-h32 text-basic-0 tracking-[-0.02em]'>
                  {tr('why.ai.title')}
                </h3>
                <p className='text-t16 desktop:text-t20 text-basic-0'>{tr('why.ai.text')}</p>
              </li>
            </ul>
            <ul className='md-min:grid-cols-2 lg-min:grid-cols-3 grid w-full grid-cols-1 gap-16'>
              {list('why.items').map((item) => {
                const ItemIcon = WHY_ICONS[item.icon];

                return (
                  <li
                    key={item.title}
                    className='rounded-24 bg-basic-50 desktop:p-32 flex flex-col gap-y-16 p-24'
                  >
                    <span className='rounded-12 bg-primary-50 text-primary-400 flex size-48 items-center justify-center'>
                      <ItemIcon
                        aria-hidden='true'
                        className='size-24'
                      />
                    </span>
                    <div className='flex flex-col gap-y-8'>
                      <h3 className='text-tm20 text-basic-400'>{item.title}</h3>
                      <p className='text-t16 text-basic-400'>{item.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Библиотеки */}
        <section className='desktop:gap-y-32 flex w-full flex-col gap-y-24'>
          <SectionHeader
            title={tr('libraries.title')}
            description={tr('libraries.description')}
          />
          <ul className='md-min:grid-cols-2 grid w-full grid-cols-1 gap-16'>
            {libraryCards.map((library) => (
              <li
                key={library.slug}
                className={clsx(
                  'group rounded-24 desktop:p-40 relative flex flex-col gap-y-24 p-24 transition-colors duration-150',
                  library.accent
                    ? 'bg-basic-50 hover:bg-primary-50'
                    : 'border-secondary-200 hover:border-primary-300 border'
                )}
              >
                <div className='flex flex-col items-start gap-y-16'>
                  <Badge
                    size='s'
                    color={library.accent ? 'primary' : 'secondary'}
                    theme={library.accent ? 'light' : 'border'}
                  >
                    {library.role}
                  </Badge>
                  <div className='flex flex-col gap-y-8'>
                    <h3 className='text-h24 desktop:text-h32 text-basic-400 group-hover:text-primary-400 tracking-[-0.02em] transition-colors duration-150'>
                      {library.slug}
                    </h3>
                    <p className='text-t16 text-basic-400'>{library.description}</p>
                  </div>
                </div>
                <ul className='flex flex-1 flex-col gap-y-8'>
                  {library.features.map((feature) => (
                    <li
                      key={feature}
                      className='text-t16 text-basic-400 flex flex-row items-start gap-x-8'
                    >
                      <CheckIcon
                        aria-hidden='true'
                        className='text-primary-300 mt-4 size-16 shrink-0'
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* Ссылка растянута на всю карточку; теги-ссылки лежат поверх неё */}
                <NextLink
                  href={library.href}
                  aria-label={library.slug}
                  className='rounded-24 absolute inset-0 z-10'
                />
                <LinkList
                  items={library.links}
                  itemClassName='relative z-20'
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Как это устроено */}
        <section className='desktop:gap-y-56 flex w-full flex-col gap-y-32'>
          <SectionHeader
            title={tr('cycle.title')}
            description={tr('cycle.description')}
          />
          <ol className='flex w-full flex-col'>
            {steps.map((step, index) => (
              <li
                key={step.title}
                className='border-secondary-200 lg-min:grid-cols-[96px_minmax(0,5fr)_minmax(0,6fr)] lg-min:gap-x-40 grid grid-cols-1 gap-y-16 border-t py-32'
              >
                <span className='text-h24 desktop:text-h32 text-primary-300 font-mono'>
                  {formatIndex(index)}
                </span>
                <div
                  className={clsx(
                    'flex max-w-[560px] flex-col gap-y-20',
                    !step.code && 'lg-min:col-span-2'
                  )}
                >
                  <div className='flex flex-col gap-y-8'>
                    <h3 className='text-tm24 text-basic-400'>{step.title}</h3>
                    <p className='text-t16 text-basic-400'>{step.text}</p>
                  </div>
                  {step.links && (
                    <LinkList
                      items={step.links}
                      size='m'
                    />
                  )}
                </div>
                {step.code && (
                  <CodeBlock
                    file={step.file}
                    code={step.code}
                  />
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Кому подойдёт */}
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
        <ContactSection
          title={tr('contact.title')}
          text={tr('contact.text')}
          emailLabel={tr('contact.email')}
          telegramLabel={tr('contact.telegram')}
        />
      </div>
    </Container>
  );
};

export async function generateMetadata() {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);

  return getMetadata({
    locale,
    title: `${t('design-system:metaTitle')} | ${t('metaTitle')}`,
    description: t('design-system:metaDescription'),
    pathname: '/design-system',
  });
}

export default DesignSystemPage;

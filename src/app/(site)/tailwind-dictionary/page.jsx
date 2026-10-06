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
  CodeBracketSquareIcon,
  CommandLineIcon,
  DocumentTextIcon,
  MoonIcon,
  PaintBrushIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import { Container } from '@prosazhin/pbcomponents';
import clsx from 'clsx';
import ThemeDemo from './components/ThemeDemo';
import TokensDemo from './components/TokensDemo';

const WHY_ICONS = {
  document: DocumentTextIcon,
  figma: PaintBrushIcon,
  format: CodeBracketSquareIcon,
  moon: MoonIcon,
  versions: Square3Stack3DIcon,
  terminal: CommandLineIcon,
};

const FIT = {
  yes: { Icon: CheckSolidIcon, iconClassName: 'text-success-300' },
  no: { Icon: XMarkSolidIcon, iconClassName: 'text-danger-300' },
};

const formatIndex = (index) => String(index + 1).padStart(2, '0');

const TailwindDictionaryPage = async () => {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);
  const { INSTALL_COMMAND, links, demoInput, demoOutput, steps } =
    await import('@/data/tailwind-dictionary');

  const tr = (key, options) => t(key, { ns: 'tailwind-dictionary', ...options });
  const list = (key) => tr(key, { returnObjects: true });
  const toLinks = (keys, ns) => keys.map((key) => ({ title: tr(`${ns}.${key}`), url: links[key] }));

  const docsButtons = [
    { title: tr('cta.playground'), url: links.playground, primary: true },
    { title: tr('cta.docs'), url: links.docs },
  ];

  const stepItems = list('steps.items').map((step, index) => {
    const { link, ...rest } = steps[index];
    return { ...step, ...rest, links: link && toLinks([link], 'steps.links') };
  });

  return (
    <Container size='m'>
      <div className='desktop:gap-y-112 flex w-full flex-col gap-y-72'>
        {/* Первый экран, попробовать и демо идут плотнее, как первый экран дизайн-системы */}
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

          {/* Попробовать: установка, плейграунд и ссылки на пакет */}
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
              <LinkList items={toLinks(['github', 'npm', 'changelog'], 'cta.links')} />
            </div>
          </section>

          {/* Демо: токены на входе и тема на выходе, с переключателем версии Tailwind */}
          <section className='desktop:gap-y-32 flex w-full flex-col gap-y-24'>
            <SectionHeader
              title={tr('demo.title')}
              description={tr('demo.text')}
            />
            <TokensDemo
              input={demoInput}
              output={demoOutput}
              labels={{
                input: tr('demo.input'),
                inputFile: tr('demo.inputFile'),
                output: tr('demo.output'),
                version: tr('demo.version'),
              }}
            />
          </section>
        </div>

        {/* Зачем */}
        <section className='desktop:gap-y-32 flex w-full flex-col gap-y-24'>
          <SectionHeader
            title={tr('why.title')}
            description={tr('why.description')}
          />
          <div className='flex w-full flex-col gap-16'>
            <ul className='md-min:grid-cols-2 grid w-full grid-cols-1 gap-16'>
              <li className='rounded-24 bg-primary-300 desktop:p-40 flex flex-col gap-y-12 p-24'>
                <h3 className='text-h24 desktop:text-h32 text-basic-0 tracking-[-0.02em]'>
                  {tr('why.accent.title')}
                </h3>
                <p className='text-t16 desktop:text-t20 text-basic-0'>{tr('why.accent.text')}</p>
              </li>
              <li className='rounded-24 bg-basic-400 desktop:p-40 flex flex-col gap-y-12 p-24'>
                <h3 className='text-h24 desktop:text-h32 text-basic-0 tracking-[-0.02em]'>
                  {tr('why.dark.title')}
                </h3>
                <p className='text-t16 desktop:text-t20 text-basic-0'>{tr('why.dark.text')}</p>
              </li>
            </ul>
            <ul className='lg-min:grid-cols-3 grid w-full grid-cols-1 gap-16 min-[600px]:grid-cols-2'>
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

        {/* Темы: живой пример на стилях сайта */}
        <section className='desktop:gap-y-32 flex w-full flex-col gap-y-24'>
          <SectionHeader
            title={tr('themes.title')}
            description={tr('themes.description')}
          />
          <ThemeDemo
            labels={{
              label: tr('themes.label'),
              light: tr('themes.light'),
              dark: tr('themes.dark'),
              ...list('themes.card'),
            }}
          />
        </section>

        {/* Из Figma в код: отступ до списка шагов как в «Как это устроено» на дизайн-системе */}
        <section className='desktop:gap-y-56 flex w-full flex-col gap-y-32'>
          <SectionHeader
            title={tr('steps.title')}
            description={tr('steps.description')}
          />
          <ol className='flex w-full flex-col'>
            {stepItems.map((step, index) => (
              <li
                key={step.title}
                className='border-secondary-200 lg-min:grid-cols-[96px_minmax(0,5fr)_minmax(0,6fr)] lg-min:gap-x-40 grid grid-cols-1 gap-y-16 border-t py-32'
              >
                <span className='text-h24 desktop:text-h32 text-primary-300 font-mono'>
                  {formatIndex(index)}
                </span>
                <div className='flex max-w-[560px] flex-col gap-y-20'>
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
                <CodeBlock
                  file={step.file}
                  code={step.code}
                  wrap={false}
                />
              </li>
            ))}
          </ol>
        </section>

        {/* В реальном проекте */}
        <section className='rounded-24 bg-basic-50 desktop:p-40 grid w-full grid-cols-1 gap-32 p-24 min-[1200px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'>
          <div className='flex flex-col items-start gap-y-24'>
            <div className='desktop:gap-y-16 flex flex-col gap-y-12'>
              <h2 className='text-h32 desktop:text-h48 text-basic-400 tracking-[-0.02em]'>
                {tr('proof.title')}
              </h2>
              <p className='text-t16 desktop:text-t20 text-basic-400'>{tr('proof.text')}</p>
            </div>
            <LinkList
              items={toLinks(['designSystem', 'pbstylesConfig'], 'proof.links')}
              size='m'
            />
          </div>
          {/* От 1200px цифры столбиком справа от текста, уже — в ряд под ним */}
          <dl className='grid grid-cols-1 gap-16 min-[600px]:grid-cols-3 min-[1200px]:grid-cols-1 min-[1200px]:gap-y-0'>
            {list('proof.facts').map((fact) => (
              <div
                key={fact.label}
                className='min-[1200px]:border-secondary-200 flex flex-col gap-y-4 min-[1200px]:border-t min-[1200px]:py-16 min-[1200px]:first:border-t-0 min-[1200px]:first:pt-0 min-[1200px]:last:pb-0'
              >
                <dt className='text-t14 text-basic-300 order-2'>{fact.label}</dt>
                <dd className='text-h32 text-basic-400 order-1 tracking-[-0.02em]'>{fact.value}</dd>
              </div>
            ))}
          </dl>
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
    title: `${t('tailwind-dictionary:metaTitle')} | ${t('metaTitle')}`,
    description: t('tailwind-dictionary:metaDescription'),
    pathname: '/tailwind-dictionary',
  });
}

export default TailwindDictionaryPage;

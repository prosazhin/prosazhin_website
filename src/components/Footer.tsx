import Logo from '@/components/Logo';
import { initTranslations } from '@/i18n';
import { LangType } from '@/types';
import { ThemeType } from '@/utils/get-theme';
import { Container } from '@prosazhin/pbcomponents';
import dayjs from 'dayjs';
import NextLink from 'next/link';

const linkClassName =
  'text-t14 text-basic-300 hover:text-primary-400 no-underline! transition-colors duration-150';

const Footer = async ({ locale, theme }: { locale: LangType; theme: ThemeType }) => {
  const [{ t }, { default: contacts }, { footerNav }] = await Promise.all([
    initTranslations(locale),
    import('@/data/contacts'),
    import('@/data/nav'),
  ]);

  return (
    <footer className='border-secondary-200 desktop:pt-56 block w-full border-t pt-40 pb-24 print:hidden'>
      <Container size='m'>
        <div className='desktop:gap-y-48 flex w-full flex-col gap-y-32'>
          <div className='lg-min:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] md-min:grid-cols-3 grid w-full grid-cols-2 gap-x-24 gap-y-32'>
            <div className='lg-min:col-span-1 md-min:col-span-3 col-span-2'>
              <Logo
                locale={locale}
                theme={theme}
                loading='lazy'
              />
            </div>
            {footerNav.map((column) => (
              <nav
                key={column.type}
                aria-label={t(`footer.columns.${column.type}`)}
                className='flex flex-col gap-y-12'
              >
                <span className='text-tm14 text-basic-400'>
                  {t(`footer.columns.${column.type}`)}
                </span>
                <ul className='flex flex-col gap-y-8'>
                  {column.links.map((link) => {
                    const title = 'key' in link ? t(`footer.links.${link.key}`) : link.title;

                    return (
                      <li key={link.url}>
                        {link.url.startsWith('/') ? (
                          <NextLink
                            className={linkClassName}
                            href={link.url}
                          >
                            {title}
                          </NextLink>
                        ) : (
                          <a
                            className={linkClassName}
                            href={link.url}
                            target='_blank'
                            rel='noreferrer'
                          >
                            {title}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
          <div className='border-secondary-200 flex w-full flex-col gap-y-16 border-t pt-24'>
            <ul className='desktop:flex-row desktop:flex-wrap desktop:gap-x-32 flex flex-col gap-y-8'>
              {contacts.map((contact) => (
                <li
                  className='link inline-block'
                  key={contact.url}
                >
                  {contact.link ? (
                    <a
                      className='text-tm16'
                      href={contact.url}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {contact.title}
                    </a>
                  ) : (
                    <span className='text-tm16 text-basic-400'>{contact.title}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className='desktop:flex-row desktop:items-center desktop:gap-x-16 flex flex-col gap-y-8'>
              <span className='text-t12 text-basic-300'>
                © 2017 — {dayjs().format('YYYY')}, {t('name')}
              </span>
              <NextLink
                className='text-t12 text-basic-300 underline-offset-2 hover:underline'
                href='/privacy'
              >
                {t('privacyPolicy')}
              </NextLink>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

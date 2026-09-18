import { initTranslations } from '@/i18n';
import { LangType } from '@/types';
import { Container } from '@prosazhin/pbcomponents';
import dayjs from 'dayjs';
import NextLink from 'next/link';

const Footer = async ({ locale }: { locale: LangType }) => {
  const [{ t }, { default: contacts }] = await Promise.all([
    initTranslations(locale),
    import('@/data/contacts'),
  ]);

  return (
    <footer className='border-secondary-200 block w-full border-t py-24 print:hidden'>
      <Container size='m'>
        <div className='flex w-full flex-col gap-y-16'>
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
      </Container>
    </footer>
  );
};

export default Footer;

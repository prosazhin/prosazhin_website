import contacts from '@/data/contacts';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

const email = contacts.find(({ url }) => url.startsWith('mailto:'))!;
const telegram = contacts.find(({ url }) => url.startsWith('https://t.me/'))!;

// Крупные карточки почты и Telegram для финального блока лендинговых страниц.
const ContactLinks = ({
  emailLabel,
  telegramLabel,
}: {
  emailLabel: string;
  telegramLabel: string;
}) => (
  <ul className='md-min:grid-cols-2 grid w-full max-w-[800px] grid-cols-1 gap-16'>
    {[
      { label: emailLabel, value: email.title, url: email.url, external: false },
      {
        label: telegramLabel,
        value: `@${telegram.url.split('/').pop()}`,
        url: telegram.url,
        external: true,
      },
    ].map(({ label, value, url, external }) => (
      <li key={url}>
        <a
          href={url}
          {...(external && { target: '_blank', rel: 'noreferrer' })}
          className='group rounded-16 bg-basic-0 border-secondary-200 hover:border-primary-300 max-xs:px-16 flex flex-row items-center gap-x-16 border px-24 py-20 no-underline! transition-colors duration-150'
        >
          <span className='flex min-w-0 flex-1 flex-col'>
            <span className='text-t14 text-basic-300'>{label}</span>
            <span className='text-tm20 max-xs:text-tm16 text-basic-400 group-hover:text-primary-400 truncate transition-colors duration-150'>
              {value}
            </span>
          </span>
          <ArrowUpRightIcon
            aria-hidden='true'
            className='text-basic-300 group-hover:text-primary-400 size-24 shrink-0 transition-colors duration-150'
          />
        </a>
      </li>
    ))}
  </ul>
);

export default ContactLinks;

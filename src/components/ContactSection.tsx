import ContactLinks from '@/components/ContactLinks';

// Финальный блок с контактами на лендинговых страницах (дизайн-система, tailwind-dictionary).
const ContactSection = ({
  title,
  text,
  emailLabel,
  telegramLabel,
}: {
  title: string;
  text: string;
  emailLabel: string;
  telegramLabel: string;
}) => (
  <section className='rounded-24 bg-primary-50 desktop:p-64 flex w-full flex-col gap-y-32 p-24'>
    <div className='desktop:gap-y-16 flex max-w-[720px] flex-col gap-y-12'>
      <h2 className='text-h32 desktop:text-h48 text-basic-400 tracking-[-0.02em]'>{title}</h2>
      <p className='text-t16 desktop:text-t20 text-basic-400'>{text}</p>
    </div>
    <ContactLinks
      emailLabel={emailLabel}
      telegramLabel={telegramLabel}
    />
  </section>
);

export default ContactSection;

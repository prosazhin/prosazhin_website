// Заголовок секции на лендинговых страницах (дизайн-система, сотрудничество).
const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className='desktop:gap-y-16 flex max-w-[760px] flex-col gap-y-12'>
    <h2 className='text-h32 desktop:text-h48 text-basic-400 tracking-[-0.02em]'>{title}</h2>
    {description && <p className='text-t16 desktop:text-t20 text-basic-400'>{description}</p>}
  </div>
);

export default SectionHeader;

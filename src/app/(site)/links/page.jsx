import { initTranslations } from '@/i18n';
import { getLocale } from '@/utils/get-locale';
import getMetadata from '@/utils/get-metadata';
import { Alert, Container } from '@prosazhin/pbcomponents';
import List from './components/List';
import Search from './components/Search';
import TagList from './components/TagList';

const LinksPage = async () => {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);
  const [{ default: linksData }, { default: compilationsData }, { default: tagsData }] =
    await Promise.all([
      import('@/data/links'),
      import('@/data/compilations'),
      import('@/data/tags'),
    ]);

  const tagsArray = Object.entries(tagsData).map(([id, { title, url }]) => ({
    id,
    title,
    url,
  }));

  const linksNormalized = linksData.map((item) => ({
    ...item,
    tags: (item.tags || []).map((slug) => {
      const tag = tagsData[slug];
      return tag
        ? { id: slug, title: tag.title, url: tag.url }
        : { id: slug, title: slug, url: slug };
    }),
  }));

  const linksById = new Map(linksNormalized.map((l) => [l.id, l]));

  const compilationsNormalized = compilationsData.map((c) => ({
    ...c,
    tags: (c.tags || []).map((slug) => {
      const tag = tagsData[slug];
      return tag
        ? { id: slug, title: tag.title, url: tag.url }
        : { id: slug, title: slug, url: slug };
    }),
    links: (c.links || []).map((id) => linksById.get(id)).filter(Boolean),
  }));

  // id ссылок — высокоэнтропийные строки, которые почти не сжимаются и раздувают
  // клиентский документ выше порога зависания на custom-домене. Клиенту они не нужны
  // (как React key используем уникальный url), поэтому в payload их не отдаём.
  const omitLinkId = (link) => {
    const rest = { ...link };
    delete rest.id;
    return rest;
  };
  const linksForClient = linksNormalized.map(omitLinkId);
  const compilationsForClient = compilationsNormalized.map((c) => ({
    ...c,
    links: c.links.map(omitLinkId),
  }));

  return (
    <Container size='m'>
      {locale === 'en' && (
        <Alert
          description={t('langAlert')}
          className='mb-24'
          color='danger'
        />
      )}
      <h1 className='sr-only'>{t('pages:links.title')}</h1>
      <Search placeholder={t('search.placeholder')} />
      <TagList
        tags={tagsArray}
        type='links'
      />
      <List data={[...linksForClient, ...compilationsForClient]} />
    </Container>
  );
};

export async function generateMetadata() {
  const locale = await getLocale();
  const { t } = await initTranslations(locale);

  return getMetadata({
    locale,
    title: `${t('pages:links.title')} | ${t('metaTitle')}`,
    description: t('metaDescription'),
    pathname: '/links',
  });
}

export default LinksPage;

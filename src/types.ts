export type LangType = 'ru' | 'en';

export type AnyObjectType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type MetadataType = {
  locale: LangType;
  title: string;
  description: string;
  pathname: string;
  isRobotsIndexPage?: boolean;
};

export type MatrixBannerType = {
  title: string;
  description?: string;
  href: string;
  className?: string;
};

export type MatrixCompetenciesType = {
  id: string;
  title: string;
  rating: number;
};

export type MatrixCategoryType = {
  id: string;
  title: string;
  rating?: number | string;
  competencies: MatrixCompetenciesType[];
};

export type MatrixLevelType = {
  title: string;
  description: string;
};

export type MatrixType = {
  locale: LangType;
  levels: MatrixLevelType[];
  matrix: {
    type: string;
    category: MatrixCategoryType[];
  };
};

export type TagType = {
  id: string;
  title: string;
  url: string;
};

export type LinkType = {
  id: string;
  create: string;
  url?: string;
  title: string;
  description?: string;
  tags: TagType[];
  activeTag?: string | null;
  type?: 'link' | 'compilation';
  className?: string;
};

export type CompilationType = {
  id: string;
  create: string;
  title: string;
  description?: string;
  tags: TagType[];
  activeTag?: string | null;
  links?: LinkType[];
  type?: 'link' | 'compilation';
  className?: string;
};

export type ResourceLinksType = {
  id: string;
  title: string;
  url: string;
};

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  order: number;
  size: number;
  accent: boolean;
  first: boolean;
  tags: TagType[];
  resourceLinks: ResourceLinksType[];
};

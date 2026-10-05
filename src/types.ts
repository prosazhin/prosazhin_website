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
  slug: string;
  title: string;
  description: string;
  role?: string;
  order: number;
  size: number;
  accent: boolean;
  first: boolean;
  href: string;
  children?: ProjectType[];
  tags: TagType[];
  resourceLinks: ResourceLinksType[];
};

export type PlaygroundPackageType = 'tailwind-dictionary' | 'mixin-dictionary';

export type PlaygroundThemeType = 'light' | 'dark';

export type PlaygroundInputFileType = 'tokens' | 'light' | 'dark' | 'config';

export type PlaygroundInputType = {
  packageName: PlaygroundPackageType;
  tailwindVersion: 3 | 4;
  tokens: string;
  light: string;
  dark: string;
  config: string;
};

export type PlaygroundErrorType = {
  file: PlaygroundInputFileType | 'generator';
  message: string;
};

export type PlaygroundResultType =
  | { status: 'ok'; files: Record<string, string>; warnings: string[] }
  | { status: 'error'; errors: PlaygroundErrorType[] };

export type PreviewItemType = {
  kind: 'color' | 'font' | 'text' | 'radius' | 'shadow';
  name: string;
  value: string;
  lineHeight?: string;
  weight?: string;
};

export type PreviewModelType = {
  css: string;
  items: PreviewItemType[];
  defs: Record<string, string>;
  byTheme: Record<string, Record<string, string>>;
};

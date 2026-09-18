export type Profession = 'developer' | 'designer';

// Порядок вкладок-переключателя между резюме (индекс = defaultIndex у Tabs).
export const PROFESSIONS: Profession[] = ['developer', 'designer'];

// Проекты в резюме: эти же наборы использует печатная версия.
export const RESUME_PROJECT_SLUGS: Record<Profession, string[]> = {
  developer: ['pbcomponents', 'pbstyles', 'tailwind-dictionary', 'mixin-dictionary'],
  designer: ['pbcomponents', 'pbstyles', 'bank-money-time', 'shake-to-mind'],
};

// Блоки навыков (src/data/skills.js), которые показываем в резюме профессии.
const SKILL_TYPES: Record<Profession, string[]> = {
  developer: ['frontend', 'dev'],
  designer: ['design'],
};

// Типы позиций в карьере (src/data/career.js), релевантные профессии.
const CAREER_POSITION_TYPES: Record<Profession, string[]> = {
  developer: ['frontend', 'frontendSenior', 'frontendLead', 'html'],
  designer: ['design', 'productDesign', 'uxuiDesign'],
};

export const isProfession = (value: unknown): value is Profession =>
  typeof value === 'string' && (PROFESSIONS as string[]).includes(value);

export const isSkillForProfession = (profession: Profession, type: string): boolean =>
  SKILL_TYPES[profession].includes(type);

export const isPositionForProfession = (profession: Profession, type: string): boolean =>
  CAREER_POSITION_TYPES[profession].includes(type);

// Пункт списка достижений: строка или пункт с вложенными подпунктами.
export type CareerDetail = string | { text: string; items?: string[] };

export type CareerEntry = {
  type: string;
  title: string;
  subtitle?: string;
  positions?: Record<string, string>;
  details?: Record<string, CareerDetail[]>;
};

export type CareerExtra = {
  url?: string;
  dateFrom: string;
  dateTo: string;
  positions: { type: string; stack: string[] }[];
};

export type Job = {
  entry: CareerEntry;
  extra: CareerExtra;
  positions: { type: string; stack: string[] }[];
};

export type CareerBlock =
  | { id: string; jobs: Job[]; grouped: false }
  | { id: string; jobs: Job[]; grouped: true; dateFrom: string; dateTo: string };

/**
 * Собирает карьеру для резюме профессии: оставляет места с релевантной позицией,
 * внутри места — только позиции этой профессии, и раскладывает их по группам-этапам
 * из `careerGroups`. Группа с одним местом остаётся обычной карточкой (`grouped: false`).
 * Период группы считается по её участникам, а не задаётся в данных.
 * Используется и веб-резюме, и печатным шаблоном PDF.
 */
export const buildCareerBlocks = ({
  entries,
  careerByType,
  careerGroups,
  profession,
}: {
  entries: CareerEntry[];
  careerByType: Record<string, CareerExtra>;
  careerGroups: { id: string; members: string[] }[];
  profession: Profession;
}): CareerBlock[] => {
  const jobsByType = new Map<string, Job>();

  entries.forEach((entry) => {
    const extra = careerByType[entry.type];
    if (!extra) return;

    const positions = extra.positions.filter((position) =>
      isPositionForProfession(profession, position.type)
    );
    if (!positions.length) return;

    jobsByType.set(entry.type, { entry, extra, positions });
  });

  return careerGroups
    .map(({ id, members }): CareerBlock | null => {
      const jobs = members
        .map((member) => jobsByType.get(member))
        .filter((job): job is Job => job !== undefined);

      if (!jobs.length) return null;
      if (jobs.length === 1) return { id, jobs, grouped: false };

      const dateFrom = jobs.reduce(
        (acc, { extra }) => (extra.dateFrom < acc ? extra.dateFrom : acc),
        jobs[0].extra.dateFrom
      );
      const dateTo = jobs.some(({ extra }) => extra.dateTo === 'now')
        ? 'now'
        : jobs.reduce((acc, { extra }) => (extra.dateTo > acc ? extra.dateTo : acc), '');

      return { id, jobs, grouped: true, dateFrom, dateTo };
    })
    .filter((block): block is CareerBlock => block !== null);
};

export const getTools = (extra?: { tools?: string[] }): string[] => extra?.tools ?? [];

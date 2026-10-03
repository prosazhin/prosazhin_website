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
  // Связный текст для профессии вместо позиций — у блока «Проекты».
  summary?: Partial<Record<Profession, string>>;
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

// Место работы с позициями только этой профессии; null — если релевантных позиций нет.
const toJob = (
  entry: CareerEntry,
  extra: CareerExtra | undefined,
  profession: Profession
): Job | null => {
  if (!extra) return null;

  const positions = extra.positions.filter((position) =>
    isPositionForProfession(profession, position.type)
  );

  return positions.length ? { entry, extra, positions } : null;
};

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
    const job = toJob(entry, careerByType[entry.type], profession);
    if (job) jobsByType.set(entry.type, job);
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

// Запись карьеры, из которой собирается блок «Проекты»: текст и стек,
// под которыми идут карточки проектов. В careerGroups её нет.
const PROJECTS_BLOCK_TYPE = 'opensource';

export type ProjectsBlock = {
  summary: string;
  stack: string[];
};

/**
 * Шапка блока «Проекты» в резюме: связный текст профессии и общий стек её позиций.
 * Рендерится отдельно от карьеры — работа над проектами идёт параллельно.
 * Используется и веб-резюме, и печатным шаблоном PDF.
 */
export const buildProjectsBlock = ({
  entries,
  careerByType,
  profession,
}: {
  entries: CareerEntry[];
  careerByType: Record<string, CareerExtra>;
  profession: Profession;
}): ProjectsBlock | null => {
  const entry = entries.find(({ type }) => type === PROJECTS_BLOCK_TYPE);
  const job = entry ? toJob(entry, careerByType[PROJECTS_BLOCK_TYPE], profession) : null;
  if (!job) return null;

  return {
    summary: job.entry.summary?.[profession] ?? '',
    stack: [...new Set(job.positions.flatMap(({ stack }) => stack))],
  };
};

export const getTools = (extra?: { tools?: string[] }): string[] => extra?.tools ?? [];

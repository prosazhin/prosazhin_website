import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

export const hashFile = path.join(root, 'scripts', 'resume', 'sources.sha256');

// Всё, от чего зависит содержимое PDF. Хеш этих файлов пишется в scripts/resume,
// чтобы pre-commit мог поймать правку данных без перегенерации резюме.
const sources = [
  'scripts/generate-resumes.tsx',
  'src/components/cv/PrintableResume.jsx',
  'src/styles/cv-print.css',
  'src/data/career.js',
  'src/data/contacts.js',
  'src/data/projects.js',
  'src/data/skills.js',
  'src/utils/formatter.ts',
  'src/utils/resume.ts',
  'src/i18n/index.js',
  'src/i18n/locales/en/career.json',
  'src/i18n/locales/en/common.json',
  'src/i18n/locales/en/pages.json',
  'src/i18n/locales/en/projects.json',
  'src/i18n/locales/en/skills.json',
  'src/i18n/locales/ru/career.json',
  'src/i18n/locales/ru/common.json',
  'src/i18n/locales/ru/pages.json',
  'src/i18n/locales/ru/projects.json',
  'src/i18n/locales/ru/skills.json',
];

export const hashSources = async () => {
  const hash = createHash('sha256');
  for (const file of sources) {
    hash.update(file);
    hash.update(await fs.readFile(path.join(root, file)));
  }
  return hash.digest('hex');
};

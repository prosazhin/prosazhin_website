import fs from 'node:fs/promises';
import { hashFile, hashSources } from './resume-sources';

async function checkResumes() {
  const stored = await fs.readFile(hashFile, 'utf8').then(
    (value) => value.trim(),
    () => null
  );
  const actual = await hashSources();

  if (stored !== actual) {
    console.error(
      'Резюме устарело: исходники изменились после последней генерации PDF.\n' +
        'Запусти `npm run resume:generate` и добавь public/resume и scripts/resume в коммит.'
    );
    process.exitCode = 1;
  }
}

checkResumes();

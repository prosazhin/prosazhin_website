import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { PDFDocument } from 'pdf-lib';
import { chromium } from 'playwright';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PrintableResume from '../src/components/cv/PrintableResume.jsx';
import { initTranslations } from '../src/i18n/index.js';
import { PROFESSIONS } from '../src/utils/resume';
import { hashFile, hashSources } from './resume-sources';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'resume');

// Fontsource supplies the same Inter family used by the website. Inline faces keep
// the print page self-contained; the browser makes no external font requests.
const loadFontCss = async () =>
  Promise.all(
    [400, 600, 700].map(async (weight) => {
      const source = await fs.readFile(
        path.join(root, 'node_modules', '@fontsource', 'inter', `${weight}.css`),
        'utf8'
      );
      const fileNames = [...source.matchAll(/src: url\(\.\/files\/([^)]*\.woff2)\)/g)].map(
        ([, fileName]) => fileName
      );
      const fonts = new Map(
        await Promise.all(
          fileNames.map(
            async (fileName) =>
              [
                fileName,
                await fs.readFile(
                  path.join(root, 'node_modules', '@fontsource', 'inter', 'files', fileName),
                  'base64'
                ),
              ] as const
          )
        )
      );
      return source.replace(
        /src: url\(\.\/files\/([^)]*\.woff2)\) format\('woff2'\), url\(\.\/files\/[^)]*\.woff\) format\('woff'\);/g,
        (_match, fileName: string) =>
          `src: url(data:font/woff2;base64,${fonts.get(fileName)}) format('woff2');`
      );
    })
  ).then((styles) => styles.join('\n'));

async function generateResumes() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'prosazhin-resume-'));
  try {
    const fontCss = await loadFontCss();
    if (fontCss.includes('./files/')) {
      throw new Error('Fontsource CSS still has unresolved font URLs');
    }
    execFileSync(
      path.join(root, 'node_modules', '.bin', 'tailwindcss'),
      ['-i', path.join(root, 'src', 'styles', 'cv-print.css'), '-o', path.join(tempDir, 'cv.css')],
      { cwd: root, stdio: 'inherit' }
    );

    const css = await fs.readFile(path.join(tempDir, 'cv.css'), 'utf8');
    await fs.mkdir(outputDir, { recursive: true });

    let browser;
    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      if (!String(error).includes("Executable doesn't exist")) throw error;
      execFileSync(
        path.join(root, 'node_modules', '.bin', 'playwright'),
        ['install', 'chromium', '--only-shell'],
        { cwd: root, stdio: 'inherit' }
      );
      browser = await chromium.launch({ headless: true });
    }
    try {
      const page = await browser.newPage();
      for (const locale of ['ru', 'en']) {
        const { t } = await initTranslations(locale);
        for (const profession of PROFESSIONS) {
          const title = `${t('name')} — ${t(`jobTitle.${profession}`)}`;
          const head = renderToStaticMarkup(createElement('title', null, title));
          const body = renderToStaticMarkup(
            createElement(PrintableResume, { locale, profession, t })
          );
          const html = `<!doctype html><html lang="${locale}" data-theme="light"><head><meta charset="utf-8">${head}<style>${fontCss}\n${css}</style></head><body>${body}</body></html>`;

          await page.setContent(html, { waitUntil: 'load' });
          await page.evaluate(() => document.fonts.ready);
          const outputPath = path.join(outputDir, `cv-${locale}-${profession}.pdf`);
          const pdf = await page.pdf({
            format: 'A4',
            preferCSSPageSize: true,
            printBackground: true,
            tagged: true,
            outline: true,
          });
          if (!pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
            throw new Error(`Invalid PDF: ${outputPath}`);
          }
          const pdfDocument = await PDFDocument.load(pdf);
          pdfDocument.setTitle(title);
          pdfDocument.setAuthor(t('name'));
          pdfDocument.setSubject(t(`jobTitle.${profession}`));
          pdfDocument.setCreator('prosazhin.dev');
          const output = await pdfDocument.save();
          await fs.writeFile(outputPath, output);
          process.stdout.write(
            `Generated ${path.relative(root, outputPath)} (${output.length} bytes)\n`
          );
        }
      }
      await page.close();
    } finally {
      await browser.close();
    }
    await fs.writeFile(hashFile, `${await hashSources()}\n`);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

generateResumes().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

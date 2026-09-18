'use client';

import { LangType } from '@/types';
import clsx from 'clsx';
import { useState } from 'react';

type RadarDatum = { title: string; value: number };

// Круговой (радарный) график: сплошная закрашенная область показывает силу по
// каждой категории. Направляющие — только спицы от центра к точкам. При наведении
// на точку показывается тултип с названием и оценкой. Чистый SVG без зависимостей,
// темизация через CSS-переменные дизайн-токенов.
const RadarChart = ({
  data,
  max = 4,
  locale,
  title,
}: {
  data: RadarDatum[];
  max?: number;
  locale?: LangType;
  title?: string;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const n = data.length;
  if (!n) return null;

  // Поле вокруг круга: сверху под подпись верхнего уровня, снизу — только под точку на пике.
  // Hover-зона (r=16) может выходить за viewBox — svg рисуется с overflow-visible.
  const radius = 200;
  const paddingX = 24;
  const paddingTop = 24;
  const paddingBottom = 8;
  const width = radius * 2 + paddingX * 2;
  const height = radius * 2 + paddingTop + paddingBottom;
  const cx = width / 2;
  const cy = paddingTop + radius;

  const angleFor = (i: number) => (-90 + (360 / n) * i) * (Math.PI / 180);
  // Округляем до сотых: Math.cos/sin в Node и в браузере могут расходиться в последнем
  // знаке, и без округления SSR-разметка не совпадает с клиентской (hydration mismatch).
  const round = (value: number) => Math.round(value * 100) / 100;
  const pointAt = (i: number, r: number) => ({
    x: round(cx + r * Math.cos(angleFor(i))),
    y: round(cy + r * Math.sin(angleFor(i))),
  });

  const vertices = data.map((d, i) =>
    pointAt(i, (radius * Math.min(Math.max(d.value, 0), max)) / max)
  );
  const polygon = vertices.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Шкала уровней (1..max): круговая сетка + подписи цифр вдоль верхней вертикальной оси.
  const levels = Array.from({ length: max }, (_, i) => i + 1);

  const formatRating = (value: number) =>
    new Intl.NumberFormat(locale ?? 'ru', { maximumFractionDigits: 1 }).format(value);

  return (
    <div className='relative mx-auto mt-32 w-full max-w-[448px]'>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className='block h-auto w-full overflow-visible'
        role='img'
        aria-label={title ?? 'Радар компетенций'}
      >
        {title && <title>{title}</title>}

        {/* Круговая сетка уровней */}
        {levels.map((level) => (
          <circle
            key={`ring-${level}`}
            cx={cx}
            cy={cy}
            r={(radius * level) / max}
            fill='none'
            style={{ stroke: 'var(--color-secondary-200)' }}
            strokeWidth={1}
          />
        ))}

        {/* Спицы от центра к точкам */}
        {data.map((_, i) => {
          const outer = pointAt(i, radius);
          return (
            <line
              key={`spoke-${i}`}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              style={{ stroke: 'var(--color-secondary-200)' }}
              strokeWidth={1}
            />
          );
        })}

        {/* Подписи шкалы уровня вдоль верхней вертикальной оси — под заливкой данных,
            фигура перекрывает их там, где значение по этой оси её достигает. */}
        {levels.map((level) => (
          <text
            key={`scale-${level}`}
            x={cx}
            y={cy - (radius * level) / max}
            dy={-6}
            textAnchor='middle'
            className='text-t16'
            fillOpacity={0.5}
            style={{ fill: 'var(--color-secondary-300)' }}
          >
            {level}
          </text>
        ))}

        {/* Полупрозрачная закрашенная область данных — сетка остаётся видна сквозь неё */}
        <polygon
          points={polygon}
          style={{ fill: 'var(--color-primary-300)' }}
          fillOpacity={0.6}
        />

        {/* Точки на пиках + прозрачная зона наведения */}
        {vertices.map((p, i) => (
          <g key={`dot-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 6 : 4}
              style={{ fill: 'var(--color-primary-400)', stroke: 'var(--color-basic-0)' }}
              strokeWidth={2}
              className='transition-all duration-150'
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={16}
              fill='transparent'
              tabIndex={0}
              className='cursor-pointer outline-none'
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            />
          </g>
        ))}
      </svg>

      {/* Тултип */}
      {hovered !== null && (
        <div
          className={clsx(
            'text-t12 pointer-events-none absolute z-10 flex items-center gap-x-8',
            'rounded-8 px-12 py-8 whitespace-nowrap shadow-lg'
          )}
          style={{
            left: `${(vertices[hovered].x / width) * 100}%`,
            top: `${(vertices[hovered].y / height) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 12px))',
            background: 'var(--color-secondary-400)',
            color: 'var(--color-basic-0)',
          }}
        >
          <span>{data[hovered].title}</span>
          <span style={{ color: 'var(--color-secondary-200)' }}>
            {formatRating(data[hovered].value)}
          </span>
        </div>
      )}
    </div>
  );
};

export default RadarChart;

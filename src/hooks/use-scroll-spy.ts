'use client';

import { useEffect, useState } from 'react';

// Скролл-спай: возвращает id секции, которая сейчас в верхней части вьюпорта.
// Секции ищутся по id из переданного списка (в порядке появления на странице).
export default function useScrollSpy(ids: string[], offset = 112) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);
  const key = ids.join('|');

  useEffect(() => {
    if (!ids.length) return;

    const getElements = () =>
      ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);

    const handler = () => {
      const elements = getElements();
      if (!elements.length) return;

      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = el.id;
        }
      }

      // У самого низа страницы активируем последнюю секцию, даже если она короткая.
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (scrolledToBottom) {
        current = elements[elements.length - 1].id;
      }

      setActiveId(current);
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, offset]);

  return activeId;
}

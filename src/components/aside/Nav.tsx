'use client';

import useScrollSpy from '@/hooks/use-scroll-spy';
import clsx from 'clsx';
import Link from 'next/link';

type NavItem = { type: string; title: string; children?: NavItem[] };

const AsideNav = ({ items }: { items: NavItem[] }) => {
  const ids = items.flatMap(({ type, children }) => [
    type,
    ...(children?.map((child) => child.type) ?? []),
  ]);
  const activeId = useScrollSpy(ids);

  return (
    <ul className='border-secondary-200 hidden w-full flex-col gap-y-8 border-t pt-28 xl:flex print:hidden'>
      {items.map(({ title, type, children }) => {
        const isChildActive = children?.some((child) => child.type === activeId) ?? false;

        return (
          <li key={type}>
            <Link
              href={`#${type}`}
              scroll={true}
              className={clsx(
                'text-tm16 text-basic-300 hover:text-primary-400 transition-colors duration-150',
                (type === activeId || isChildActive) && 'text-basic-400!'
              )}
            >
              {title}
            </Link>
            {children && children.length > 0 && (
              <ul className='mt-8 flex flex-col gap-y-4 pl-16'>
                {children.map((child) => (
                  <li key={child.type}>
                    <Link
                      href={`#${child.type}`}
                      scroll={true}
                      className={clsx(
                        'text-tm14 text-basic-300 hover:text-primary-400 transition-colors duration-150',
                        child.type === activeId && 'text-basic-400!'
                      )}
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default AsideNav;

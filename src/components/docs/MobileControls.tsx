'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';

export default function MobileControls({ label }: { label: string }) {
  const { slots } = useDocsLayout();
  const SidebarTrigger = slots.sidebar.trigger;
  const SearchTrigger = slots.searchTrigger && slots.searchTrigger.sm;

  return (
    <div className='docs-mobile-controls not-prose border-fd-border mb-4 flex items-center gap-2 border-b pb-3 md:hidden'>
      <SidebarTrigger className='text-fd-foreground hover:bg-fd-accent inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm'>
        <Bars3Icon className='size-5' />
        {label}
      </SidebarTrigger>
      {SearchTrigger && (
        <SearchTrigger
          hideIfDisabled
          className='ms-auto'
        />
      )}
    </div>
  );
}

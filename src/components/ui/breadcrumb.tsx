import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      <Link 
        href="/" 
        className="flex items-center hover:text-foreground transition-colors duration-200"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          {item.current || !item.href ? (
            <span 
              className={cn(
                "font-medium",
                item.current ? "text-foreground" : "text-muted-foreground"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Pre-defined breadcrumb configurations for common pages
export const commonBreadcrumbs = {
  live: [
    { label: 'Live Streams', href: '/live', current: true }
  ],
  liveSession: (sessionTitle: string) => [
    { label: 'Live Streams', href: '/live' },
    { label: sessionTitle, current: true }
  ],
  chat: [
    { label: 'Chat', href: '/chat', current: true }
  ],
  groups: [
    { label: 'Groups', href: '/groups', current: true }
  ],
  groupDetail: (groupName: string) => [
    { label: 'Groups', href: '/groups' },
    { label: groupName, current: true }
  ],
  events: [
    { label: 'Events', href: '/events', current: true }
  ],
  eventDetail: (eventTitle: string) => [
    { label: 'Events', href: '/events' },
    { label: eventTitle, current: true }
  ],
  admin: [
    { label: 'Admin', href: '/admin', current: true }
  ],
  adminUsers: [
    { label: 'Admin', href: '/admin' },
    { label: 'Users', current: true }
  ],
  adminContent: [
    { label: 'Admin', href: '/admin' },
    { label: 'Content', current: true }
  ],
  notifications: [
    { label: 'Notifications', href: '/notifications', current: true }
  ]
};
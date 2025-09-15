'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { useAppStore } from '@/lib/store';
import { 
  Home, 
  Video, 
  MessageCircle, 
  Users, 
  Calendar, 
  Shield,
  Bell,
  Search,
  Settings,
  Menu,
  X,
  Hash,
  Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export function MainNavigation() {
  const pathname = usePathname();
  const { currentUser } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/live', label: 'Live', icon: Video, badge: 3 },
    { href: '/chat', label: 'Chat', icon: MessageCircle, badge: 5 },
    { href: '/groups', label: 'Groups', icon: Users },
    { href: '/events', label: 'Events', icon: Calendar, badge: 2 },
  ];

  // Add admin link for admin users
  if (currentUser?.role === 'ADMIN' || currentUser?.role === 'OWNER' || currentUser?.role === 'MODERATOR') {
    navigationItems.push({ href: '/admin', label: 'Admin', icon: Shield, badge: 7 });
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">T</span>
          </div>
          <span className="font-bold text-xl">TFN</span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Button variant="ghost" size="icon">
            <Search className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="w-4 h-4" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <NotificationCenter 
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                />
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser?.avatarUrl} />
              <AvatarFallback>
                {currentUser?.displayName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{currentUser?.displayName || 'Guest'}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">T</span>
            </div>
            <span className="font-bold text-xl">TFN</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="w-4 h-4" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs h-4 w-4 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-b bg-background">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
            
            <div className="border-t px-4 py-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback>
                    {currentUser?.displayName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentUser?.displayName || 'Guest'}</p>
                  <p className="text-sm text-muted-foreground">{currentUser?.email || 'guest@tfn.com'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
          <div className="flex items-center">
            {navigationItems.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full h-16 flex flex-col space-y-1 rounded-none',
                    isActive(item.href) && 'text-primary bg-primary/10'
                  )}
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5" />
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs h-4 w-4 rounded-full p-0 flex items-center justify-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Notifications Overlay */}
        {isNotificationsOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
            <div className="absolute top-16 right-4 left-4">
              <NotificationCenter 
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
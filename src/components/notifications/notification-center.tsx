'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/lib/store';
import { 
  Bell, 
  BellOff, 
  Check, 
  X, 
  MoreVertical,
  Settings,
  MessageCircle,
  Users,
  Calendar,
  Video,
  Heart,
  UserPlus,
  Shield,
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'MESSAGE' | 'MENTION' | 'REACTION' | 'FOLLOW' | 'EVENT' | 'STREAM' | 'ADMIN' | 'GROUP' | 'FRIEND_REQUEST';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actor?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  metadata?: {
    groupName?: string;
    eventTitle?: string;
    streamTitle?: string;
    messagePreview?: string;
  };
}

interface NotificationSettings {
  messages: boolean;
  mentions: boolean;
  reactions: boolean;
  follows: boolean;
  events: boolean;
  streams: boolean;
  admin: boolean;
  groups: boolean;
  friendRequests: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
}

interface NotificationCenterProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function NotificationCenter({ isOpen = false, onClose, className }: NotificationCenterProps) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'mentions' | 'events'>('all');
  const [showSettings, setShowSettings] = useState(false);

  // Mock notifications data
  const [mockNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'MENTION',
      title: 'Mentioned in #general',
      message: 'John Smith mentioned you in general chat',
      isRead: false,
      createdAt: new Date(Date.now() - 300000), // 5 minutes ago
      actor: {
        id: 'user1',
        displayName: 'John Smith',
        avatarUrl: undefined,
      },
      metadata: {
        messagePreview: 'Hey @currentUser, what do you think about this?',
      },
    },
    {
      id: '2',
      type: 'REACTION',
      title: 'New reaction',
      message: 'Sarah reacted to your message with ❤️',
      isRead: false,
      createdAt: new Date(Date.now() - 600000), // 10 minutes ago
      actor: {
        id: 'user2',
        displayName: 'Sarah Johnson',
        avatarUrl: undefined,
      },
    },
    {
      id: '3',
      type: 'EVENT',
      title: 'Event reminder',
      message: 'Sunday Morning Worship starts in 1 hour',
      isRead: false,
      createdAt: new Date(Date.now() - 900000), // 15 minutes ago
      metadata: {
        eventTitle: 'Sunday Morning Worship',
      },
    },
    {
      id: '4',
      type: 'STREAM',
      title: 'Live stream started',
      message: 'Michael Chen is now live: Daily Fellowship Discussion',
      isRead: true,
      createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      actor: {
        id: 'user3',
        displayName: 'Michael Chen',
        avatarUrl: undefined,
      },
      metadata: {
        streamTitle: 'Daily Fellowship Discussion',
      },
    },
    {
      id: '5',
      type: 'FRIEND_REQUEST',
      title: 'Friend request',
      message: 'Emily Davis sent you a friend request',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      actor: {
        id: 'user4',
        displayName: 'Emily Davis',
        avatarUrl: undefined,
      },
    },
    {
      id: '6',
      type: 'GROUP',
      title: 'Added to group',
      message: 'You were added to Youth Ministry',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      metadata: {
        groupName: 'Youth Ministry',
      },
    },
  ]);

  const filteredNotifications = mockNotifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'mentions':
        return notification.type === 'MENTION';
      case 'events':
        return notification.type === 'EVENT';
      default:
        return true;
    }
  });

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE': return <MessageCircle className="w-4 h-4" />;
      case 'MENTION': return <span className="text-sm">@</span>;
      case 'REACTION': return <Heart className="w-4 h-4" />;
      case 'FOLLOW': return <UserPlus className="w-4 h-4" />;
      case 'EVENT': return <Calendar className="w-4 h-4" />;
      case 'STREAM': return <Video className="w-4 h-4" />;
      case 'ADMIN': return <Shield className="w-4 h-4" />;
      case 'GROUP': return <Users className="w-4 h-4" />;
      case 'FRIEND_REQUEST': return <UserPlus className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'MENTION': return 'bg-blue-500';
      case 'REACTION': return 'bg-red-500';
      case 'EVENT': return 'bg-green-500';
      case 'STREAM': return 'bg-purple-500';
      case 'ADMIN': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    // Navigate to action URL if provided
    if (notification.actionUrl) {
      // In a real app, this would use Next.js router
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (showSettings) {
    return <NotificationSettings onBack={() => setShowSettings(false)} />;
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Filter Tabs */}
        <div className="flex border-b px-4">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'mentions', label: 'Mentions' },
            { key: 'events', label: 'Events' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={cn(
                'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
                filter === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {tab.count && tab.count > 0 && (
                <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="px-4 py-2 border-b">
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-1">No notifications</p>
              <p className="text-sm">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'w-full p-4 text-left hover:bg-muted transition-colors border-b last:border-b-0',
                    !notification.isRead && 'bg-blue-50 dark:bg-blue-950/20'
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      {notification.actor ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={notification.actor.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {notification.actor.displayName[0]}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-white',
                          getNotificationColor(notification.type)
                        )}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                      {!notification.isRead && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      
                      {notification.metadata?.messagePreview && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground italic">
                          {notification.metadata.messagePreview}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface NotificationSettingsProps {
  onBack: () => void;
}

function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    messages: true,
    mentions: true,
    reactions: true,
    follows: true,
    events: true,
    streams: true,
    admin: true,
    groups: true,
    friendRequests: true,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
  });

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsGroups = [
    {
      title: 'Activity',
      items: [
        { key: 'messages' as const, label: 'Direct Messages', description: 'New messages in DMs' },
        { key: 'mentions' as const, label: 'Mentions', description: 'When someone mentions you' },
        { key: 'reactions' as const, label: 'Reactions', description: 'When someone reacts to your messages' },
        { key: 'follows' as const, label: 'Follows', description: 'New followers or friend requests' },
      ],
    },
    {
      title: 'Content',
      items: [
        { key: 'events' as const, label: 'Events', description: 'Event reminders and updates' },
        { key: 'streams' as const, label: 'Live Streams', description: 'When streams you follow go live' },
        { key: 'groups' as const, label: 'Groups', description: 'Group invitations and updates' },
      ],
    },
    {
      title: 'System',
      items: [
        { key: 'admin' as const, label: 'Admin Alerts', description: 'System announcements and alerts' },
        { key: 'friendRequests' as const, label: 'Friend Requests', description: 'New friend request notifications' },
      ],
    },
    {
      title: 'Delivery',
      items: [
        { key: 'emailNotifications' as const, label: 'Email Notifications', description: 'Receive notifications via email' },
        { key: 'pushNotifications' as const, label: 'Push Notifications', description: 'Browser push notifications' },
        { key: 'soundEnabled' as const, label: 'Sound', description: 'Play notification sounds' },
      ],
    },
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <X className="w-4 h-4" />
          </Button>
          <CardTitle>Notification Settings</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 max-h-96 overflow-y-auto">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-medium mb-3">{group.title}</h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.key === 'soundEnabled' && (
                        settings[item.key] ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="ml-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                        className="sr-only"
                      />
                      <div className={cn(
                        'w-9 h-5 rounded-full transition-colors',
                        settings[item.key] ? 'bg-primary' : 'bg-muted'
                      )}>
                        <div className={cn(
                          'w-4 h-4 rounded-full bg-white transition-transform mt-0.5',
                          settings[item.key] ? 'translate-x-4 ml-0.5' : 'translate-x-0 ml-0.5'
                        )} />
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button className="w-full">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const { notifications, addNotification, markNotificationAsRead } = useAppStore();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      });
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // Ignore errors (e.g., user hasn't interacted with page yet)
    });
  };

  return {
    notifications,
    permission,
    requestPermission,
    showNotification,
    playNotificationSound,
    addNotification,
    markNotificationAsRead,
  };
}
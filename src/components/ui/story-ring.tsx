import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface StoryRingProps {
  isLive?: boolean;
  hasUpdate?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StoryRing({
  isLive = false,
  hasUpdate = false,
  onClick,
  children,
  size = 'md',
  className,
}: StoryRingProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const ringClasses = cn(
    'story-ring cursor-pointer transition-transform hover:scale-105',
    {
      'animate story-ring': isLive,
      'bg-gradient-to-r from-purple-400 to-pink-400': hasUpdate && !isLive,
      'bg-border': !hasUpdate && !isLive,
    },
    sizeClasses[size],
    className
  );

  return (
    <div className={ringClasses} onClick={onClick}>
      <div className="story-ring-inner w-full h-full">
        {children}
      </div>
    </div>
  );
}

interface UserStoryProps {
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    handle: string;
  };
  isLive?: boolean;
  hasUpdate?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function UserStory({
  user,
  isLive = false,
  hasUpdate = false,
  onClick,
  size = 'md',
}: UserStoryProps) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <StoryRing
        isLive={isLive}
        hasUpdate={hasUpdate}
        onClick={onClick}
        size={size}
      >
        <Avatar className="w-full h-full">
          <AvatarImage src={user.avatarUrl} alt={user.displayName} />
          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
      </StoryRing>
      <span className="text-xs text-center max-w-[4rem] truncate">
        {user.displayName}
      </span>
      {isLive && (
        <span className="text-xs bg-red-500 text-white px-1 rounded">
          LIVE
        </span>
      )}
    </div>
  );
}

interface HighlightsRailProps {
  stories: Array<{
    user: {
      id: string;
      displayName: string;
      avatarUrl?: string;
      handle: string;
    };
    isLive?: boolean;
    hasUpdate?: boolean;
    onClick?: () => void;
  }>;
  className?: string;
}

export function HighlightsRail({ stories, className }: HighlightsRailProps) {
  return (
    <div className={cn('flex space-x-4 overflow-x-auto pb-2', className)}>
      {stories.map((story) => (
        <UserStory
          key={story.user.id}
          user={story.user}
          isLive={story.isLive}
          hasUpdate={story.hasUpdate}
          onClick={story.onClick}
        />
      ))}
    </div>
  );
}
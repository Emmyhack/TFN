'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import type { ChatMessage } from '@/lib/store';
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  Search,
  Users,
  Hash,
  Lock,
  Globe,
  Mic,
  MicOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Channel {
  id: string;
  name: string;
  type: 'TEXT' | 'VOICE' | 'DM';
  isPrivate: boolean;
  groupId?: string;
  participants?: string[];
  unreadCount?: number;
  lastMessage?: {
    content: string;
    createdAt: Date;
    user: string;
  };
}

interface ChatPanelProps {
  selectedChannelId?: string;
  onChannelSelect?: (channelId: string) => void;
  className?: string;
}

export function ChatPanel({ selectedChannelId, onChannelSelect, className }: ChatPanelProps) {
  const { currentUser, addMessage } = useAppStore();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock channels data
  const [channels] = useState<Channel[]>([
    {
      id: 'general',
      name: 'general',
      type: 'TEXT',
      isPrivate: false,
      unreadCount: 3,
      lastMessage: {
        content: 'Welcome to TFN!',
        createdAt: new Date(),
        user: 'John Smith'
      }
    },
    {
      id: 'prayer-requests',
      name: 'prayer-requests',
      type: 'TEXT',
      isPrivate: false,
      unreadCount: 1,
      lastMessage: {
        content: 'Please pray for my family',
        createdAt: new Date(),
        user: 'Sarah Johnson'
      }
    },
    {
      id: 'bible-study',
      name: 'bible-study',
      type: 'TEXT',
      isPrivate: false,
      lastMessage: {
        content: 'Great discussion today!',
        createdAt: new Date(),
        user: 'Michael Chen'
      }
    },
    {
      id: 'voice-chat',
      name: 'Voice Chat',
      type: 'VOICE',
      isPrivate: false,
    },
  ]);

  // Mock messages data
  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Welcome to The Fellowship Network! We\'re excited to have you here.',
      userId: 'user1',
      channelId: 'general',
      createdAt: new Date(Date.now() - 3600000),
      user: {
        id: 'user1',
        displayName: 'John Smith',
        handle: '@johnsmith',
        email: 'john@example.com',
        role: 'USER' as const,
        avatarUrl: undefined,
        isOnline: true,
      }
    },
    {
      id: '2',
      content: 'Thank you! Looking forward to connecting with everyone.',
      userId: 'user2',
      channelId: 'general',
      createdAt: new Date(Date.now() - 3000000),
      user: {
        id: 'user2',
        displayName: 'Sarah Johnson',
        handle: '@sarahj',
        email: 'sarah@example.com',
        role: 'USER' as const,
        avatarUrl: undefined,
        isOnline: true,
      }
    },
    {
      id: '3',
      content: 'Please keep my grandmother in your prayers. She\'s been in the hospital.',
      userId: 'user3',
      channelId: 'prayer-requests',
      createdAt: new Date(Date.now() - 1800000),
      user: {
        id: 'user3',
        displayName: 'Michael Chen',
        handle: '@michaelc',
        email: 'michael@example.com',
        role: 'USER' as const,
        avatarUrl: undefined,
        isOnline: false,
      }
    },
  ]);

  const currentChannel = channels.find(c => c.id === selectedChannelId) || channels[0];
  const channelMessages = messages.filter(m => m.channelId === currentChannel.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      userId: currentUser.id,
      channelId: currentChannel.id,
      createdAt: new Date(),
      user: currentUser,
    };

    addMessage(newMessage);
    setMessage('');
    setIsTyping(false);
  }, [message, currentUser, currentChannel.id, addMessage]);

  const handleTyping = useCallback((value: string) => {
    setMessage(value);
    
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      // In a real app, emit typing event to server
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
      // In a real app, emit stop typing event to server
    }
  }, [isTyping]);

  const handleReaction = (messageId: string, emoji: string) => {
    // In a real implementation, this would send the reaction to the server
    console.log('React to message:', messageId, 'with:', emoji);
  };

  return (
    <div className={cn('flex h-full', className)}>
      {/* Channels Sidebar */}
      <div className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              className="pl-10 h-8"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Channels
            </div>
            {channels.filter(c => c.type === 'TEXT').map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect?.(channel.id)}
                className={cn(
                  'w-full flex items-center space-x-2 px-2 py-1.5 rounded text-left hover:bg-muted',
                  selectedChannelId === channel.id && 'bg-muted'
                )}
              >
                {channel.isPrivate ? (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Hash className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="flex-1 text-sm">{channel.name}</span>
                {channel.unreadCount && (
                  <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {channel.unreadCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Voice Channels
            </div>
            {channels.filter(c => c.type === 'VOICE').map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect?.(channel.id)}
                className={cn(
                  'w-full flex items-center space-x-2 px-2 py-1.5 rounded text-left hover:bg-muted',
                  selectedChannelId === channel.id && 'bg-muted'
                )}
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  🔊
                </span>
                <span className="flex-1 text-sm">{channel.name}</span>
                <Users className="w-3 h-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* User info */}
        <div className="p-2 border-t">
          <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser?.avatarUrl} />
              <AvatarFallback className="text-xs">
                {currentUser?.displayName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser?.displayName}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            {currentChannel.type === 'TEXT' ? (
              <Hash className="w-5 h-5 text-muted-foreground" />
            ) : currentChannel.type === 'VOICE' ? (
              <span className="text-lg">🔊</span>
            ) : (
              <Globe className="w-5 h-5 text-muted-foreground" />
            )}
            <h2 className="font-semibold">{currentChannel.name}</h2>
            {currentChannel.isPrivate && (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          <div className="flex items-center space-x-2">
            {currentChannel.type === 'VOICE' && (
              <>
                <Button variant="ghost" size="icon">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {channelMessages.map((message, index) => {
            const showAvatar = index === 0 || 
              channelMessages[index - 1].userId !== message.userId ||
              message.createdAt.getTime() - channelMessages[index - 1].createdAt.getTime() > 300000; // 5 minutes

            return (
              <div key={message.id} className={cn('flex space-x-3', !showAvatar && 'ml-11')}>
                {showAvatar ? (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.user.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {message.user.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-8" />
                )}
                
                <div className="flex-1 min-w-0">
                  {showAvatar && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{message.user.displayName}</span>
                      <span className="text-xs text-muted-foreground">
                        {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.editedAt && (
                        <span className="text-xs text-muted-foreground">(edited)</span>
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm break-words">{message.content}</div>
                  
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex items-center space-x-1 mt-1">
                      {message.reactions.map((reaction, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleReaction(message.id, reaction.emoji)}
                          className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-xs"
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.users.length}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {typingUsers.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150" />
              </div>
              <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {currentChannel.type === 'TEXT' && (
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder={`Message #${currentChannel.name}`}
                  className="pr-20"
                  maxLength={2000}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 hover:bg-secondary/80">
                    <Paperclip className="w-3 h-3" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 hover:bg-secondary/80">
                    <Smile className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <Button type="submit" size="icon" disabled={!message.trim()} variant={message.trim() ? "gradient" : "ghost"} className="transition-all duration-300">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Voice Channel Controls */}
        {currentChannel.type === 'VOICE' && (
          <div className="p-4 border-t">
            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" size="icon">
                <MicOff className="w-4 h-4" />
              </Button>
              <Button variant="destructive">
                Disconnect
              </Button>
              <Button variant="outline" size="icon">
                <Video className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
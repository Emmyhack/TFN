'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Settings,
  Users,
  MessageCircle,
  Heart,
  Share2,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

interface LiveStreamPlayerProps {
  session: {
    id: string;
    title: string;
    host: {
      id: string;
      displayName: string;
      avatarUrl?: string;
    };
    viewerCount: number;
    state: 'LIVE' | 'ENDED' | 'SCHEDULED';
    mode: 'AUDIO' | 'VIDEO';
  };
  className?: string;
}

export function LiveStreamPlayer({ session, className }: LiveStreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { localStream, remoteStreams, isStreaming } = useAppStore();

  useEffect(() => {
    if (videoRef.current && session.mode === 'VIDEO') {
      // In a real implementation, this would connect to the actual stream
      // For now, we'll show a placeholder
      if (localStream && isStreaming) {
        videoRef.current.srcObject = localStream;
      }
    }
  }, [localStream, isStreaming, session.mode]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={session.host.avatarUrl} />
              <AvatarFallback>{session.host.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{session.title}</h3>
              <p className="text-sm text-muted-foreground">
                by {session.host.displayName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={session.state === 'LIVE' ? 'destructive' : 'secondary'}
              className={session.state === 'LIVE' ? 'animate-pulse' : ''}
            >
              {session.state}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{session.viewerCount}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {session.mode === 'VIDEO' ? (
          <div className="relative bg-black aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            {session.state !== 'LIVE' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    {session.state === 'ENDED' ? 'Stream Ended' : 'Stream Starting Soon'}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="relative">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/20">
                    <AvatarImage src={session.host.avatarUrl} />
                    <AvatarFallback className="text-2xl bg-white/10">
                      {session.host.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {session.state === 'LIVE' && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75" />
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150" />
                      </div>
                    </div>
                  )}
                </div>
                <Mic className="w-8 h-8 mx-auto mb-2" />
                <p className="text-lg font-medium">Audio Only Stream</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StreamControlsProps {
  isHost?: boolean;
  isStreaming?: boolean;
  isMuted?: boolean;
  isVideoEnabled?: boolean;
  onToggleStream?: () => void;
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
  onEndStream?: () => void;
  onLeave?: () => void;
}

export function StreamControls({
  isHost = false,
  isStreaming = false,
  isMuted = false,
  isVideoEnabled = true,
  onToggleStream,
  onToggleMute,
  onToggleVideo,
  onEndStream,
  onLeave,
}: StreamControlsProps) {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-background border-t">
      <Button
        variant={isMuted ? 'destructive' : 'outline'}
        size="icon"
        onClick={onToggleMute}
        className="rounded-full"
      >
        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>

      <Button
        variant={!isVideoEnabled ? 'destructive' : 'outline'}
        size="icon"
        onClick={onToggleVideo}
        className="rounded-full"
      >
        {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
      </Button>

      {isHost && (
        <Button
          variant={isStreaming ? 'destructive' : 'default'}
          onClick={isStreaming ? onEndStream : onToggleStream}
          className="px-6"
        >
          {isStreaming ? (
            <>
              <PhoneOff className="w-4 h-4 mr-2" />
              End Stream
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 mr-2" />
              Start Stream
            </>
          )}
        </Button>
      )}

      {!isHost && (
        <Button variant="outline" onClick={onLeave} className="px-6">
          <PhoneOff className="w-4 h-4 mr-2" />
          Leave
        </Button>
      )}

      <Button variant="outline" size="icon" className="rounded-full">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}

interface LiveChatProps {
  sessionId: string;
  className?: string;
}

export function LiveChat({ sessionId, className }: LiveChatProps) {
  const [message, setMessage] = useState('');
  const [reaction, setReaction] = useState<string | null>(null);
  const { sessionComments, addComment, currentUser } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessionComments]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    const comment = {
      id: Date.now().toString(),
      sessionId,
      userId: currentUser.id,
      body: message,
      createdAt: new Date(),
      user: currentUser,
    };

    addComment(comment);
    setMessage('');
  };

  const handleReaction = (emoji: string) => {
    if (!currentUser) return;

    const comment = {
      id: Date.now().toString(),
      sessionId,
      userId: currentUser.id,
      reaction: emoji,
      createdAt: new Date(),
      user: currentUser,
    };

    addComment(comment);
    setReaction(emoji);
    setTimeout(() => setReaction(null), 1000);
  };

  const reactions = ['❤️', '🙌', '🔥', '👏', '😊', '🙏'];

  return (
    <Card className={cn('flex flex-col h-96', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Live Chat</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 space-y-3">
            {sessionComments.map((comment) => (
              <div key={comment.id} className="flex space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={comment.user.avatarUrl} />
                  <AvatarFallback className="text-xs">
                    {comment.user.displayName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-primary">
                      {comment.user.displayName}
                    </span>
                    {comment.user.isVerified && (
                      <Badge variant="secondary" className="text-xs px-1">
                        ✓
                      </Badge>
                    )}
                  </div>
                  {comment.body && (
                    <p className="text-sm text-foreground break-words">
                      {comment.body}
                    </p>
                  )}
                  {comment.reaction && (
                    <span className="text-lg">{comment.reaction}</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Reactions */}
          <div className="px-4 py-2 border-t">
            <div className="flex items-center justify-between mb-3">
              {reactions.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(emoji)}
                  className={cn(
                    'text-lg hover:scale-110 transition-transform',
                    reaction === emoji && 'scale-125'
                  )}
                >
                  {emoji}
                </Button>
              ))}
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={500}
              />
              <Button type="submit" size="sm" disabled={!message.trim()}>
                <MessageCircle className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
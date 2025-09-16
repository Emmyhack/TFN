'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Breadcrumb, commonBreadcrumbs } from '@/components/ui/breadcrumb';
import { useAppStore } from '@/lib/store';
import { 
  Video, 
  Radio, 
  Users, 
  Calendar, 
  Search,
  Filter,
  Plus,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WebRTCManager } from './webrtc-manager';

// Mock data for live sessions
const mockLiveSessions = [
  {
    id: '1',
    title: 'Daily Fellowship Discussion',
    host: {
      id: 'host1',
      displayName: 'John Smith',
      avatarUrl: undefined,
    },
    viewerCount: 245,
    state: 'LIVE' as const,
    mode: 'VIDEO' as const,
    category: 'Discussion',
    startTime: new Date(),
  },
  {
    id: '2',
    title: 'Morning Prayer Session',
    host: {
      id: 'host2',
      displayName: 'Sarah Johnson',
      avatarUrl: undefined,
    },
    viewerCount: 89,
    state: 'LIVE' as const,
    mode: 'AUDIO' as const,
    category: 'Prayer',
    startTime: new Date(),
  },
  {
    id: '3',
    title: 'Youth Bible Study',
    host: {
      id: 'host3',
      displayName: 'Michael Chen',
      avatarUrl: undefined,
    },
    viewerCount: 156,
    state: 'SCHEDULED' as const,
    mode: 'VIDEO' as const,
    category: 'Bible Study',
    startTime: new Date(Date.now() + 3600000), // 1 hour from now
  },
];

interface LiveStreamPageProps {
  sessionId?: string;
}

export function LiveStreamPage({ sessionId }: LiveStreamPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(sessionId || null);
  
  const { currentUser, liveSessions, addLiveSession } = useAppStore();

  const categories = ['all', 'Discussion', 'Prayer', 'Bible Study', 'Worship', 'Youth', 'Teaching'];

  const filteredSessions = mockLiveSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.host.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateStream = () => {
    if (!currentUser) return;

    const newSession = {
      id: Date.now().toString(),
      hostId: currentUser.id,
      title: 'New Live Stream',
      host: currentUser,
      viewerCount: 0,
      state: 'LIVE' as const,
      mode: 'VIDEO' as const,
      category: 'Discussion',
      startTime: new Date(),
      isRecorded: false,
    };

    addLiveSession(newSession);
    setSelectedSession(newSession.id);
    setIsCreatingStream(false);
  };

  if (selectedSession) {
    const session = [...mockLiveSessions, ...liveSessions].find(s => s.id === selectedSession);
    console.log("ln120",session)
    if (!session) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Stream Not Found</h1>
            <Button variant="secondary" onClick={() => setSelectedSession(null)}>
              Back to Live Streams
            </Button>
          </div>
        </div>
      );
    }

    const isHost = currentUser?.id === session.host.id;

    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={commonBreadcrumbs.live} className="mb-6" />
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedSession(null)}
            className="mb-4 hover:bg-secondary/80"
          >
            ← Back to Live Streams
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stream */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stream Player */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black rounded-lg ">
                  {session.state === 'LIVE' ? (
                    <div>
                      <WebRTCManager sessionId={session.id}/>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">Stream Not Started</h3>
                        <p className="text-muted-foreground">
                          {session.state === 'SCHEDULED' ? 'Stream will start soon' : 'Stream has ended'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Stream overlay */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant={session.state === 'LIVE' ? 'destructive' : 'secondary'}
                      className={cn(session.state === 'LIVE' && 'animate-pulse')}
                    >
                      <Wifi className="w-3 h-3 mr-1" />
                      {session.state}
                    </Badge>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      {session.viewerCount} viewers
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stream Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={session.host.avatarUrl} />
                      <AvatarFallback>{session.host.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Hosted by {session.host.displayName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isHost && session.state === 'LIVE' && (
                      <Button variant="destructive" size="sm">
                        End Stream
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setSelectedSession(null)}>
                      Leave
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="space-y-6">
            {/* Live Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Live Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat messages area */}
                  <div className="h-64 overflow-y-auto space-y-2 border rounded-lg p-3 bg-muted/20">
                    <div className="text-center text-sm text-muted-foreground py-4">
                      Chat messages will appear here during the live stream
                    </div>
                  </div>
                  
                  {/* Chat input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button size="sm">Send</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stream Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    Join us for an inspiring discussion about faith, community, and fellowship.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <Badge variant="outline">{session.category}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Started</h4>
                  <p className="text-sm text-muted-foreground">
                    {session.startTime?.toLocaleTimeString() || 'Time not available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Streams</h1>
            <p className="text-muted-foreground">Join live conversations and fellowship</p>
          </div>
          
          <Button variant="gradient" onClick={() => setIsCreatingStream(true)} className="w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Start Stream
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search streams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap hover:bg-secondary/80"
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card 
              key={session.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedSession(session.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={session.state === 'LIVE' ? 'destructive' : 'secondary'}
                      className={cn(
                        session.state === 'LIVE' && 'animate-pulse',
                        'flex items-center space-x-1'
                      )}
                    >
                      {session.state === 'LIVE' ? (
                        <Wifi className="w-3 h-3" />
                      ) : (
                        <WifiOff className="w-3 h-3" />
                      )}
                      <span>{session.state}</span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {session.mode === 'VIDEO' ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <Radio className="w-3 h-3 mr-1" />
                      )}
                      {session.mode}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{session.viewerCount}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{session.title}</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={session.host.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {session.host.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {session.host.displayName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {session.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {session.state === 'LIVE' ? 'Started' : 'Starts'} {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No streams found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'No live streams are currently available'}
            </p>
            <Button variant="gradient" onClick={() => setIsCreatingStream(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Start the first stream
            </Button>
          </div>
        )}
      </div>

      {/* Create Stream Modal */}
      {isCreatingStream && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Start Live Stream</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ready to start streaming? Your stream will be visible to all fellowship members.
              </p>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsCreatingStream(false)}
                  className="hover:bg-secondary/80"
                >
                  Cancel
                </Button>
                <Button variant="gradient" onClick={handleCreateStream}>
                  Start Stream
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
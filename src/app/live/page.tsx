'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Force dynamic rendering to avoid pre-render issues with NextAuth
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Video, Users, Search, Plus, Play, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LivePage() {
  const session = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'Prayer', 'Bible Study', 'Worship', 'Discussion', 'Youth', 'Teaching'];
  
  const liveStreams = [
    {
      id: '1',
      title: 'Morning Prayer & Fellowship',
      host: {
        displayName: 'Pastor John Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
      viewerCount: 89,
      isLive: true,
      category: 'Prayer',
      startTime: new Date(Date.now() - 1800000),
      description: 'Join us for our daily morning prayer session and fellowship discussion.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    },
    {
      id: '2',
      title: 'Youth Bible Study',
      host: {
        displayName: 'Sarah Johnson',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b5b42d5c?w=150&h=150&fit=crop&crop=face',
      },
      viewerCount: 45,
      isLive: true,
      category: 'Bible Study',
      startTime: new Date(Date.now() - 900000),
      description: 'Interactive Bible study session for young adults.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
    },
    {
      id: '3',
      title: 'Community Discussion',
      host: {
        displayName: 'Michael Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      viewerCount: 0,
      isLive: false,
      category: 'Discussion',
      startTime: new Date(Date.now() + 3600000),
      description: 'Weekly community discussion about faith and daily life.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=225&fit=crop',
    },
  ];

  const filteredStreams = liveStreams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.host.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || stream.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartStream = () => {
    if (!session.data) {
      router.push('/auth/signin');
      return;
    }
    
    // Generate a unique room ID
    const roomId = Math.random().toString(36).substring(2, 10);
    router.push(`/live/${roomId}`);
  };

  const handleJoinStream = (streamId: string) => {
    router.push(`/live/${streamId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Live Streams & Video Conferences</h1>
            <p className="text-muted-foreground">
              Join live streams or start your own video conference
            </p>
          </div>
          
          <Button 
            onClick={handleStartStream}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-fit"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start Stream
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
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
              
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
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
          {filteredStreams.map((stream) => (
            <Card 
              key={stream.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleJoinStream(stream.id)}
            >
              <div className="relative aspect-video">
                {stream.thumbnailUrl ? (
                  <Image 
                    src={stream.thumbnailUrl} 
                    alt={stream.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                    <Video className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                
                {stream.isLive ? (
                  <Badge className="absolute top-3 left-3 bg-red-500 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    LIVE
                  </Badge>
                ) : (
                  <Badge className="absolute top-3 left-3 bg-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    SCHEDULED
                  </Badge>
                )}

                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    <Users className="w-3 h-3 mr-1" />
                    {stream.viewerCount}
                  </Badge>
                </div>

                {!stream.isLive && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-3">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{stream.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {stream.description}
                    </p>
                  </div>
                    <div className="flex items-center space-x-2">
                      <Image 
                        src={stream.host.avatarUrl} 
                        alt={stream.host.displayName}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-sm text-muted-foreground">
                      />
                      <span className="text-sm text-muted-foreground">
                        {stream.host.displayName}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {stream.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {stream.isLive 
                          ? `Started ${Math.floor((Date.now() - stream.startTime.getTime()) / 60000)}m ago`
                          : `Starts ${stream.startTime.toLocaleTimeString()}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStreams.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No streams found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'No live streams are currently available'}
            </p>
            <Button 
              onClick={handleStartStream}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start the first stream
            </Button>
          </div>
        )}

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Video className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Watch & Listen</h4>
                  <p className="text-sm text-muted-foreground">
                    Join live streams to watch and participate in chat
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Join Video Conference</h4>
                  <p className="text-sm text-muted-foreground">
                    Turn on your camera and participate directly in the discussion
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Start Your Own</h4>
                  <p className="text-sm text-muted-foreground">
                    Create and host your own live streams and video conferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stream Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Prayer Sessions</span>
                <Badge variant="secondary">Live Now</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Bible Study</span>
                <Badge variant="secondary">3 Streams</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Worship & Music</span>
                <Badge variant="secondary">2 Streams</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Youth Fellowship</span>
                <Badge variant="secondary">1 Stream</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Community Discussion</span>
                <Badge variant="secondary">4 Streams</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
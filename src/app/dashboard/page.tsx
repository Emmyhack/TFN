'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/layout/header';
import { 
  Video, 
  Mic, 
  Users, 
  Calendar, 
  Settings, 
  Plus,
  Play,
  BarChart3,
  Eye,
  Clock,
  TrendingUp,
  MessageSquare,
  Heart,
  Share,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveStream {
  id: string;
  title: string;
  description?: string;
  isLive: boolean;
  viewerCount: number;
  startedAt?: Date;
  thumbnailUrl?: string;
  duration?: number;
}

interface StreamStats {
  totalStreams: number;
  totalViewers: number;
  totalWatchTime: number;
  avgViewers: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [newStreamTitle, setNewStreamTitle] = useState('');
  const [newStreamDescription, setNewStreamDescription] = useState('');
  const [userStreams, setUserStreams] = useState<LiveStream[]>([]);
  const [stats, setStats] = useState<StreamStats>({
    totalStreams: 0,
    totalViewers: 0,
    totalWatchTime: 0,
    avgViewers: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  // Load user's streams and stats
  useEffect(() => {
    if (session?.user) {
      loadUserStreams();
      loadUserStats();
    }
  }, [session]);

  const loadUserStreams = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockStreams: LiveStream[] = [
        {
          id: '1',
          title: 'Morning Prayer Session',
          description: 'Join us for our daily morning prayer and meditation',
          isLive: true,
          viewerCount: 45,
          startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
          thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        },
        {
          id: '2',
          title: 'Bible Study: Acts Chapter 2',
          description: 'Deep dive into the early church and Pentecost',
          isLive: false,
          viewerCount: 89,
          duration: 3600, // 1 hour
          thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        },
        {
          id: '3',
          title: 'Youth Fellowship Discussion',
          description: 'Weekly discussion for young believers',
          isLive: false,
          viewerCount: 67,
          duration: 2700, // 45 minutes
          thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=200&fit=crop',
        }
      ];
      setUserStreams(mockStreams);
    } catch (error) {
      console.error('Error loading streams:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockStats: StreamStats = {
        totalStreams: 12,
        totalViewers: 1234,
        totalWatchTime: 45600, // in seconds
        avgViewers: 67,
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const createNewStream = async () => {
    if (!newStreamTitle.trim()) return;

    try {
      // Create new stream
      const streamId = Date.now().toString();
      const newStream: LiveStream = {
        id: streamId,
        title: newStreamTitle,
        description: newStreamDescription,
        isLive: false,
        viewerCount: 0,
      };

      setUserStreams(prev => [newStream, ...prev]);
      setIsCreatingStream(false);
      setNewStreamTitle('');
      setNewStreamDescription('');

      // Navigate to the stream
      router.push(`/live/${streamId}`);
    } catch (error) {
      console.error('Error creating stream:', error);
    }
  };

  const startLiveStream = async (streamId: string) => {
    try {
      // Update stream to live status
      setUserStreams(prev => 
        prev.map(stream => 
          stream.id === streamId 
            ? { ...stream, isLive: true, startedAt: new Date() }
            : stream
        )
      );

      // Navigate to live stream
      router.push(`/live/${streamId}`);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    if (hours > 1000) {
      return `${Math.floor(hours / 1000)}k hours`;
    }
    return `${hours} hours`;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session.user} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {session.user.displayName}!</h1>
            <p className="text-muted-foreground">Ready to connect with your community?</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="lg" 
              onClick={() => setIsCreatingStream(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Video className="w-5 h-5 mr-2" />
              Start Stream
            </Button>
            <Button size="lg" variant="outline">
              <Mic className="w-5 h-5 mr-2" />
              Audio Only
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Video className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Streams</p>
                  <p className="text-2xl font-bold">{stats.totalStreams}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{stats.totalViewers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Watch Time</p>
                  <p className="text-2xl font-bold">{formatWatchTime(stats.totalWatchTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Viewers</p>
                  <p className="text-2xl font-bold">{stats.avgViewers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Streams */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Streams</CardTitle>
                <CardDescription>Manage your live streams and recordings</CardDescription>
              </div>
              <Button 
                onClick={() => setIsCreatingStream(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Stream
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userStreams.map((stream) => (
                <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {stream.thumbnailUrl ? (
                      <img 
                        src={stream.thumbnailUrl} 
                        alt={stream.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                    )}
                    
                    {stream.isLive && (
                      <Badge className="absolute top-2 left-2 bg-red-500 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                        LIVE
                      </Badge>
                    )}
                    
                    {!stream.isLive && stream.duration && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                        {formatDuration(stream.duration)}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">{stream.title}</h3>
                    {stream.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {stream.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{stream.viewerCount} views</span>
                      </div>
                      {stream.startedAt && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{stream.startedAt.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {stream.isLive ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => router.push(`/live/${stream.id}`)}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Live
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => startLiveStream(stream.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Go Live
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Started "Morning Prayer Session"</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Received 23 new followers</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Stream "Bible Study" reached 100 views</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Stream
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Community
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Stream Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Stream Modal */}
      {isCreatingStream && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Stream</CardTitle>
              <CardDescription>
                Set up your live stream to connect with your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Stream Title</Label>
                <Input
                  id="title"
                  value={newStreamTitle}
                  onChange={(e) => setNewStreamTitle(e.target.value)}
                  placeholder="Enter stream title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newStreamDescription}
                  onChange={(e) => setNewStreamDescription(e.target.value)}
                  placeholder="Describe your stream..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsCreatingStream(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={createNewStream}
                  disabled={!newStreamTitle.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Create Stream
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
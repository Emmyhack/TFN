'use client';

import Image from 'next/image';
import dynamicImport from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Force dynamic rendering to avoid pre-render issues with NextAuth
export const dynamic = 'force-dynamic';
import { Badge } from '@/components/ui/badge';
import { HighlightsRail } from '@/components/ui/story-ring';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, 
  Mic, 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp,
  Play,
  Eye,
  Heart,
  Share2,
  Plus
} from 'lucide-react';

// Dynamic import to prevent SSR issues
const Header = dynamicImport(() => import('@/components/layout/header').then(mod => ({ default: mod.Header })), { ssr: false });

// Mock data
const mockUser = {
  id: '1',
  displayName: 'Demo User',
  handle: 'demouser',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
};

const mockStories = [
  {
    user: {
      id: '1',
      displayName: 'Pastor John',
      handle: 'pastorjohn',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    isLive: true,
    onClick: () => console.log('Pastor John live clicked'),
  },
  {
    user: {
      id: '2', 
      displayName: 'Sarah M.',
      handle: 'sarahm',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b5b42d5c?w=150&h=150&fit=crop&crop=face',
    },
    hasUpdate: true,
    onClick: () => console.log('Sarah update clicked'),
  },
  {
    user: {
      id: '3',
      displayName: 'David K.',
      handle: 'davidk',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    onClick: () => console.log('David clicked'),
  },
];

const mockRecentSessions = [
  {
    id: '1',
    title: 'Sunday Morning Service',
    host: 'Pastor John',
    duration: '01:23:45',
    views: 245,
    likes: 32,
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Wednesday Bible Study',
    host: 'Elder Smith',
    duration: '45:12',
    views: 89,
    likes: 12,
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    createdAt: '2024-01-12T19:00:00Z',
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {mockUser.displayName}!</h1>
            <p className="text-muted-foreground">Ready to connect with your community?</p>
          </div>
          <div className="flex space-x-2">
            <Button size="lg">
              <Video className="w-5 h-5 mr-2" />
              Go Live
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
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Video className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Live Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">2.4K</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Now & Stories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Live Now & Recent Updates</CardTitle>
              <Badge variant="success" className="animate-pulse">
                {mockStories.filter(s => s.isLive).length} Live
              </Badge>
            </div>
            <CardDescription>
              See what&apos;s happening in your community right now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HighlightsRail stories={mockStories} />
          </CardContent>
        </Card>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>
                  Your latest live streams and recordings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentSessions.map((session) => (
                    <div key={session.id} className="flex space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="relative">
                        <Image 
                          src={session.thumbnail} 
                          alt={session.title}
                          width={96}
                          height={64}
                          className="w-24 h-16 rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button size="icon" variant="secondary" className="w-8 h-8">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">by {session.host}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-muted-foreground">{session.duration}</span>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{session.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{session.likes}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Event
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  New Message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Friends
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Don&apos;t miss these scheduled events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium">Jan</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Youth Meeting</h4>
                      <p className="text-sm text-muted-foreground">7:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium">Jan</p>
                      <p className="text-2xl font-bold">21</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Sunday Service</h4>
                      <p className="text-sm text-muted-foreground">10:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
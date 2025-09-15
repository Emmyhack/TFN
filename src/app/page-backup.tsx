'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HighlightsRail } from '@/components/ui/story-ring';
import { EventCardSkeleton, CardSkeleton } from '@/components/ui/skeleton';
import { Calendar, Users, Video, MessageCircle, Zap, Shield } from 'lucide-react';

// Mock data for demonstration
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

const features = [
  {
    icon: Video,
    title: 'Live Streaming',
    description: 'Start live audio & video sessions with real-time chat and reactions',
    color: 'text-red-500',
  },
  {
    icon: Users,
    title: 'Groups & Channels',
    description: 'Create communities with topic-based channels and role management',
    color: 'text-blue-500',
  },
  {
    icon: MessageCircle,
    title: 'Direct Messaging',
    description: 'Private conversations with audio calls and file sharing',
    color: 'text-green-500',
  },
  {
    icon: Calendar,
    title: 'Events & Replays',
    description: 'Schedule events and access recorded session replays',
    color: 'text-purple-500',
  },
  {
    icon: Zap,
    title: 'Real-time Features',
    description: 'Instant notifications, typing indicators, and presence tracking',
    color: 'text-yellow-500',
  },
  {
    icon: Shield,
    title: 'Admin Dashboard',
    description: 'Comprehensive moderation tools and user management',
    color: 'text-indigo-500',
  },
];

export default function HomePage() {
  // Mock user - in real app this would come from auth context
  const mockUser = {
    id: '1',
    displayName: 'Demo User',
    handle: 'demouser',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Welcome to TFN
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The Fellowship Network - A modern community platform for church and fellowship groups with live streaming, real-time chat, and powerful admin tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" variant="gradient" className="px-8" onClick={() => window.location.href = '/live'}>
              <Video className="w-5 h-5 mr-2" />
              Start Live Session
            </Button>
            <Button size="lg" variant="success" className="px-8" onClick={() => window.location.href = '/groups'}>
              <Users className="w-5 h-5 mr-2" />
              Join Community
            </Button>
          </div>
        </section>

        {/* Live Now / Highlights Rail */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Live Now & Updates</h2>
            <Badge variant="success" className="animate-pulse">
              {mockStories.filter(s => s.isLive).length} Live
            </Badge>
          </div>
          <HighlightsRail stories={mockStories} className="mb-8" />
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Everything you need for your community
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to bring your fellowship together
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group card-hover border-0 shadow-md hover:shadow-2xl bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Demo Section */}
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 py-16 rounded-3xl">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gradient mb-4">
                See it in action
              </h2>
              <p className="text-xl text-muted-foreground">
                Experience the power of modern fellowship
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-xl">Live Sessions</CardTitle>
                  <CardDescription className="text-base">
                    Experience real-time streaming with chat, reactions, and recording
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-lg h-48 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Video className="w-16 h-16 text-red-500 animate-pulse" />
                  </div>
                  <Button variant="success" className="w-full" onClick={() => window.location.href = '/live'}>
                    Join Live Demo
                  </Button>
                </CardContent>
              </Card>

              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
              <CardHeader>
                <CardTitle>Community Groups</CardTitle>
                <CardDescription>
                  Organize your community with channels, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">General Discussion</span>
                    <Badge variant="secondary" className="text-xs">24 online</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">Prayer Requests</span>
                    <Badge variant="secondary" className="text-xs">12 online</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm">Events</span>
                    <Badge variant="secondary" className="text-xs">8 online</Badge>
                  </div>
                </div>
                <Button variant="secondary" className="w-full mt-4" onClick={() => window.location.href = '/groups'}>
                  Explore Groups
                </Button>
              </CardContent>
            </Card>
          </div>
          </div>
        </section>

        {/* Loading States Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Loading States (Demo)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <EventCardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-3xl border border-gradient-to-r from-purple-200 to-blue-200 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-gradient mb-6">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of communities already using TFN to connect, share, and grow together in fellowship.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="xl" variant="premium" onClick={() => window.location.href = '/dashboard'}>
                Sign Up Free
              </Button>
              <Button size="xl" variant="outline" onClick={() => window.open('https://docs.tfn.com', '_blank')} className="bg-white/80 backdrop-blur-sm">
                View Documentation
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
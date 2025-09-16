'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Heart,
  Share,
  Settings,
  Video,
  MessageCircle,
  UserPlus,
  Play,
  Plus
} from 'lucide-react';

interface LiveStreamPageProps {
  streamId?: string;
  className?: string;
}

export function LiveStreamPage({ streamId, className = '' }: LiveStreamPageProps) {
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(42);
  const [likes, setLikes] = useState(156);

  return (
    <div className={`min-h-screen bg-black text-white ${className}`}>
      {/* Video Player */}
      <div className="relative aspect-video bg-gray-900">
        <video 
          className="w-full h-full object-cover" 
          controls
          autoPlay
          muted
        >
          <source src="/sample-stream.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              LIVE
            </Badge>
          </div>
        )}

        {/* Viewer count */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-black/50 text-white">
            <Users className="w-4 h-4 mr-1" />
            {viewerCount}
          </Badge>
        </div>

        {/* Stream controls overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="bg-black/50">
              <Heart className="w-4 h-4 mr-2" />
              {likes}
            </Button>
            <Button size="sm" variant="secondary" className="bg-black/50">
              <Share className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="bg-black/50">
              <UserPlus className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="bg-black/50">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stream info */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Morning Prayer & Fellowship
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Join us for our daily morning prayer session and fellowship discussion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                    alt="Host"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-white">Pastor John Smith</p>
                    <p className="text-sm text-gray-400">Host</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline">Prayer</Badge>
                  <Badge variant="outline">Fellowship</Badge>
                  <Badge variant="outline">Community</Badge>
                </div>
                
                <p className="text-gray-300 mb-4">
                  Welcome to our morning prayer session. Today we&apos;ll be focusing on 
                  gratitude and community support. Feel free to share your prayer 
                  requests in the chat.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chat sidebar */}
          <div className="w-full lg:w-80">
            <Card className="bg-gray-900 border-gray-700 h-96">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 overflow-y-auto p-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold text-blue-400">Sarah:</span>
                    <span className="text-gray-300 ml-2">Thank you for this session!</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-green-400">Mike:</span>
                    <span className="text-gray-300 ml-2">Amen to that prayer 🙏</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-purple-400">Grace:</span>
                    <span className="text-gray-300 ml-2">Can you pray for my family?</span>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                    <Button size="sm">Send</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Video, 
  Users, 
  Settings, 
  Share2, 
  Copy, 
  Eye, 
  Clock,
  Play,
  Square,
  Mic,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';

interface StreamSettings {
  title: string;
  description: string;
  isPublic: boolean;
  allowParticipants: boolean;
  maxParticipants: number;
  requireApproval: boolean;
}

interface LiveStream {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  isLive: boolean;
  viewerCount: number;
  participantCount: number;
  startedAt?: Date;
  settings: StreamSettings;
}

export default function StreamManager({ userId, userName }: { userId: string; userName: string }) {
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    title: '',
    description: '',
    isPublic: true,
    allowParticipants: true,
    maxParticipants: 10,
    requireApproval: false
  });

  // Check for existing active stream
  useEffect(() => {
    checkActiveStream();
  }, [userId]);

  const checkActiveStream = async () => {
    try {
      const response = await fetch(`/api/streams/active/${userId}`);
      if (response.ok) {
        const stream = await response.json();
        setActiveStream(stream);
      }
    } catch (error) {
      console.error('Failed to check active stream:', error);
    }
  };

  const createStream = async () => {
    if (!streamSettings.title.trim()) {
      toast.error('Please enter a stream title');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/streams/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostId: userId,
          hostName: userName,
          ...streamSettings
        })
      });

      if (response.ok) {
        const newStream = await response.json();
        setActiveStream(newStream);
        toast.success('Stream created successfully!');
      } else {
        throw new Error('Failed to create stream');
      }
    } catch (error) {
      console.error('Error creating stream:', error);
      toast.error('Failed to create stream');
    } finally {
      setIsCreating(false);
    }
  };

  const startStream = async () => {
    if (!activeStream) return;

    setIsStarting(true);
    try {
      const response = await fetch(`/api/streams/${activeStream.id}/start`, {
        method: 'POST'
      });

      if (response.ok) {
        const updatedStream = await response.json();
        setActiveStream(updatedStream);
        toast.success('Stream started successfully!');
      } else {
        throw new Error('Failed to start stream');
      }
    } catch (error) {
      console.error('Error starting stream:', error);
      toast.error('Failed to start stream');
    } finally {
      setIsStarting(false);
    }
  };

  const stopStream = async () => {
    if (!activeStream) return;

    try {
      const response = await fetch(`/api/streams/${activeStream.id}/stop`, {
        method: 'POST'
      });

      if (response.ok) {
        setActiveStream(null);
        toast.success('Stream stopped successfully!');
      } else {
        throw new Error('Failed to stop stream');
      }
    } catch (error) {
      console.error('Error stopping stream:', error);
      toast.error('Failed to stop stream');
    }
  };

  const copyStreamLink = () => {
    if (activeStream) {
      const streamLink = `${window.location.origin}/live/${activeStream.id}`;
      navigator.clipboard.writeText(streamLink);
      toast.success('Stream link copied to clipboard!');
    }
  };

  const shareStream = async () => {
    if (activeStream && navigator.share) {
      try {
        await navigator.share({
          title: activeStream.title,
          text: activeStream.description,
          url: `${window.location.origin}/live/${activeStream.id}`
        });
      } catch (error) {
        console.error('Error sharing stream:', error);
      }
    } else {
      copyStreamLink();
    }
  };

  if (activeStream) {
    return (
      <div className="space-y-6">
        {/* Stream Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {activeStream.isLive ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      LIVE
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      Stream Ready
                    </>
                  )}
                </CardTitle>
                <CardDescription>{activeStream.title}</CardDescription>
              </div>
              <Badge variant={activeStream.isLive ? "destructive" : "secondary"}>
                {activeStream.isLive ? "Broadcasting" : "Standby"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{activeStream.viewerCount}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Eye className="w-4 h-4" />
                  Viewers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{activeStream.participantCount}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  Participants
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {activeStream.startedAt ? 
                    Math.floor((Date.now() - new Date(activeStream.startedAt).getTime()) / 60000) : 0
                  }m
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Duration
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {activeStream.settings.maxParticipants}
                </div>
                <div className="text-sm text-muted-foreground">
                  Max Users
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!activeStream.isLive ? (
                <Button onClick={startStream} disabled={isStarting} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {isStarting ? "Starting..." : "Start Stream"}
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopStream} className="flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Stop Stream
                </Button>
              )}

              <Button variant="outline" onClick={copyStreamLink} className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>

              <Button variant="outline" onClick={shareStream} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            {activeStream.description && (
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{activeStream.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stream Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Stream Settings
            </CardTitle>
            <CardDescription>
              Manage your stream configuration and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Public Stream</Label>
                  <p className="text-xs text-muted-foreground">Anyone can discover and join</p>
                </div>
                <Switch 
                  checked={activeStream.settings.isPublic}
                  disabled={activeStream.isLive}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Allow Participants</Label>
                  <p className="text-xs text-muted-foreground">Viewers can join with camera/mic</p>
                </div>
                <Switch 
                  checked={activeStream.settings.allowParticipants}
                  disabled={activeStream.isLive}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Require Approval</Label>
                  <p className="text-xs text-muted-foreground">Manually approve participants</p>
                </div>
                <Switch 
                  checked={activeStream.settings.requireApproval}
                  disabled={activeStream.isLive}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Create New Stream
        </CardTitle>
        <CardDescription>
          Set up a new live stream or video conference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Stream Title *</Label>
          <Input
            id="title"
            placeholder="Enter stream title"
            value={streamSettings.title}
            onChange={(e) => setStreamSettings(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your stream (optional)"
            value={streamSettings.description}
            onChange={(e) => setStreamSettings(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">Stream Settings</Label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Public Stream</Label>
                <p className="text-xs text-muted-foreground">Anyone can discover and join your stream</p>
              </div>
              <Switch 
                checked={streamSettings.isPublic}
                onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Allow Participants</Label>
                <p className="text-xs text-muted-foreground">Let viewers join with their camera/microphone</p>
              </div>
              <Switch 
                checked={streamSettings.allowParticipants}
                onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, allowParticipants: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Require Approval</Label>
                <p className="text-xs text-muted-foreground">Manually approve participants before they join</p>
              </div>
              <Switch 
                checked={streamSettings.requireApproval}
                onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, requireApproval: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxParticipants" className="text-sm font-medium">
                Maximum Participants
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                max="50"
                value={streamSettings.maxParticipants}
                onChange={(e) => setStreamSettings(prev => ({ 
                  ...prev, 
                  maxParticipants: Math.max(1, Math.min(50, parseInt(e.target.value) || 1))
                }))}
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={createStream} 
          disabled={isCreating || !streamSettings.title.trim()}
          className="w-full"
        >
          {isCreating ? "Creating Stream..." : "Create Stream"}
        </Button>
      </CardContent>
    </Card>
  );
}
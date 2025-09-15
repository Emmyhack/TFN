'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { 
  Users, 
  Plus, 
  Search, 
  Settings, 
  Crown,
  Shield,
  Hash,
  Lock,
  Globe,
  MoreVertical,
  UserPlus,
  Ban,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Group {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  memberCount: number;
  isPrivate: boolean;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  channels: Channel[];
  members: GroupMember[];
  createdAt: Date;
}

interface Channel {
  id: string;
  name: string;
  type: 'TEXT' | 'VOICE' | 'ANNOUNCEMENT';
  isPrivate: boolean;
  position: number;
  groupId: string;
  permissions?: string[];
}

interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: Date;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    isOnline: boolean;
  };
}

interface GroupManagerProps {
  selectedGroupId?: string;
  onGroupSelect?: (groupId: string) => void;
  className?: string;
}

export function GroupManager({ selectedGroupId, onGroupSelect, className }: GroupManagerProps) {
  const { currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

  // Mock groups data
  const [groups] = useState<Group[]>([
    {
      id: 'fellowship-central',
      name: 'Fellowship Central',
      description: 'Main community hub for all fellowship activities',
      memberCount: 1247,
      isPrivate: false,
      role: 'MEMBER',
      channels: [
        { id: 'general', name: 'general', type: 'TEXT', isPrivate: false, position: 0, groupId: 'fellowship-central' },
        { id: 'announcements', name: 'announcements', type: 'ANNOUNCEMENT', isPrivate: false, position: 1, groupId: 'fellowship-central' },
        { id: 'prayer-requests', name: 'prayer-requests', type: 'TEXT', isPrivate: false, position: 2, groupId: 'fellowship-central' },
        { id: 'voice-general', name: 'General Voice', type: 'VOICE', isPrivate: false, position: 3, groupId: 'fellowship-central' },
      ],
      members: [],
      createdAt: new Date(Date.now() - 86400000 * 30),
    },
    {
      id: 'youth-ministry',
      name: 'Youth Ministry',
      description: 'Space for young adults to connect and grow together',
      memberCount: 89,
      isPrivate: false,
      role: 'MODERATOR',
      channels: [
        { id: 'youth-chat', name: 'youth-chat', type: 'TEXT', isPrivate: false, position: 0, groupId: 'youth-ministry' },
        { id: 'events', name: 'events', type: 'TEXT', isPrivate: false, position: 1, groupId: 'youth-ministry' },
        { id: 'gaming', name: 'gaming', type: 'TEXT', isPrivate: false, position: 2, groupId: 'youth-ministry' },
      ],
      members: [],
      createdAt: new Date(Date.now() - 86400000 * 15),
    },
    {
      id: 'leadership-team',
      name: 'Leadership Team',
      description: 'Private space for ministry leaders',
      memberCount: 12,
      isPrivate: true,
      role: 'ADMIN',
      channels: [
        { id: 'leadership-general', name: 'general', type: 'TEXT', isPrivate: true, position: 0, groupId: 'leadership-team' },
        { id: 'planning', name: 'planning', type: 'TEXT', isPrivate: true, position: 1, groupId: 'leadership-team' },
      ],
      members: [],
      createdAt: new Date(Date.now() - 86400000 * 45),
    },
  ]);

  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'ADMIN': return <Shield className="w-4 h-4 text-red-500" />;
      case 'MODERATOR': return <Shield className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getChannelIcon = (type: string, isPrivate: boolean) => {
    if (type === 'VOICE') return <Volume2 className="w-4 h-4" />;
    if (type === 'ANNOUNCEMENT') return <span className="text-sm">📢</span>;
    return isPrivate ? <Lock className="w-4 h-4" /> : <Hash className="w-4 h-4" />;
  };

  const handleCreateGroup = () => {
    // Implementation for creating a new group
    setIsCreatingGroup(false);
  };

  const handleCreateChannel = () => {
    // Implementation for creating a new channel
    setIsCreatingChannel(false);
  };

  return (
    <div className={cn('flex h-full', className)}>
      {/* Groups Sidebar */}
      <div className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Groups</h2>
            <Button 
              size="icon" 
              variant="gradient" 
              className="h-6 w-6"
              onClick={() => setIsCreatingGroup(true)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {filteredGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => onGroupSelect?.(group.id)}
                className={cn(
                  'w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-muted transition-colors',
                  selectedGroupId === group.id && 'bg-muted'
                )}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={group.avatarUrl} />
                  <AvatarFallback className="text-sm">
                    {group.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm truncate">{group.name}</span>
                    {group.isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
                    {getRoleIcon(group.role)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {group.memberCount} members
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Group Content */}
      <div className="flex-1 flex flex-col">
        {/* Group Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={currentGroup.avatarUrl} />
                <AvatarFallback>
                  {currentGroup.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold">{currentGroup.name}</h1>
                  {currentGroup.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
                  {getRoleIcon(currentGroup.role)}
                </div>
                <p className="text-sm text-muted-foreground">{currentGroup.description}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-muted-foreground">
                    <Users className="w-4 h-4 inline mr-1" />
                    {currentGroup.memberCount} members
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Created {currentGroup.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
              {['OWNER', 'ADMIN'].includes(currentGroup.role) && (
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Channels List */}
          <div className="w-64 border-r p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Channels</h3>
              {['OWNER', 'ADMIN', 'MODERATOR'].includes(currentGroup.role) && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6"
                  onClick={() => setIsCreatingChannel(true)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="space-y-1">
              {currentGroup.channels
                .sort((a, b) => a.position - b.position)
                .map((channel) => (
                  <button
                    key={channel.id}
                    className="w-full flex items-center space-x-2 p-2 rounded hover:bg-muted text-left"
                  >
                    {getChannelIcon(channel.type, channel.isPrivate)}
                    <span className="text-sm">{channel.name}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Members</h3>
              <div className="text-sm text-muted-foreground">
                {currentGroup.memberCount} total
              </div>
            </div>

            {/* Online Members */}
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Online — 45
                </h4>
                <div className="space-y-2">
                  {/* Mock online members */}
                  {[
                    { id: '1', displayName: 'John Smith', role: 'OWNER', isOnline: true },
                    { id: '2', displayName: 'Sarah Johnson', role: 'ADMIN', isOnline: true },
                    { id: '3', displayName: 'Michael Chen', role: 'MODERATOR', isOnline: true },
                    { id: '4', displayName: 'Emily Davis', role: 'MEMBER', isOnline: true },
                  ].map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted group">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={undefined} />
                          <AvatarFallback className="text-xs">
                            {member.displayName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium truncate">{member.displayName}</span>
                          {getRoleIcon(member.role)}
                        </div>
                      </div>
                      {['OWNER', 'ADMIN'].includes(currentGroup.role) && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Offline — {currentGroup.memberCount - 45}
                </h4>
                <div className="space-y-2">
                  {/* Mock offline members */}
                  {[
                    { id: '5', displayName: 'David Wilson', role: 'MEMBER', isOnline: false },
                    { id: '6', displayName: 'Lisa Anderson', role: 'MEMBER', isOnline: false },
                  ].map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted group opacity-60">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="text-xs">
                          {member.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium truncate">{member.displayName}</span>
                          {getRoleIcon(member.role)}
                        </div>
                      </div>
                      {['OWNER', 'ADMIN'].includes(currentGroup.role) && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Group Name</label>
                <Input placeholder="Enter group name" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Describe your group" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="private" className="rounded" />
                <label htmlFor="private" className="text-sm">Make this group private</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingGroup(false)}
                >
                  Cancel
                </Button>
                <Button variant="gradient" onClick={handleCreateGroup}>
                  Create Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Channel Modal */}
      {isCreatingChannel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create Channel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Channel Name</label>
                <Input placeholder="Enter channel name" />
              </div>
              <div>
                <label className="text-sm font-medium">Channel Type</label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="channelType" id="text" value="TEXT" defaultChecked />
                    <label htmlFor="text" className="text-sm flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span>Text Channel</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="channelType" id="voice" value="VOICE" />
                    <label htmlFor="voice" className="text-sm flex items-center space-x-2">
                      <Volume2 className="w-4 h-4" />
                      <span>Voice Channel</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="channelPrivate" className="rounded" />
                <label htmlFor="channelPrivate" className="text-sm">Private Channel</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingChannel(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateChannel}>
                  Create Channel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
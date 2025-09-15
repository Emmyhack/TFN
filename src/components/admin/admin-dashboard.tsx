'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Search,
  Filter,
  MoreVertical,
  Ban,
  UserX,
  Eye,
  Trash2,
  Settings,
  Download,
  Upload,
  Calendar,
  BarChart3,
  PieChart,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  totalMessages: number;
  pendingReports: number;
  liveStreams: number;
}

interface UserReport {
  id: string;
  reportedUser: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  reporter: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  reason: string;
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: Date;
  evidence?: {
    messageId?: string;
    content?: string;
    timestamp?: Date;
  };
}

interface AdminDashboardProps {
  view?: 'overview' | 'users' | 'content' | 'reports' | 'settings';
}

export function AdminDashboard({ view = 'overview' }: AdminDashboardProps) {
  const { currentUser } = useAppStore();
  const [currentView, setCurrentView] = useState(view);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock admin stats
  const [stats] = useState<AdminStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalGroups: 45,
    totalMessages: 15670,
    pendingReports: 7,
    liveStreams: 3,
  });

  // Mock reports data
  const [reports] = useState<UserReport[]>([
    {
      id: '1',
      reportedUser: {
        id: 'user1',
        displayName: 'John Doe',
        avatarUrl: undefined,
      },
      reporter: {
        id: 'user2',
        displayName: 'Jane Smith',
        avatarUrl: undefined,
      },
      reason: 'Inappropriate Content',
      description: 'Posted offensive language in general chat',
      status: 'PENDING',
      severity: 'HIGH',
      createdAt: new Date(Date.now() - 3600000),
      evidence: {
        messageId: 'msg1',
        content: 'Inappropriate message content...',
        timestamp: new Date(Date.now() - 7200000),
      },
    },
    {
      id: '2',
      reportedUser: {
        id: 'user3',
        displayName: 'Mike Johnson',
        avatarUrl: undefined,
      },
      reporter: {
        id: 'user4',
        displayName: 'Sarah Wilson',
        avatarUrl: undefined,
      },
      reason: 'Spam',
      description: 'Sending repeated messages in prayer requests',
      status: 'PENDING',
      severity: 'MEDIUM',
      createdAt: new Date(Date.now() - 7200000),
    },
  ]);

  // Mock users data
  const [users] = useState([
    {
      id: 'user1',
      displayName: 'John Smith',
      email: 'john@example.com',
      avatarUrl: undefined,
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(),
      isVerified: true,
      status: 'ACTIVE',
      role: 'MEMBER',
      messageCount: 245,
      groupCount: 5,
    },
    {
      id: 'user2',
      displayName: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatarUrl: undefined,
      joinedAt: new Date('2024-02-10'),
      lastActive: new Date(Date.now() - 3600000),
      isVerified: true,
      status: 'ACTIVE',
      role: 'MODERATOR',
      messageCount: 567,
      groupCount: 8,
    },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleReportAction = (reportId: string, action: 'approve' | 'dismiss' | 'ban') => {
    console.log('Report action:', reportId, action);
  };

  const handleUserAction = (userId: string, action: 'ban' | 'warn' | 'promote' | 'demote') => {
    console.log('User action:', userId, action);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+15%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Streams</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.liveStreams}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={report.reportedUser.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {report.reportedUser.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{report.reportedUser.displayName}</span>
                      <Badge 
                        variant="outline" 
                        className={cn('text-white text-xs', getSeverityColor(report.severity))}
                      >
                        {report.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{report.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.createdAt.toLocaleDateString()} - by {report.reporter.displayName}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                <p>Activity chart would go here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Reports</h2>
          <p className="text-muted-foreground">Review and moderate user reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select 
              className="px-3 py-2 border rounded-md"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={report.reportedUser.avatarUrl} />
                      <AvatarFallback>{report.reportedUser.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{report.reportedUser.displayName}</span>
                        <Badge variant="outline">{report.status}</Badge>
                        <Badge 
                          variant="outline" 
                          className={cn('text-white', getSeverityColor(report.severity))}
                        >
                          {report.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Reported by {report.reporter.displayName} • {report.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Reason</h4>
                    <p className="text-sm">{report.reason}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>

                  {report.evidence && (
                    <div className="bg-muted p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Evidence</h4>
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;{report.evidence.content}&rdquo;
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {report.evidence.timestamp?.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleReportAction(report.id, 'approve')}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Take Action
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReportAction(report.id, 'dismiss')}
                    >
                      Dismiss
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleReportAction(report.id, 'ban')}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Ban User
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage community members and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select 
              className="px-3 py-2 border rounded-md"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{user.displayName}</span>
                      {user.isVerified && (
                        <Badge variant="outline" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                      <span>{user.messageCount} messages</span>
                      <span>{user.groupCount} groups</span>
                      <span>Last active: {user.lastActive.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    <UserX className="w-4 h-4 mr-2" />
                    Ban
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Shield className="w-8 h-8" />
              <span>Admin Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Manage and moderate the TFN community</p>
          </div>
        </div>

        {/* Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-1 overflow-x-auto">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'users', label: 'Users', icon: Users },
                { key: 'content', label: 'Content', icon: MessageSquare },
                { key: 'reports', label: 'Reports', icon: AlertTriangle },
                { key: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => (
                <Button
                  key={item.key}
                  variant={currentView === item.key ? 'default' : 'ghost'}
                  onClick={() => setCurrentView(item.key as any)}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.key === 'reports' && stats.pendingReports > 0 && (
                    <Badge variant="destructive" className="ml-1 text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {stats.pendingReports}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {currentView === 'overview' && renderOverview()}
        {currentView === 'reports' && renderReports()}
        {currentView === 'users' && renderUsers()}
        
        {(currentView === 'content' || currentView === 'settings') && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Settings className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{currentView === 'content' ? 'Content Management' : 'Settings'}</h3>
                <p>This section is under development and will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
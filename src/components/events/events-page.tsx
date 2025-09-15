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
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  Video,
  Radio,
  MoreVertical,
  Share2,
  Bell,
  BellOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  isOnline: boolean;
  isPrivate: boolean;
  maxAttendees?: number;
  category: 'WORSHIP' | 'STUDY' | 'FELLOWSHIP' | 'SERVICE' | 'YOUTH' | 'PRAYER';
  organizer: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  attendees: EventAttendee[];
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  streamUrl?: string;
  groupId?: string;
}

interface EventAttendee {
  id: string;
  userId: string;
  eventId: string;
  status: 'GOING' | 'MAYBE' | 'NOT_GOING';
  joinedAt: Date;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
}

interface EventsPageProps {
  view?: 'calendar' | 'list';
  selectedEventId?: string;
}

export function EventsPage({ view = 'calendar', selectedEventId }: EventsPageProps) {
  const { currentUser } = useAppStore();
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>(view);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<string | null>(selectedEventId || null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock events data
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Sunday Morning Worship',
      description: 'Join us for our weekly worship service with inspiring music and teaching.',
      startDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      endDate: new Date(Date.now() + 86400000 * 2 + 7200000), // 2 hours later
      location: 'Main Sanctuary',
      isOnline: true,
      isPrivate: false,
      maxAttendees: 500,
      category: 'WORSHIP',
      organizer: {
        id: 'organizer1',
        displayName: 'Pastor John',
        avatarUrl: undefined,
      },
      attendees: [],
      status: 'UPCOMING',
      streamUrl: 'https://stream.tfn.com/worship',
    },
    {
      id: '2',
      title: 'Bible Study: Romans',
      description: 'Deep dive into Paul\'s letter to the Romans. Bring your Bibles and notebooks!',
      startDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      endDate: new Date(Date.now() + 86400000 * 3 + 5400000), // 1.5 hours later
      location: 'Room 205',
      isOnline: false,
      isPrivate: false,
      maxAttendees: 30,
      category: 'STUDY',
      organizer: {
        id: 'organizer2',
        displayName: 'Sarah Johnson',
        avatarUrl: undefined,
      },
      attendees: [],
      status: 'UPCOMING',
    },
    {
      id: '3',
      title: 'Youth Game Night',
      description: 'Fun evening of games, pizza, and fellowship for young adults.',
      startDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
      endDate: new Date(Date.now() + 86400000 * 5 + 10800000), // 3 hours later
      location: 'Youth Center',
      isOnline: false,
      isPrivate: false,
      maxAttendees: 50,
      category: 'YOUTH',
      organizer: {
        id: 'organizer3',
        displayName: 'Michael Chen',
        avatarUrl: undefined,
      },
      attendees: [],
      status: 'UPCOMING',
    },
    {
      id: '4',
      title: 'Community Service Day',
      description: 'Serving our local community through various volunteer opportunities.',
      startDate: new Date(Date.now() + 86400000 * 7), // 1 week from now
      endDate: new Date(Date.now() + 86400000 * 7 + 21600000), // 6 hours later
      location: 'Community Center',
      isOnline: false,
      isPrivate: false,
      category: 'SERVICE',
      organizer: {
        id: 'organizer4',
        displayName: 'Emily Davis',
        avatarUrl: undefined,
      },
      attendees: [],
      status: 'UPCOMING',
    },
  ]);

  const categories = ['all', 'WORSHIP', 'STUDY', 'FELLOWSHIP', 'SERVICE', 'YOUTH', 'PRAYER'];
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'WORSHIP': return 'bg-purple-500';
      case 'STUDY': return 'bg-blue-500';
      case 'FELLOWSHIP': return 'bg-green-500';
      case 'SERVICE': return 'bg-orange-500';
      case 'YOUTH': return 'bg-pink-500';
      case 'PRAYER': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEventAction = (eventId: string, action: 'going' | 'maybe' | 'not_going') => {
    // Implementation for RSVP
    console.log('Event action:', eventId, action);
  };

  const handleCreateEvent = () => {
    // Implementation for creating new event
    setIsCreatingEvent(false);
  };

  if (selectedEvent) {
    const event = events.find(e => e.id === selectedEvent);
    if (!event) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <Button onClick={() => setSelectedEvent(null)}>
              Back to Events
            </Button>
          </div>
        </div>
      );
    }

    const isOrganizer = currentUser?.id === event.organizer.id;
    const userAttendance = event.attendees.find(a => a.userId === currentUser?.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedEvent(null)}
            className="mb-4"
          >
            ← Back to Events
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className={cn('text-white', getCategoryColor(event.category))}
                      >
                        {event.category}
                      </Badge>
                      {event.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
                      {event.isOnline && <Globe className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{event.startDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Bell className="w-4 h-4" />
                    </Button>
                    {isOrganizer && (
                      <Button variant="outline" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={event.organizer.avatarUrl} />
                        <AvatarFallback>{event.organizer.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Organized by</p>
                        <p className="text-sm text-muted-foreground">{event.organizer.displayName}</p>
                      </div>
                    </div>
                  </div>

                  {event.isOnline && event.streamUrl && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Video className="w-4 h-4" />
                        <span className="font-medium">Online Event</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        This event will be streamed live. You can join from anywhere!
                      </p>
                      <Button size="sm">
                        Join Stream
                      </Button>
                    </div>
                  )}

                  {/* RSVP Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={userAttendance?.status === 'GOING' ? 'default' : 'outline'}
                      onClick={() => handleEventAction(event.id, 'going')}
                    >
                      Going
                    </Button>
                    <Button
                      variant={userAttendance?.status === 'MAYBE' ? 'default' : 'outline'}
                      onClick={() => handleEventAction(event.id, 'maybe')}
                    >
                      Maybe
                    </Button>
                    <Button
                      variant={userAttendance?.status === 'NOT_GOING' ? 'default' : 'outline'}
                      onClick={() => handleEventAction(event.id, 'not_going')}
                    >
                      Can&apos;t Go
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Date & Time</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.startDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {event.location && (
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                )}

                {event.maxAttendees && (
                  <div>
                    <h4 className="font-medium mb-1">Capacity</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.attendees.filter(a => a.status === 'GOING').length} / {event.maxAttendees} attending
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendees ({event.attendees.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.attendees.slice(0, 5).map((attendee) => (
                    <div key={attendee.id} className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={attendee.user.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {attendee.user.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{attendee.user.displayName}</span>
                      <Badge variant="outline" className="text-xs">
                        {attendee.status.toLowerCase()}
                      </Badge>
                    </div>
                  ))}
                  
                  {event.attendees.length > 5 && (
                    <Button variant="ghost" size="sm" className="w-full">
                      View all {event.attendees.length} attendees
                    </Button>
                  )}
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
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">Discover and join fellowship events</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === 'calendar' ? 'default' : 'outline'}
              onClick={() => setCurrentView('calendar')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'outline'}
              onClick={() => setCurrentView('list')}
            >
              List
            </Button>
            <Button variant="gradient" onClick={() => setIsCreatingEvent(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
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
                    variant={selectedCategory === category ? 'default' : 'outline'}
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

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedEvent(event.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant="outline" 
                    className={cn('text-white', getCategoryColor(event.category))}
                  >
                    {event.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {event.isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
                    {event.isOnline && <Globe className="w-3 h-3 text-muted-foreground" />}
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={event.organizer.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {event.organizer.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{event.organizer.displayName}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees.filter(a => a.status === 'GOING').length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search or filters' : 'No events are currently scheduled'}
            </p>
            <Button onClick={() => setIsCreatingEvent(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create the first event
            </Button>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {isCreatingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Event Title</label>
                  <Input placeholder="Enter event title" />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full p-2 border rounded">
                    <option value="WORSHIP">Worship</option>
                    <option value="STUDY">Bible Study</option>
                    <option value="FELLOWSHIP">Fellowship</option>
                    <option value="SERVICE">Service</option>
                    <option value="YOUTH">Youth</option>
                    <option value="PRAYER">Prayer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Describe your event" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date & Time</label>
                  <Input type="datetime-local" />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date & Time</label>
                  <Input type="datetime-local" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <Input placeholder="Event location" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="isOnline" className="rounded" />
                  <label htmlFor="isOnline" className="text-sm">Online event</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="isPrivate" className="rounded" />
                  <label htmlFor="isPrivate" className="text-sm">Private event</label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Max Attendees (optional)</label>
                <Input type="number" placeholder="Leave empty for unlimited" />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingEvent(false)}
                >
                  Cancel
                </Button>
                <Button variant="gradient" onClick={handleCreateEvent}>
                  Create Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
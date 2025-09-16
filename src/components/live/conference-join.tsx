'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Users, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ConferenceJoinProps {
  onJoinConference: (roomId: string, userInfo: { name: string; email: string }) => void;
}

export function ConferenceJoin({ onJoinConference }: ConferenceJoinProps) {
  const router = useRouter();
  const [joinMode, setJoinMode] = useState<'join' | 'create'>('create');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roomId: '',
    conferenceTitle: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const roomId = joinMode === 'create' ? generateRoomId() : formData.roomId;
      
      // Validate required fields
      if (!formData.name || !formData.email || !roomId) {
        throw new Error('Please fill in all required fields');
      }

      // Join the conference
      onJoinConference(roomId, {
        name: formData.name,
        email: formData.email,
      });

    } catch (error) {
      console.error('Error joining conference:', error);
      alert(error instanceof Error ? error.message : 'Failed to join conference');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TFN Video Conference</h1>
          <p className="text-gray-600 mt-2">Connect with your community</p>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setJoinMode('create')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              joinMode === 'create'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create Meeting
          </button>
          <button
            onClick={() => setJoinMode('join')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              joinMode === 'join'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Join Meeting
          </button>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {joinMode === 'create' ? 'Create New Conference' : 'Join Conference'}
            </CardTitle>
            <CardDescription>
              {joinMode === 'create' 
                ? 'Start a new video conference and invite others'
                : 'Enter the conference ID to join an existing meeting'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* User Information */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Conference Details */}
              {joinMode === 'create' ? (
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Conference Title (Optional)
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Sunday Service Discussion"
                    value={formData.conferenceTitle}
                    onChange={(e) => handleInputChange('conferenceTitle', e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                    Conference ID *
                  </label>
                  <Input
                    id="roomId"
                    type="text"
                    placeholder="Enter conference ID"
                    value={formData.roomId}
                    onChange={(e) => handleInputChange('roomId', e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {joinMode === 'create' ? 'Creating...' : 'Joining...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {joinMode === 'create' ? (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Conference
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        Join Conference
                      </>
                    )}
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Quick Actions</p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/events')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Scheduled Events
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/live')}
            >
              <Video className="w-4 h-4 mr-2" />
              Live Streams
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
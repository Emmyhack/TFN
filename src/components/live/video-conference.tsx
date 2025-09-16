'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Monitor, 
  MonitorOff,
  Users,
  Settings,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoParticipant } from './video-participant';
import { useVideoConferenceStore } from '@/lib/stores/video-conference-store';
import { ChatPanel } from '@/components/chat/chat-panel';

interface VideoConferenceProps {
  roomId: string;
  userInfo: {
    name: string;
    email: string;
  };
}

export function VideoConference({ roomId, userInfo }: VideoConferenceProps) {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    socket,
    isConnected,
    currentUser,
    participants,
    localStream,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    isInConference,
    initializeSocket,
    joinRoom,
    leaveRoom,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  } = useVideoConferenceStore();

  // Initialize socket connection on mount
  useEffect(() => {
    if (!socket) {
      initializeSocket();
    }
  }, [socket, initializeSocket]);

  // Join room when connected
  useEffect(() => {
    if (isConnected && socket && !isInConference) {
      joinRoom(roomId, userInfo);
    }
  }, [isConnected, socket, isInConference, roomId, userInfo, joinRoom]);

  // Handle leave conference
  const handleLeaveConference = useCallback(() => {
    leaveRoom();
    router.push('/live');
  }, [leaveRoom, router]);

  // Handle screen share toggle
  const handleScreenShareToggle = useCallback(async () => {
    try {
      if (isScreenSharing) {
        stopScreenShare();
      } else {
        await startScreenShare();
      }
    } catch (error) {
      console.error('Screen share error:', error);
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare]);

  // Calculate grid layout based on participant count
  const getGridClass = () => {
    const totalParticipants = participants.length + (currentUser ? 1 : 0);
    
    if (totalParticipants === 1) return 'video-grid-1';
    if (totalParticipants === 2) return 'video-grid-2';
    if (totalParticipants <= 4) return 'video-grid-4';
    return 'video-grid-many';
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Connecting to conference...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold">Conference Room: {roomId}</h1>
          <div className="stream-status live">
            LIVE
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-white">
          <Users className="w-4 h-4" />
          <span>{participants.length + 1} participants</span>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 flex">
        {/* Video grid */}
        <div className="flex-1 relative">
          <div className={`video-grid ${getGridClass()} h-full`}>
            {/* Local user video */}
            {currentUser && (
              <VideoParticipant
                participant={{
                  ...currentUser,
                  stream: localStream || undefined,
                  isMuted: isAudioMuted,
                  isVideoOff: isVideoOff,
                }}
                isLocal={true}
              />
            )}
            
            {/* Remote participants */}
            {participants.map((participant) => (
              <VideoParticipant
                key={participant.id}
                participant={participant}
              />
            ))}
          </div>

          {/* Video controls overlay */}
          <div className="video-controls">
            {/* Audio toggle */}
            <Button
              onClick={toggleAudio}
              className={`video-control-btn ${isAudioMuted ? 'active' : ''}`}
              size="sm"
            >
              {isAudioMuted ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </Button>

            {/* Video toggle */}
            <Button
              onClick={toggleVideo}
              className={`video-control-btn ${isVideoOff ? 'active' : ''}`}
              size="sm"
            >
              {isVideoOff ? (
                <VideoOff className="w-5 h-5 text-white" />
              ) : (
                <Video className="w-5 h-5 text-white" />
              )}
            </Button>

            {/* Screen share toggle */}
            <Button
              onClick={handleScreenShareToggle}
              className={`video-control-btn ${isScreenSharing ? 'active' : ''}`}
              size="sm"
            >
              {isScreenSharing ? (
                <MonitorOff className="w-5 h-5 text-white" />
              ) : (
                <Monitor className="w-5 h-5 text-white" />
              )}
            </Button>

            {/* Chat toggle */}
            <Button
              onClick={() => setShowChat(!showChat)}
              className="video-control-btn"
              size="sm"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </Button>

            {/* Settings */}
            <Button
              onClick={() => setShowSettings(!showSettings)}
              className="video-control-btn"
              size="sm"
            >
              <Settings className="w-5 h-5 text-white" />
            </Button>

            {/* Leave call */}
            <Button
              onClick={handleLeaveConference}
              className="video-control-btn bg-red-500 hover:bg-red-600"
              size="sm"
            >
              <Phone className="w-5 h-5 text-white rotate-135" />
            </Button>
          </div>
        </div>

        {/* Chat sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            <ChatPanel />
          </div>
        )}
      </div>

      {/* Settings modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Conference Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camera
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Default Camera</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Microphone
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Default Microphone</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Default Speaker</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => setShowSettings(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={() => setShowSettings(false)}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Settings,
  Share,
  MessageCircle
} from 'lucide-react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  peer?: Peer.Instance;
  audio: boolean;
  video: boolean;
}

interface VideoCallProps {
  roomId: string;
  userId: string;
  userName: string;
  isHost?: boolean;
}

export default function VideoCall({ roomId, userId, userName, isHost = false }: VideoCallProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const peersRef = useRef<any[]>([]);

  // Initialize media stream
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Failed to access camera/microphone:', error);
      throw error;
    }
  }, []);

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

    socketRef.current.emit('join-room', {
      roomId,
      userId,
      userName,
      isHost
    });

    socketRef.current.on('user-joined', ({ userId: newUserId, userName: newUserName, signal }: any) => {
      // Create peer for new user
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: localStream!
      });

      peer.on('signal', (data) => {
        socketRef.current.emit('signal', {
          userId: newUserId,
          signal: data
        });
      });

      peer.on('stream', (stream) => {
        setParticipants(prev => prev.map(p => 
          p.id === newUserId ? { ...p, stream } : p
        ));
      });

      peersRef.current.push({
        userId: newUserId,
        peer
      });

      setParticipants(prev => [...prev, {
        id: newUserId,
        name: newUserName,
        audio: true,
        video: true
      }]);
    });

    socketRef.current.on('signal', ({ userId: fromUserId, signal }: any) => {
      const peerObj = peersRef.current.find(p => p.userId === fromUserId);
      if (peerObj) {
        peerObj.peer.signal(signal);
      } else {
        // Create peer for existing user
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: localStream!
        });

        peer.on('signal', (data) => {
          socketRef.current.emit('signal', {
            userId: fromUserId,
            signal: data
          });
        });

        peer.on('stream', (stream) => {
          setParticipants(prev => prev.map(p => 
            p.id === fromUserId ? { ...p, stream } : p
          ));
        });

        peer.signal(signal);

        peersRef.current.push({
          userId: fromUserId,
          peer
        });
      }
    });

    socketRef.current.on('user-left', ({ userId: leftUserId }: any) => {
      const peerObj = peersRef.current.find(p => p.userId === leftUserId);
      if (peerObj) {
        peerObj.peer.destroy();
        peersRef.current = peersRef.current.filter(p => p.userId !== leftUserId);
      }

      setParticipants(prev => prev.filter(p => p.id !== leftUserId));
    });

    socketRef.current.on('media-state-changed', ({ userId: changedUserId, audio, video }: any) => {
      setParticipants(prev => prev.map(p => 
        p.id === changedUserId ? { ...p, audio, video } : p
      ));
    });

  }, [roomId, userId, userName, isHost, localStream]);

  // Join call
  const joinCall = async () => {
    try {
      setIsConnecting(true);
      const stream = await initializeMedia();
      initializeSocket();
      setIsCallActive(true);
    } catch (error) {
      console.error('Failed to join call:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Leave call
  const leaveCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    peersRef.current.forEach(({ peer }) => peer.destroy());
    peersRef.current = [];

    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId, userId });
      socketRef.current.disconnect();
    }

    setParticipants([]);
    setIsCallActive(false);
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        socketRef.current?.emit('media-state-change', {
          roomId,
          audio: audioTrack.enabled,
          video: isVideoEnabled
        });
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        socketRef.current?.emit('media-state-change', {
          roomId,
          video: videoTrack.enabled,
          audio: isAudioEnabled
        });
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveCall();
    };
  }, []);

  // Participant video component
  const ParticipantVideo = ({ participant }: { participant: Participant }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current && participant.stream) {
        videoRef.current.srcObject = participant.stream;
      }
    }, [participant.stream]);

    return (
      <Card className="relative overflow-hidden bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={false}
          className="w-full h-full object-cover"
        />
        
        {!participant.video && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-semibold">
              {participant.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-2 flex gap-1">
          <Badge variant={participant.audio ? "default" : "destructive"} className="text-xs">
            {participant.audio ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
          </Badge>
          <Badge variant={participant.video ? "default" : "destructive"} className="text-xs">
            {participant.video ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
          </Badge>
        </div>

        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {participant.name}
          </Badge>
        </div>
      </Card>
    );
  };

  if (!isCallActive) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="w-10 h-10 text-primary" />
          </div>
          
          <h3 className="text-xl font-semibold">Join Video Call</h3>
          <p className="text-muted-foreground">
            Ready to join the video conference? Make sure your camera and microphone are working.
          </p>

          <div className="flex justify-center gap-2">
            <Button 
              onClick={joinCall} 
              disabled={isConnecting}
              className="px-8"
            >
              {isConnecting ? "Connecting..." : "Join Call"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Local video */}
        <Card className="relative overflow-hidden bg-gray-900">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          <div className="absolute bottom-2 left-2 flex gap-1">
            <Badge variant={isAudioEnabled ? "default" : "destructive"} className="text-xs">
              {isAudioEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
            </Badge>
            <Badge variant={isVideoEnabled ? "default" : "destructive"} className="text-xs">
              {isVideoEnabled ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
            </Badge>
          </div>

          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="text-xs">
              You {isHost && "(Host)"}
            </Badge>
          </div>
        </Card>

        {/* Participant videos */}
        {participants.map(participant => (
          <ParticipantVideo key={participant.id} participant={participant} />
        ))}
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">
              {participants.length + 1} participant{participants.length === 0 ? '' : 's'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>

            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>

            <Button variant="outline" size="sm">
              <Share className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={leaveCall}
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
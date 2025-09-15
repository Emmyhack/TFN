'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, MicOff, Video, VideoOff, Phone, PhoneOff, AlertCircle } from 'lucide-react';

interface WebRTCManagerProps {
  sessionId: string;
  isHost?: boolean;
}

export function WebRTCManager({ sessionId, isHost = false }: WebRTCManagerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    localStream,
    remoteStreams,
    isStreaming,
    setLocalStream,
    setIsStreaming,
    addRemoteStream,
    removeRemoteStream,
  } = useAppStore();

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [error, setError] = useState<string | null>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);

  // WebRTC configuration
  const rtcConfig = useRef({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  });

  // Initialize media stream
  const initializeMedia = useCallback(async () => {
    try {
      setError(null);
      const constraints = {
        video: isVideoEnabled ? { width: 1280, height: 720 } : false,
        audio: isAudioEnabled,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera/microphone';
      setError(errorMessage);
      console.error('Error accessing media devices:', err);
      return null;
    }
  }, [isVideoEnabled, isAudioEnabled, setLocalStream]);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    try {
      const pc = new RTCPeerConnection(rtcConfig.current);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // In a real implementation, send this candidate to the remote peer via signaling server
          console.log('ICE candidate:', event.candidate);
        }
      };

      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        addRemoteStream('remote-stream', remoteStream);
      };

      pc.onconnectionstatechange = () => {
        setConnectionState(pc.connectionState as any);
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setError('Connection lost. Please try reconnecting.');
        }
      };

      peerConnection.current = pc;
      return pc;
    } catch (err) {
      setError('Failed to create peer connection');
      console.error('Error creating peer connection:', err);
      return null;
    }
  }, [addRemoteStream]);

  // Start streaming
  const startStreaming = useCallback(async () => {
    try {
      setError(null);
      setConnectionState('connecting');

      const stream = await initializeMedia();
      if (!stream) {
        setConnectionState('disconnected');
        return;
      }

      const pc = createPeerConnection();
      if (!pc) {
        setConnectionState('disconnected');
        return;
      }

      // Add local stream tracks to peer connection
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      setIsStreaming(true);
      setConnectionState('connected');

      // In a real implementation, you would:
      // 1. Create an offer (for host) or wait for offer (for viewer)
      // 2. Exchange SDP via signaling server
      // 3. Exchange ICE candidates
      
    } catch (err) {
      setError('Failed to start streaming');
      setConnectionState('disconnected');
      console.error('Error starting stream:', err);
    }
  }, [initializeMedia, createPeerConnection, setIsStreaming]);

  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setIsStreaming(false);
    setConnectionState('disconnected');
  }, [localStream, setLocalStream, setIsStreaming]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    } else {
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [localStream, isVideoEnabled]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    } else {
      setIsAudioEnabled(!isAudioEnabled);
    }
  }, [localStream, isAudioEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, [stopStreaming]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{isHost ? 'Host Controls' : 'Stream Viewer'}</span>
          <Badge variant={connectionState === 'connected' ? 'default' : 'secondary'}>
            {connectionState}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Video Preview */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          {!localStream && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>{isStreaming ? 'Camera disabled' : 'Camera not started'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isAudioEnabled ? 'outline' : 'destructive'}
            size="icon"
            onClick={toggleAudio}
            disabled={connectionState === 'connecting'}
          >
            {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>

          <Button
            variant={isVideoEnabled ? 'outline' : 'destructive'}
            size="icon"
            onClick={toggleVideo}
            disabled={connectionState === 'connecting'}
          >
            {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>

          {isHost && (
            <Button
              variant={isStreaming ? 'destructive' : 'default'}
              onClick={isStreaming ? stopStreaming : startStreaming}
              disabled={connectionState === 'connecting'}
              className="px-6"
            >
              {isStreaming ? (
                <>
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Stream
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Start Stream
                </>
              )}
            </Button>
          )}
        </div>

        {/* Stream Info */}
        {isStreaming && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Stream ID: {sessionId}</p>
            <p>Quality: {isVideoEnabled ? '720p' : 'Audio Only'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook for WebRTC functionality
export function useWebRTC(sessionId: string, isHost: boolean = false) {
  const { localStream, remoteStreams, isStreaming } = useAppStore();
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const initializeWebRTC = useCallback(async () => {
    // This would be implemented with a signaling server
    // For now, we'll just simulate the connection
    setConnectionState('connecting');
    
    setTimeout(() => {
      setConnectionState('connected');
    }, 2000);
  }, []);

  return {
    localStream,
    remoteStreams,
    isStreaming,
    connectionState,
    initializeWebRTC,
  };
}
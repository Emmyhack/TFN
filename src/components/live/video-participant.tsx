'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Volume2 } from 'lucide-react';
import { Participant } from '@/lib/stores/video-conference-store';

interface VideoParticipantProps {
  participant: Participant;
  isLocal?: boolean;
  className?: string;
}

export function VideoParticipant({ participant, isLocal = false, className = '' }: VideoParticipantProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
      setIsLoading(false);
      setHasError(false);
    }
  }, [participant.stream]);

  const handleVideoError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div className={`video-participant ${participant.isSpeaking ? 'speaking' : ''} ${className}`}>
      {/* Video Element */}
      {participant.stream && !participant.isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Mute local video to prevent echo
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Avatar placeholder when video is off */
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {participant.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20">
          <div className="text-white text-center">
            <VideoOff className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Video unavailable</p>
          </div>
        </div>
      )}

      {/* Participant info overlay */}
      <div className="participant-name">
        {participant.name} {isLocal && '(You)'}
      </div>

      {/* Audio/Video status indicators */}
      <div className="absolute top-2 right-2 flex gap-1">
        {participant.isMuted && (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
        {participant.isVideoOff && (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <VideoOff className="w-3 h-3 text-white" />
          </div>
        )}
        {participant.isSpeaking && !participant.isMuted && (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
            <Volume2 className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Host indicator */}
      {participant.isHost && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded">
          Host
        </div>
      )}

      {/* Connection status */}
      {!participant.stream && !isLoading && (
        <div className="stream-status">
          Connecting...
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VideoConference } from '@/components/live/video-conference';
import { ConferenceJoin } from '@/components/live/conference-join';
import { useSession } from 'next-auth/react';

export default function StreamPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isJoined, setIsJoined] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  
  const streamId = params.streamId as string;

  // If user is already authenticated, use their info
  useEffect(() => {
    if (session?.user) {
      setUserInfo({
        name: session.user.displayName || 'Anonymous',
        email: session.user.email || '',
      });
    }
  }, [session]);

  const handleJoinConference = (roomId: string, userDetails: { name: string; email: string }) => {
    setUserInfo(userDetails);
    setIsJoined(true);
  };

  // If already have user info and stream ID, join directly
  useEffect(() => {
    if (userInfo && streamId && !isJoined) {
      setIsJoined(true);
    }
  }, [userInfo, streamId, isJoined]);

  if (!isJoined || !userInfo) {
    return (
      <ConferenceJoin 
        onJoinConference={(roomId, userDetails) => handleJoinConference(streamId, userDetails)}
      />
    );
  }

  return (
    <VideoConference 
      roomId={streamId}
      userInfo={userInfo}
    />
  );
}
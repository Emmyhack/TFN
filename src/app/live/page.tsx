'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Force dynamic rendering to avoid pre-render issues with NextAuth
export const dynamic = 'force-dynamic';

export default function LivePage() {
  const session = useSession();
  const router = useRouter();

  const handleStartStream = () => {
    if (!session.data) {
      router.push('/auth/signin');
      return;
    }
    
    // Generate a unique room ID
    const roomId = Math.random().toString(36).substring(2, 10);
    router.push(`/live/${roomId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Live Streams</h1>
            <p className="text-muted-foreground">Connect with others through live video</p>
          </div>
          <Button onClick={handleStartStream}>
            Start Stream
          </Button>
        </div>
      </div>
    </div>
  );
}
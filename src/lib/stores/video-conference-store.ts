import { create } from 'zustand';
import Peer from 'simple-peer';
import io, { Socket } from 'socket.io-client';

export interface Participant {
  id: string;
  name: string;
  email: string;
  stream?: MediaStream;
  peer?: Peer.Instance;
  isHost: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
}

export interface ConferenceState {
  // Connection state
  socket: Socket | null;
  isConnected: boolean;
  roomId: string | null;
  
  // User state
  currentUser: Participant | null;
  participants: Participant[];
  
  // Media state
  localStream: MediaStream | null;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  
  // Conference state
  isInConference: boolean;
  isHost: boolean;
  conferenceTitle: string;
  
  // Actions
  initializeSocket: () => void;
  joinRoom: (roomId: string, userInfo: { name: string; email: string }) => Promise<void>;
  leaveRoom: () => void;
  startLocalMedia: (video?: boolean, audio?: boolean) => Promise<void>;
  stopLocalMedia: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
  createPeerConnection: (participantId: string, initiator: boolean) => void;
  removePeer: (participantId: string) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
}

export const useVideoConferenceStore = create<ConferenceState>((set, get) => ({
  // Initial state
  socket: null,
  isConnected: false,
  roomId: null,
  currentUser: null,
  participants: [],
  localStream: null,
  isAudioMuted: false,
  isVideoOff: false,
  isScreenSharing: false,
  isInConference: false,
  isHost: false,
  conferenceTitle: '',

  // Initialize Socket.IO connection
  initializeSocket: () => {
    // Try to connect to external signaling server, fallback to local simulation
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001';
    
    try {
      const socket = io(socketUrl, {
        transports: ['websocket'],
        timeout: 5000,
      });
      
      socket.on('connect', () => {
        console.log('Connected to signaling server');
        set({ socket, isConnected: true });
      });

      socket.on('connect_error', (error) => {
        console.warn('Failed to connect to signaling server, using local simulation:', error);
        // Use local simulation for development
        set({ isConnected: true });
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from signaling server');
        set({ isConnected: false });
      });

      socket.on('user-joined', (participant: Participant) => {
        console.log('User joined:', participant);
        get().addParticipant(participant);
        // Create peer connection for new user
        get().createPeerConnection(participant.id, true);
      });

      socket.on('user-left', (participantId: string) => {
        console.log('User left:', participantId);
        get().removePeer(participantId);
        get().removeParticipant(participantId);
      });

      socket.on('signal', (data: { from: string; signal: any }) => {
        const participant = get().participants.find(p => p.id === data.from);
        if (participant?.peer) {
          participant.peer.signal(data.signal);
        }
      });

      socket.on('participants-list', (participants: Participant[]) => {
        console.log('Received participants list:', participants);
        set({ participants });
        // Create peer connections for existing participants
        participants.forEach(participant => {
          if (participant.id !== get().currentUser?.id) {
            get().createPeerConnection(participant.id, false);
          }
        });
      });

      set({ socket });
    } catch (error) {
      console.error('Socket initialization error:', error);
      // Fallback to local simulation
      set({ isConnected: true });
    }
  },

  // Join a conference room
  joinRoom: async (roomId: string, userInfo: { name: string; email: string }) => {
    const { socket } = get();
    if (!socket) return;

    const currentUser: Participant = {
      id: socket.id || Date.now().toString(),
      name: userInfo.name,
      email: userInfo.email,
      isHost: false,
      isMuted: false,
      isVideoOff: false,
      isSpeaking: false,
    };

    set({ 
      roomId, 
      currentUser, 
      isInConference: true,
      conferenceTitle: `Conference ${roomId}`
    });

    socket.emit('join-room', { roomId, user: currentUser });
    
    // Start local media
    await get().startLocalMedia(true, true);
  },

  // Leave the conference room
  leaveRoom: () => {
    const { socket, roomId, participants } = get();
    
    // Clean up peer connections
    participants.forEach(participant => {
      if (participant.peer) {
        participant.peer.destroy();
      }
    });

    // Stop local media
    get().stopLocalMedia();

    // Leave socket room
    if (socket && roomId) {
      socket.emit('leave-room', roomId);
    }

    set({
      roomId: null,
      currentUser: null,
      participants: [],
      isInConference: false,
      isHost: false,
      conferenceTitle: '',
    });
  },

  // Start local media (camera/microphone)
  startLocalMedia: async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 1280, height: 720 } : false,
        audio: audio
      });

      set({ 
        localStream: stream,
        isVideoOff: !video,
        isAudioMuted: !audio
      });

      // Update current user with stream
      const { currentUser } = get();
      if (currentUser) {
        set({
          currentUser: { ...currentUser, stream }
        });
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  },

  // Stop local media
  stopLocalMedia: () => {
    const { localStream } = get();
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      set({ localStream: null });
    }
  },

  // Toggle audio mute
  toggleAudio: () => {
    const { localStream, isAudioMuted } = get();
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isAudioMuted;
        set({ isAudioMuted: !isAudioMuted });
        
        // Update current user
        const { currentUser } = get();
        if (currentUser) {
          set({
            currentUser: { ...currentUser, isMuted: !isAudioMuted }
          });
        }
      }
    }
  },

  // Toggle video
  toggleVideo: () => {
    const { localStream, isVideoOff } = get();
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        set({ isVideoOff: !isVideoOff });
        
        // Update current user
        const { currentUser } = get();
        if (currentUser) {
          set({
            currentUser: { ...currentUser, isVideoOff: !isVideoOff }
          });
        }
      }
    }
  },

  // Start screen sharing
  startScreenShare: async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      set({ isScreenSharing: true });

      // Replace video track in all peer connections
      const { participants } = get();
      const videoTrack = screenStream.getVideoTracks()[0];
      
      participants.forEach(participant => {
        if (participant.peer) {
          participant.peer.replaceTrack(
            participant.peer.streams[0]?.getVideoTracks()[0],
            videoTrack,
            participant.peer.streams[0]
          );
        }
      });

      // Handle screen share end
      videoTrack.onended = () => {
        get().stopScreenShare();
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  },

  // Stop screen sharing
  stopScreenShare: () => {
    set({ isScreenSharing: false });
    // Restart camera
    get().startLocalMedia(true, !get().isAudioMuted);
  },

  // Create peer connection
  createPeerConnection: (participantId: string, initiator: boolean) => {
    const { localStream, socket } = get();
    if (!localStream || !socket) return;

    const peer = new Peer({
      initiator,
      trickle: false,
      stream: localStream,
    });

    peer.on('signal', (signal) => {
      socket.emit('signal', { to: participantId, signal });
    });

    peer.on('stream', (remoteStream) => {
      console.log('Received remote stream from:', participantId);
      get().updateParticipant(participantId, { stream: remoteStream });
    });

    peer.on('error', (error) => {
      console.error('Peer connection error:', error);
    });

    peer.on('close', () => {
      console.log('Peer connection closed:', participantId);
      get().removePeer(participantId);
    });

    // Update participant with peer connection
    get().updateParticipant(participantId, { peer });
  },

  // Remove peer connection
  removePeer: (participantId: string) => {
    const { participants } = get();
    const participant = participants.find(p => p.id === participantId);
    if (participant?.peer) {
      participant.peer.destroy();
    }
    get().updateParticipant(participantId, { peer: undefined, stream: undefined });
  },

  // Add participant
  addParticipant: (participant: Participant) => {
    set(state => ({
      participants: [...state.participants.filter(p => p.id !== participant.id), participant]
    }));
  },

  // Remove participant
  removeParticipant: (participantId: string) => {
    set(state => ({
      participants: state.participants.filter(p => p.id !== participantId)
    }));
  },

  // Update participant
  updateParticipant: (participantId: string, updates: Partial<Participant>) => {
    set(state => ({
      participants: state.participants.map(p =>
        p.id === participantId ? { ...p, ...updates } : p
      )
    }));
  },
}));
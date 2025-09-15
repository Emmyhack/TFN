import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  displayName: string;
  handle: string;
  email: string;
  avatarUrl?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'OWNER';
  isVerified?: boolean;
  isOnline: boolean;
}

interface LiveSession {
  id: string;
  hostId: string;
  title: string;
  description?: string;
  mode: 'AUDIO' | 'VIDEO';
  state: 'SCHEDULED' | 'LIVE' | 'ENDED';
  isRecorded: boolean;
  startedAt?: Date;
  startTime?: Date;
  endedAt?: Date;
  viewerCount: number;
  host: User;
  category?: string;
}

interface LiveComment {
  id: string;
  sessionId: string;
  userId: string;
  body?: string;
  reaction?: string;
  timestampMs?: number;
  createdAt: Date;
  user: User;
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  createdAt: Date;
  editedAt?: Date;
  user: User;
  attachments?: {
    id: string;
    url: string;
    type: 'image' | 'file';
    name: string;
  }[];
  reactions?: {
    emoji: string;
    users: string[];
  }[];
}

interface AppState {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Live session state
  activeSessions: LiveSession[];
  liveSessions: LiveSession[];
  currentSession: LiveSession | null;
  sessionComments: LiveComment[];
  setActiveSessions: (sessions: LiveSession[]) => void;
  addLiveSession: (session: LiveSession) => void;
  setCurrentSession: (session: LiveSession | null) => void;
  addComment: (comment: LiveComment) => void;
  updateViewerCount: (sessionId: string, count: number) => void;

  // Chat/messaging state
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // WebRTC state
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isStreaming: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  setLocalStream: (stream: MediaStream | null) => void;
  addRemoteStream: (peerId: string, stream: MediaStream) => void;
  removeRemoteStream: (peerId: string) => void;
  setStreaming: (streaming: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setMuted: (muted: boolean) => void;
  setVideoEnabled: (enabled: boolean) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: Date;
  read: boolean;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // User state
      currentUser: {
        id: 'current-user',
        displayName: 'John Doe',
        handle: '@johndoe',
        email: 'john@example.com',
        role: 'USER',
        isVerified: true,
        isOnline: true,
        avatarUrl: undefined,
      },
      setCurrentUser: (user) => set({ currentUser: user }),

      // Live session state
      activeSessions: [],
      liveSessions: [],
      currentSession: null,
      sessionComments: [],
      setActiveSessions: (sessions) => set({ activeSessions: sessions }),
      addLiveSession: (session) => set((state) => ({
        liveSessions: [...state.liveSessions, session]
      })),
      setCurrentSession: (session) => set({ 
        currentSession: session,
        sessionComments: session ? [] : get().sessionComments 
      }),
      addComment: (comment) => set((state) => ({
        sessionComments: [...state.sessionComments, comment]
      })),
      updateViewerCount: (sessionId, count) => set((state) => ({
        activeSessions: state.activeSessions.map(session =>
          session.id === sessionId ? { ...session, viewerCount: count } : session
        ),
        currentSession: state.currentSession?.id === sessionId 
          ? { ...state.currentSession, viewerCount: count }
          : state.currentSession
      })),

      // Chat/messaging state
      messages: [],
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),

      // WebRTC state
      localStream: null,
      remoteStreams: new Map(),
      isStreaming: false,
      isMuted: false,
      isVideoEnabled: true,
      setLocalStream: (stream) => set({ localStream: stream }),
      addRemoteStream: (peerId, stream) => set((state) => {
        const newStreams = new Map(state.remoteStreams);
        newStreams.set(peerId, stream);
        return { remoteStreams: newStreams };
      }),
      removeRemoteStream: (peerId) => set((state) => {
        const newStreams = new Map(state.remoteStreams);
        newStreams.delete(peerId);
        return { remoteStreams: newStreams };
      }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      setIsStreaming: (streaming) => set({ isStreaming: streaming }),
      setMuted: (muted) => set({ isMuted: muted }),
      setVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),
    }),
    {
      name: 'tfn-store',
    }
  )
);
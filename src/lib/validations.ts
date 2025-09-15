import { z } from 'zod';

// User schemas
export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(50),
  handle: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
});

export const userUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  churchAffiliation: z.string().max(100).optional(),
  links: z.record(z.string(), z.string().url()).optional(),
});

// Auth schemas
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(50),
  handle: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
});

// Live session schemas
export const liveSessionCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  mode: z.enum(['AUDIO', 'VIDEO']),
  isRecorded: z.boolean().optional().default(false),
});

export const liveCommentSchema = z.object({
  sessionId: z.string(),
  body: z.string().max(500).optional(),
  reaction: z.string().optional(),
  timestampMs: z.number().optional(),
});

// Group schemas
export const groupCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().optional().default(true),
  coverUrl: z.string().url().optional(),
});

export const channelCreateSchema = z.object({
  groupId: z.string(),
  name: z.string().min(1).max(50),
  kind: z.enum(['chat', 'topic']),
  isPrivate: z.boolean().optional().default(false),
});

// Message schemas
export const messageCreateSchema = z.object({
  channelId: z.string(),
  body: z.string().min(1).max(2000),
  attachments: z.array(z.object({
    type: z.string(),
    url: z.string().url(),
    name: z.string(),
    size: z.number(),
  })).optional(),
});

export const dmMessageCreateSchema = z.object({
  dmId: z.string(),
  body: z.string().min(1).max(2000),
  attachments: z.array(z.object({
    type: z.string(),
    url: z.string().url(),
    name: z.string(),
    size: z.number(),
  })).optional(),
});

// Event schemas
export const eventCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  location: z.string().max(200).optional(),
  isLive: z.boolean().optional().default(false),
  heroUrl: z.string().url().optional(),
});

// Status schemas
export const statusCreateSchema = z.object({
  type: z.enum(['status', 'live']),
  text: z.string().max(500).optional(),
  mediaUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
});

// Report schemas
export const reportCreateSchema = z.object({
  targetType: z.enum(['user', 'message', 'session', 'group']),
  targetId: z.string(),
  reason: z.string().min(1).max(100),
  notes: z.string().max(1000).optional(),
});

// Notification schemas
export const notificationPreferencesSchema = z.object({
  follow: z.boolean().default(true),
  mention: z.boolean().default(true),
  liveStart: z.boolean().default(true),
  eventReminder: z.boolean().default(true),
  dmMessage: z.boolean().default(true),
  groupInvite: z.boolean().default(true),
  missedCall: z.boolean().default(true),
  email: z.boolean().default(true),
  push: z.boolean().default(true),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type LiveSessionCreate = z.infer<typeof liveSessionCreateSchema>;
export type LiveComment = z.infer<typeof liveCommentSchema>;
export type GroupCreate = z.infer<typeof groupCreateSchema>;
export type ChannelCreate = z.infer<typeof channelCreateSchema>;
export type MessageCreate = z.infer<typeof messageCreateSchema>;
export type DmMessageCreate = z.infer<typeof dmMessageCreateSchema>;
export type EventCreate = z.infer<typeof eventCreateSchema>;
export type StatusCreate = z.infer<typeof statusCreateSchema>;
export type ReportCreate = z.infer<typeof reportCreateSchema>;
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;
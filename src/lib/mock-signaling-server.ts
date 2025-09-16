// This is a mock signaling server for development
// In production, you would run this as a separate Node.js server

interface Message {
  type: string;
  data: any;
  from?: string;
  to?: string;
}

interface Room {
  id: string;
  participants: Map<string, any>;
}

class MockSignalingServer {
  private rooms = new Map<string, Room>();
  private connections = new Map<string, WebSocket>();

  constructor() {
    // This would be a real WebSocket server in production
    console.log('Mock signaling server initialized');
  }

  handleConnection(ws: WebSocket, userId: string) {
    this.connections.set(userId, ws);

    ws.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        this.handleMessage(message, userId);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onclose = () => {
      this.handleDisconnection(userId);
    };
  }

  private handleMessage(message: Message, userId: string) {
    switch (message.type) {
      case 'join-room':
        this.handleJoinRoom(message.data, userId);
        break;
      case 'leave-room':
        this.handleLeaveRoom(message.data.roomId, userId);
        break;
      case 'signal':
        this.handleSignal(message.data, userId);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private handleJoinRoom(data: { roomId: string; user: any }, userId: string) {
    const { roomId, user } = data;
    
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        participants: new Map(),
      });
    }

    const room = this.rooms.get(roomId)!;
    room.participants.set(userId, user);

    // Send current participants to new user
    const participantsList = Array.from(room.participants.values());
    this.sendToUser(userId, {
      type: 'participants-list',
      data: participantsList.filter(p => p.id !== userId),
    });

    // Notify other participants about new user
    this.broadcastToRoom(roomId, {
      type: 'user-joined',
      data: user,
    }, userId);

    console.log(`User ${userId} joined room ${roomId}`);
  }

  private handleLeaveRoom(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants.delete(userId);
      
      // Notify other participants
      this.broadcastToRoom(roomId, {
        type: 'user-left',
        data: userId,
      }, userId);

      // Clean up empty rooms
      if (room.participants.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    console.log(`User ${userId} left room ${roomId}`);
  }

  private handleSignal(data: { to: string; signal: any }, userId: string) {
    this.sendToUser(data.to, {
      type: 'signal',
      data: {
        from: userId,
        signal: data.signal,
      },
    });
  }

  private handleDisconnection(userId: string) {
    // Remove user from all rooms
    this.rooms.forEach((room, roomId) => {
      if (room.participants.has(userId)) {
        this.handleLeaveRoom(roomId, userId);
      }
    });

    this.connections.delete(userId);
    console.log(`User ${userId} disconnected`);
  }

  private sendToUser(userId: string, message: any) {
    const connection = this.connections.get(userId);
    if (connection && connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(message));
    }
  }

  private broadcastToRoom(roomId: string, message: any, excludeUserId?: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants.forEach((participant, userId) => {
        if (userId !== excludeUserId) {
          this.sendToUser(userId, message);
        }
      });
    }
  }
}

// Export for development use
export const mockSignalingServer = new MockSignalingServer();
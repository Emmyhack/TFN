import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.liveComment.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.dmMessage.deleteMany();
  await prisma.dmParticipant.deleteMany();
  await prisma.dm.deleteMany();
  await prisma.message.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.event.deleteMany();
  await prisma.status.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@tfn.community',
        handle: 'admin',
        displayName: 'TFN Admin',
        role: 'ADMIN',
        bio: 'Platform administrator and community manager',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'pastor.john@church.com',
        handle: 'pastorjohn',
        displayName: 'Pastor John',
        role: 'USER',
        bio: 'Senior Pastor at Community Church. Spreading love and hope.',
        churchAffiliation: 'Community Church',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.m@example.com',
        handle: 'sarahm',
        displayName: 'Sarah Martinez',
        role: 'USER',
        bio: 'Youth leader and community organizer. Love connecting people!',
        churchAffiliation: 'Grace Fellowship',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b5b42d5c?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'david.k@example.com',
        handle: 'davidk',
        displayName: 'David Kim',
        role: 'USER',
        bio: 'Music minister and worship leader.',
        churchAffiliation: 'Community Church',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    }),
    prisma.user.create({
      data: {
        email: 'moderator@tfn.community',
        handle: 'moderator',
        displayName: 'Community Moderator',
        role: 'MODERATOR',
        bio: 'Keeping our community safe and welcoming for everyone.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        isVerified: true,
      },
    }),
  ]);

  // Create follows
  console.log('🤝 Creating follow relationships...');
  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[2].id, // Sarah follows Pastor John
        followeeId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[3].id, // David follows Pastor John
        followeeId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[3].id, // David follows Sarah
        followeeId: users[2].id,
      },
    }),
  ]);

  // Create statuses
  console.log('📱 Creating status updates...');
  await Promise.all([
    prisma.status.create({
      data: {
        userId: users[1].id, // Pastor John
        type: 'live',
        text: 'Starting our Sunday morning service! Join us for worship and fellowship.',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    }),
    prisma.status.create({
      data: {
        userId: users[2].id, // Sarah
        type: 'status',
        text: 'Excited for youth group tonight! We\'re discussing faith in modern times. 🙏',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  // Create groups
  console.log('👥 Creating groups...');
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: 'Community Church',
        description: 'Official group for Community Church members and visitors',
        isPublic: true,
        ownerId: users[1].id, // Pastor John
        coverUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=400&fit=crop',
      },
    }),
    prisma.group.create({
      data: {
        name: 'Youth Group',
        description: 'A place for young adults to connect, grow, and have fun together',
        isPublic: true,
        ownerId: users[2].id, // Sarah
        coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop',
      },
    }),
    prisma.group.create({
      data: {
        name: 'Worship Team',
        description: 'Coordination and discussion for our worship ministry',
        isPublic: false,
        ownerId: users[3].id, // David
      },
    }),
  ]);

  // Create group members
  console.log('👨‍👩‍👧‍👦 Adding group members...');
  await Promise.all([
    // Community Church members
    prisma.groupMember.create({
      data: {
        groupId: groups[0].id,
        userId: users[1].id, // Pastor John (owner)
        role: 'OWNER',
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[0].id,
        userId: users[2].id, // Sarah
        role: 'ADMIN',
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[0].id,
        userId: users[3].id, // David
        role: 'MEMBER',
      },
    }),
    // Youth Group members
    prisma.groupMember.create({
      data: {
        groupId: groups[1].id,
        userId: users[2].id, // Sarah (owner)
        role: 'OWNER',
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[1].id,
        userId: users[3].id, // David
        role: 'MEMBER',
      },
    }),
    // Worship Team members
    prisma.groupMember.create({
      data: {
        groupId: groups[2].id,
        userId: users[3].id, // David (owner)
        role: 'OWNER',
      },
    }),
    prisma.groupMember.create({
      data: {
        groupId: groups[2].id,
        userId: users[1].id, // Pastor John
        role: 'ADMIN',
      },
    }),
  ]);

  // Create channels
  console.log('📺 Creating channels...');
  const channels = await Promise.all([
    // Community Church channels
    prisma.channel.create({
      data: {
        groupId: groups[0].id,
        name: 'general',
        kind: 'chat',
        isPrivate: false,
      },
    }),
    prisma.channel.create({
      data: {
        groupId: groups[0].id,
        name: 'prayer-requests',
        kind: 'topic',
        isPrivate: false,
      },
    }),
    prisma.channel.create({
      data: {
        groupId: groups[0].id,
        name: 'announcements',
        kind: 'topic',
        isPrivate: false,
      },
    }),
    // Youth Group channels
    prisma.channel.create({
      data: {
        groupId: groups[1].id,
        name: 'general',
        kind: 'chat',
        isPrivate: false,
      },
    }),
    prisma.channel.create({
      data: {
        groupId: groups[1].id,
        name: 'events',
        kind: 'topic',
        isPrivate: false,
      },
    }),
    // Worship Team channels
    prisma.channel.create({
      data: {
        groupId: groups[2].id,
        name: 'setlists',
        kind: 'topic',
        isPrivate: true,
      },
    }),
  ]);

  // Create messages
  console.log('💬 Creating messages...');
  await Promise.all([
    prisma.message.create({
      data: {
        channelId: channels[0].id, // Community Church general
        senderId: users[1].id, // Pastor John
        body: 'Welcome everyone to our Community Church group! Feel free to introduce yourselves and share what\'s on your heart.',
      },
    }),
    prisma.message.create({
      data: {
        channelId: channels[0].id,
        senderId: users[2].id, // Sarah
        body: 'Hi everyone! I\'m Sarah, the youth leader. Excited to connect with you all here! 🎉',
      },
    }),
    prisma.message.create({
      data: {
        channelId: channels[1].id, // Prayer requests
        senderId: users[3].id, // David
        body: 'Please pray for my family as we navigate some health challenges. Your prayers mean everything to us. 🙏',
      },
    }),
    prisma.message.create({
      data: {
        channelId: channels[3].id, // Youth Group general
        senderId: users[2].id, // Sarah
        body: 'Who\'s excited for our upcoming retreat? We have some amazing activities planned!',
      },
    }),
  ]);

  // Create live sessions
  console.log('🔴 Creating live sessions...');
  const liveSessions = await Promise.all([
    prisma.liveSession.create({
      data: {
        hostId: users[1].id, // Pastor John
        title: 'Sunday Morning Service',
        description: 'Join us for worship, prayer, and a message about hope in difficult times.',
        mode: 'VIDEO',
        state: 'LIVE',
        isRecorded: true,
        startedAt: new Date(Date.now() - 30 * 60 * 1000), // Started 30 mins ago
      },
    }),
    prisma.liveSession.create({
      data: {
        hostId: users[2].id, // Sarah
        title: 'Youth Bible Study',
        description: 'Exploring the book of Psalms and what it means for young people today.',
        mode: 'AUDIO',
        state: 'ENDED',
        isRecorded: true,
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
        endedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // Ended 1 hour ago
        replayUrl: '/replays/youth-bible-study-2024-01-15',
      },
    }),
    prisma.liveSession.create({
      data: {
        hostId: users[3].id, // David
        title: 'Worship Practice Session',
        description: 'Open practice session for this Sunday\'s worship set.',
        mode: 'AUDIO',
        state: 'SCHEDULED',
        isRecorded: false,
        startedAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
    }),
  ]);

  // Create live comments
  console.log('💭 Creating live comments...');
  await Promise.all([
    prisma.liveComment.create({
      data: {
        sessionId: liveSessions[0].id, // Sunday service
        userId: users[2].id, // Sarah
        body: 'Beautiful worship this morning! 🙌',
        timestampMs: 15 * 60 * 1000, // 15 minutes in
      },
    }),
    prisma.liveComment.create({
      data: {
        sessionId: liveSessions[0].id,
        userId: users[3].id, // David
        reaction: '❤️',
        timestampMs: 20 * 60 * 1000, // 20 minutes in
      },
    }),
    prisma.liveComment.create({
      data: {
        sessionId: liveSessions[1].id, // Youth Bible study (ended)
        userId: users[3].id, // David
        body: 'Great insights on Psalm 23, Sarah! Really helpful for our generation.',
        timestampMs: 25 * 60 * 1000,
      },
    }),
  ]);

  // Create events
  console.log('📅 Creating events...');
  await Promise.all([
    prisma.event.create({
      data: {
        title: 'Christmas Eve Service',
        description: 'Join us for a special candlelight service celebrating the birth of Jesus.',
        startAt: new Date('2024-12-24T19:00:00Z'),
        endAt: new Date('2024-12-24T20:30:00Z'),
        location: 'Community Church Sanctuary',
        isLive: true,
        heroUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&h=400&fit=crop',
        createdById: users[1].id, // Pastor John
        status: 'PUBLISHED',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Youth Winter Retreat',
        description: 'A weekend of fun, fellowship, and spiritual growth for high school and college students.',
        startAt: new Date('2024-02-15T18:00:00Z'),
        endAt: new Date('2024-02-17T12:00:00Z'),
        location: 'Mountain View Retreat Center',
        isLive: false,
        heroUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=400&fit=crop',
        createdById: users[2].id, // Sarah
        status: 'PUBLISHED',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Community Outreach Day',
        description: 'Serving our local community with food, clothing, and prayer.',
        startAt: new Date('2024-03-10T09:00:00Z'),
        endAt: new Date('2024-03-10T15:00:00Z'),
        location: 'Downtown Community Center',
        isLive: false,
        createdById: users[1].id, // Pastor John
        status: 'DRAFT',
      },
    }),
  ]);

  // Create DMs
  console.log('📩 Creating direct messages...');
  const dm = await prisma.dm.create({
    data: {
      isGroup: false,
    },
  });

  await Promise.all([
    prisma.dmParticipant.create({
      data: {
        dmId: dm.id,
        userId: users[1].id, // Pastor John
      },
    }),
    prisma.dmParticipant.create({
      data: {
        dmId: dm.id,
        userId: users[2].id, // Sarah
      },
    }),
  ]);

  await Promise.all([
    prisma.dmMessage.create({
      data: {
        dmId: dm.id,
        senderId: users[1].id, // Pastor John
        body: 'Hi Sarah, thanks for organizing the youth retreat. The kids are really excited!',
      },
    }),
    prisma.dmMessage.create({
      data: {
        dmId: dm.id,
        senderId: users[2].id, // Sarah
        body: 'Of course! It\'s going to be amazing. I\'ve lined up some great speakers and activities.',
      },
    }),
  ]);

  // Create notifications
  console.log('🔔 Creating notifications...');
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[2].id, // Sarah
        kind: 'LIVE_START',
        payload: {
          sessionId: liveSessions[0].id,
          hostName: users[1].displayName,
          title: liveSessions[0].title,
        },
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[3].id, // David
        kind: 'FOLLOW',
        payload: {
          followerId: users[2].id,
          followerName: users[2].displayName,
        },
      },
    }),
  ]);

  // Create audit logs
  console.log('📋 Creating audit logs...');
  await Promise.all([
    prisma.auditLog.create({
      data: {
        actorId: users[0].id, // Admin
        action: 'user.verify',
        targetType: 'user',
        targetId: users[1].id,
        metadata: {
          reason: 'Church leadership verification',
        },
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: users[1].id, // Pastor John
        action: 'group.create',
        targetType: 'group',
        targetId: groups[0].id,
        metadata: {
          groupName: groups[0].name,
        },
      },
    }),
  ]);

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Created:');
  console.log(`- ${users.length} users`);
  console.log(`- ${groups.length} groups`);
  console.log(`- ${channels.length} channels`);
  console.log(`- ${liveSessions.length} live sessions`);
  console.log('- Various messages, comments, and interactions');
  console.log('\n🔑 Test Accounts:');
  console.log('- admin@tfn.community (Admin)');
  console.log('- pastor.john@church.com (Pastor)');
  console.log('- sarah.m@example.com (Youth Leader)');
  console.log('- david.k@example.com (Worship Leader)');
  console.log('- moderator@tfn.community (Moderator)');
  console.log('\n🚀 Start the dev server with: npm run dev');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
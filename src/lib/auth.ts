import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { User, UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      displayName: string;
      handle: string;
      avatarUrl?: string;
      role: UserRole;
      isVerified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    displayName: string;
    handle: string;
    avatarUrl?: string;
    role: UserRole;
    isVerified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    handle: string;
    displayName: string;
    isVerified: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          displayName: user.displayName || user.handle,
          handle: user.handle,
          avatarUrl: user.avatarUrl || undefined,
          role: user.role,
          isVerified: user.isVerified,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.handle = user.handle;
        token.displayName = user.displayName;
        token.isVerified = user.isVerified;
      }

      // Handle OAuth sign-in
      if (account?.provider === 'google' && user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        if (!existingUser) {
          // Create new user for OAuth sign-in
          const handle = user.email!.split('@')[0].toLowerCase();
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              handle: handle,
              displayName: user.name || handle,
              avatarUrl: user.image,
              isVerified: true,
            }
          });
          
          token.id = newUser.id;
          token.role = newUser.role;
          token.handle = newUser.handle;
          token.displayName = newUser.displayName || newUser.handle;
          token.isVerified = newUser.isVerified;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email!,
          displayName: token.displayName,
          handle: token.handle,
          avatarUrl: token.picture || undefined,
          role: token.role,
          isVerified: token.isVerified,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
};
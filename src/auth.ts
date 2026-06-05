import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { loginSchema } from '@/lib/schemas';
import { UserModel } from '@/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        await connectToDatabase();
        const user = await UserModel.findOne({
          email: parsed.data.email.toLowerCase(),
        }).select('+password');

        if (!user) {
          return null;
        }

        const passwordMatches = await verifyPassword(parsed.data.password, user.password);
        if (!passwordMatches) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id ?? '';
        session.user.email = token.email ?? session.user.email;
        session.user.name = token.name ?? session.user.name ?? '';
        session.user.role = token.role ?? 'ATTENDEE';
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
});

import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@repo/db/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          required: true,
        },
      },
      async authorize(credentials: any) {
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await prisma.user.findFirst({
          where: {
            phone: BigInt(credentials.phone),
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString() || "",
              name: existingUser.name || "",
              email: existingUser.email || "",
            };
          }
          return null;
        }

        try {
          const user = await prisma.user.create({
            data: {
              phone: BigInt(credentials.phone),
              password: hashedPassword,
            },
          });

          await prisma.balance.create({
            data: {
              userId: user.id,
              amount: 0,
              locked: 0,
            },
          });

          return {
            id: user.id.toString() || "",
            name: user.name || "",
            email: user.email || "",
          };
        } catch (e) {
          console.error(e);
        }

        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    // TODO: can u fix the type here? Using any is bad
    async session({ token, session }: any) {
      session.user.id = token.sub;

      return session;
    },
  },
};

import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "tcss460",
      name: "tcss460",
      type: "oidc",
      issuer: "https://tcss-460-iam.onrender.com",
      clientId: process.env.AUTH_TCSS460_ID,
      clientSecret: process.env.AUTH_TCSS460_SECRET,
      authorization: {
        params: {
          audience: process.env.AUTH_TCSS460_AUDIENCE,
        },
      },
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as typeof session & { accessToken?: string }).accessToken =
        token.access_token as string | undefined;
      return session;
    },
  },
});

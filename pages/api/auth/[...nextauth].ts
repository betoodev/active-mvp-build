import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
     GoogleProvider({
      clientId: '156380673473-ipevg620jqpp9m98o6cedpk6g542ftgf.apps.googleusercontent.com',
      clientSecret: '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'
        
    }),
  ],
})

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStytchSession } from "@stytch/nextjs";
//import { useSession } from "next-auth/react";

function useRequireAuth() {
  const { session } = useStytchSession();

  const router = useRouter();

  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (!session && typeof session != "undefined") {
      router.push(`/login`);
    }
  }, [session, router]);

  return session;
}

export default useRequireAuth;

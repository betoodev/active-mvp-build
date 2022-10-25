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
    //console.log("useRequireAuth", { session });
    if (!session && typeof session != "undefined") {
      //console.log("useRequireAuth invalid", { session });
      router.push(`/login`);
    } else {
      // console.log(
      //   "useRequireAuth validated!",
      //   session!.user_id,
      //   session!.session_id
      // );
    }
  }, [session, router]);

  return session;
}

export default useRequireAuth;

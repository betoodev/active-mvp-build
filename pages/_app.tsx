import PlausibleProvider from "next-plausible";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { StytchProvider } from "@stytch/nextjs";
import { createStytchUIClient } from "@stytch/nextjs/ui";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const stytch = createStytchUIClient(
    process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!
  );

  return (
    <PlausibleProvider domain="demo.betoo.io">
      <StytchProvider stytch={stytch}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </StytchProvider>
    </PlausibleProvider>
  );
}

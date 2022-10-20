import PlausibleProvider from "next-plausible";

import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { StytchProvider } from "@stytch/nextjs";
import { createStytchUIClient } from "@stytch/nextjs/ui";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: any }>) {
  const stytch = createStytchUIClient(
    process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!
  );
  console.log("_app session", session);
  return (
    <PlausibleProvider domain="demo.betoo.io">
      <StytchProvider stytch={stytch}>
        <Component {...pageProps} />
      </StytchProvider>
    </PlausibleProvider>
  );
}

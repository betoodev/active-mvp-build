import PlausibleProvider from "next-plausible";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ThemeContext } from "../lib/ThemeContext";
import { DarkTheme, LightTheme } from "../theme/theme";

import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Head from "next/head";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, setTheme] = useState(LightTheme);

  useEffect(() => {
    setTheme(
      localStorage.getItem("darkToggle") === "dark" ? DarkTheme : LightTheme
    );
  }, []);
  return (
    <PlausibleProvider domain="demo.betoo.io">
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <CssBaseline enableColorScheme />
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=yes"
              />
            </Head>
            <Component {...pageProps} />
          </ThemeContext.Provider>
        </ThemeProvider>
      </SessionProvider>
    </PlausibleProvider>
  );
}

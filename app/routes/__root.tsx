import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";
import { ErrorBoundaryFallback } from "~/components/error-boundary";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RivalScope — AI Competitor Monitoring" },
      {
        name: "description",
        content:
          "Monitor your competitors 24/7. Get AI-powered alerts the moment they change pricing, launch features, or update their messaging. Start free.",
      },
      { name: "og:title", content: "RivalScope — AI Competitor Monitoring" },
      {
        name: "og:description",
        content: "Know every move your competitors make. Automatically.",
      },
      { name: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "RivalScope — AI Competitor Monitoring" },
      {
        name: "twitter:description",
        content: "Know every move your competitors make. Automatically.",
      },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#6366f1" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap",
      },
    ],
  }),
  errorComponent: ({ error }) => <ErrorBoundaryFallback error={error} />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

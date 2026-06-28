import {
  createRootRoute,
  HeadContent,
  Outlet,
  ScrollRestoration,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode }          from "react";
import { ToastProvider }           from "~/components/toast";
import { CommandPalette }          from "~/components/command-palette";
import { SOFTWARE_JSON_LD }        from "~/lib/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport",     content: "width=device-width, initial-scale=1" },
      { name: "theme-color",  content: "#6366f1" },
      { name: "robots",       content: "index, follow" },
      { name: "og:type",      content: "website" },
      { name: "og:site_name", content: "RivalScope" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon",       href: "/favicon.ico" },
      { rel: "manifest",   href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel:  "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(SOFTWARE_JSON_LD) },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <ToastProvider>
        <CommandPalette />
        <Outlet />
      </ToastProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(s==='dark'||(!s&&d))document.documentElement.classList.add('dark')}catch(e){}",
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

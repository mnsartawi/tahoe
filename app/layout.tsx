import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const discordComponentEmbed = JSON.stringify({
  component: {
    type: 17,
    accent_color: 0x007aff,
    components: [
      {
        type: 9,
        components: [
          {
            type: 10,
            content:
              "## tahoe\nAn interactive macOS Tahoe 26 simulator built with Next.js.",
          },
        ],
        accessory: {
          type: 11,
          media: {
            url: "https://tahoe.sartawi.dev/tahoe26.png",
          },
        },
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            url: "https://tahoe.sartawi.dev",
            label: "Open tahoe",
          },
        ],
      },
    ],
  },
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <head>
        <script
          id="discord:component-embed"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: discordComponentEmbed }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL("https://tahoe.sartawi.dev"),
  title: "tahoe",
  description: "macOS tahoe 26 simulator built with next.js 16",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "tahoe",
    description: "macOS tahoe 26 simulator built with next.js 16",
    images: [
      {
        url: "/tahoe26.png",
        width: 192,
        height: 192,
        alt: "macOS Tahoe 26 app icon",
      },
    ],
  },
}

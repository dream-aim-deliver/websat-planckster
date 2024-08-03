import "~/styles/globals.css";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";

import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/lib/infrastructure/client/trpc/react";

// Explicitly load the container to ensure all dependencies are loaded, else the optimization of the build will fail
serverContainer.load();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Websat Planckster",
  description: "Satellite Data Augmentation Platform",
  icons: [{ rel: "icon", url: "/satellite.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

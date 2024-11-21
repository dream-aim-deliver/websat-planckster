import "~/styles/globals.css";
import "@maany_shr/rage-ui-kit/ag-grid-theme.css";
import serverContainer from "~/lib/infrastructure/server/config/ioc/server-container";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/lib/infrastructure/client/trpc/react-provider";
import { PageLayout } from "./_components/layouts/page-layout";
import type AuthGatewayOutputPort from "~/lib/core/ports/secondary/auth-gateway-output-port";
import {GATEWAYS} from "~/lib/infrastructure/server/config/ioc/server-ioc-symbols";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authGateway = serverContainer.get<AuthGatewayOutputPort>(GATEWAYS.AUTH_GATEWAY);
  const sessionDTO = await authGateway.getSession();

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <PageLayout isAuthenticated={sessionDTO.success}>{children}</PageLayout>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

"use client";
import { Header, Toaster, SiteFooter, Button } from "@maany_shr/rage-ui-kit";
import Link from "next/link";
import { SessionProvider, signOut, useSession } from "next-auth/react";

const LayoutHeader = () => {
  const headerLinks = [
    <Link key="research_contexts_link" href="/">
      Research Contexts
    </Link>,
    <Link key="sources_link" href="/sources">
      Sources
    </Link>,
    <a key="docs_link" href="https://dream-aim-deliver.github.io/planckster-docs/" target="_blank">
      Documentation
    </a>,
    <Button key="sign_out" label="Sign out" onClick={() => signOut()} />,
  ];

  const { status } = useSession();

  return <Header>{status === "authenticated" ? headerLinks : undefined}</Header>;
};

export const PageLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="box-shadow flex min-h-screen flex-col bg-neutral-50 shadow-lg dark:bg-neutral-900">
      {/* Header */}
      <SessionProvider>
        <LayoutHeader />
      </SessionProvider>

      {/* Main content */}
      <main className="container mx-auto flex flex-grow p-4">{props.children}</main>

      <Toaster />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

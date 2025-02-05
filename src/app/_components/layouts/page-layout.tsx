"use client";
import { Header, Toaster, SiteFooter, Button } from "@maany_shr/rage-ui-kit";
import Link from "next/link";
import { signOut } from "next-auth/react";

export const PageLayout = (props: { children: React.ReactNode; isAuthenticated: boolean }) => {
  const headerLinks = [
    <Link key="research_contexts_link" href="/">
      Research Contexts
    </Link>,
    <Link key="sources_link" href="/sources">
      Sources
    </Link>,
    <Link key="case_studies_link" href="/case-study/create">
      Case Study
    </Link>,
    <a key="docs_link" href="https://dream-aim-deliver.github.io/planckster-docs/" target="_blank">
      Documentation
    </a>,
    <Button key="sign_out" label="Sign out" onClick={() => signOut()} />,
  ];

  return (
    <div className="box-shadow flex min-h-screen flex-col bg-neutral-50 shadow-lg dark:bg-neutral-900">
      {/* Header */}
      <Header>{props.isAuthenticated ? headerLinks : undefined}</Header>{/* Main content */}
      <main className="container mx-auto flex flex-grow p-4">{props.children}</main>
      <Toaster />
      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

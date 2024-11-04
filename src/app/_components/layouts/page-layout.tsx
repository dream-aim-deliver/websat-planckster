"use client"
import { Header } from "@maany_shr/rage-ui-kit"
import { SiteFooter } from "@maany_shr/rage-ui-kit"
import Link from "next/link";

export const PageLayout = (props: {children: React.ReactNode}) =>{
    const headerLinks = [
        <Link key="research_contexts_link" href="/">Research Contexts</Link>,
        <Link key="sources_link" href="/sources">Sources</Link>,
        <a key="docs_link" href="https://dream-aim-deliver.github.io/planckster-docs/" target="_blank">Documentation</a>
    ];

    return (
        <div className="min-h-screen flex flex-col box-shadow shadow-lg bg-neutral-50 dark:bg-neutral-900">
            {/* Header */}
            <Header>{headerLinks}</Header>

            {/* Main content */}
            <main className="flex flex-grow container mx-auto p-4">
                {props.children}
            </main>

            {/* Footer */}
            <SiteFooter />
        </div>

    )
}
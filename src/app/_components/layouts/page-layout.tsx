"use client"
import { Header } from "@maany_shr/rage-ui-kit"
import { SiteFooter } from "@maany_shr/rage-ui-kit"

export const PageLayout = (props: {children: React.ReactNode}) =>{
    return (
        <div className="min-h-screen flex flex-col box-shadow shadow-lg">
            {/* Header */}
            <Header />

            {/* Main content */}
            <main className="flex-grow container mx-auto p-4">
                {props.children}
            </main>

            {/* Footer */}
            <SiteFooter />
        </div>

    )
}
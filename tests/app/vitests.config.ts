import { defineProject } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

const config = defineProject(({mode}) => {
    console.log(process.env)
    return {
        plugins: [react(), tsconfigPaths({
            root: resolve(__dirname, "../../"),
        })],
        base: "/",
        test: {
            globals: true,
            clearMocks: true,
            environment: 'jsdom',
            setupFiles: ["./vitest.setup.ts"],
            env: {
                VITE_NEXTAUTH_URL: "http://localhost:3000",
            }
        },
    }
})

export default config;
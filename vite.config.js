import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'esnext',
        polyfillModulePreload: true,
    },
    server: {
        open: true,
    },
});
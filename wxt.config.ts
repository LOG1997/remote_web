import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
// See https://wxt.dev/api/config.html
export default defineConfig({
    vite: () => ({
        plugins: [tailwindcss()],
    }),
    modules: ["@wxt-dev/module-react"],
    webExt: {
        startUrls: ["https://go.itab.link/"],
    },
    manifest: {
        name: "WXT",
        description: "A simple extension",
        version: "0.0.1",
        permissions: ["storage", "tabs", "notifications"],
    }
});

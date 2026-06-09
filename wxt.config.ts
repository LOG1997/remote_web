import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
// See https://wxt.dev/api/config.html
export default defineConfig({
    vite: () => ({
        plugins: [tailwindcss()],
    }),
    modules: ["@wxt-dev/module-react"],
    webExt: {
        startUrls: ["https://www.baidu.com/"],
    },
    manifest: {
        name: "WXT",
        description: "A simple extension",
        version: "0.0.1",
        // options_page: "options.html",
        options_ui: {
            open_in_tab: true,
            page: "options.html",
        },
        permissions: ["storage", "tabs", "notifications"],
    }
});

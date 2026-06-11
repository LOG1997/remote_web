import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path';
// See https://wxt.dev/api/config.html
export default defineConfig({
    vite: () => ({
        plugins: [tailwindcss()],
    }),
    modules: ["@wxt-dev/module-react"],
    webExt: {
        startUrls: ["https://www.bilibili.com/"],
        chromiumProfile: resolve('.wxt/chrome-data'), // 👈 指定一个独立目录
        keepProfileChanges: true,                    // 👈 确保数据被保留
    },
    manifest: {
        name: "tv-web",
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

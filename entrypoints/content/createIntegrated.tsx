
import React from "react";
import ReactDOM from "react-dom/client";
import { ContentScriptContext } from "#imports";
import { MantineProvider } from "@mantine/core";
import { Toaster } from "@/components/ui/sonner"
export function createToastUI(ctx: ContentScriptContext) {
    return createIntegratedUi(ctx, {
        // name: 'toast-ui',
        position: 'inline',
        anchor: 'body',
        append: 'first',
        onMount: (container) => {
            const app = document.createElement("div");
            container.append(app);
            const root = ReactDOM.createRoot(app);
            root.render(
                <React.StrictMode>
                    <MantineProvider
                        theme={theme}
                        cssVariablesSelector="html"
                        getRootElement={() => document.getElementById("__nuxt")!}
                    >
                        <Toaster />
                    </MantineProvider>
                </React.StrictMode>
            )
            return root
        },
        onRemove: (root: ReactDOM.Root | undefined) => {
            // Unmount the root when the UI is removed
            root?.unmount();
        },
    });
}
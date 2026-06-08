import React from "react";
import ReactDOM from "react-dom/client";
import { ContentScriptContext } from "#imports";
import { MantineProvider } from "@mantine/core";
import { onClickOutside } from "@/utils/element";
// Remember to import Mantine's styles
// import "@mantine/core/styles.css";
import '@/styles/tailwind.css';
import { Backpack } from "lucide-react";
import { toast } from "sonner"
import { toast as sonnerToast } from 'sonner';
import { Toaster } from "@/components/ui/sonner"
import '@/styles/tailwind.css';

export default defineContentScript({
    matches: ["*://*/*"],
    cssInjectionMode: "manifest",

    async main(ctx) {
        const ui = await createShadowRootUi(ctx, {
            name: 'example-ui',
            position: 'inline',
            anchor: 'body',
            append: 'first',
            onMount: (container, shadow) => {
                const app = document.createElement("div");
                container.append(app);

                // Create a root on the UI container and render a component
                const root = ReactDOM.createRoot(app);
                root.render(
                    <React.StrictMode>
                        <MantineProvider
                            theme={theme}
                            cssVariablesSelector="html"
                            getRootElement={() => shadow.querySelector("html")!}
                        >
                            <div style={{ position: "fixed", zIndex: "99999" }}>1212100asidkaos</div>
                            <Toaster />
                        </MantineProvider>
                    </React.StrictMode>
                )
                return root
            },
            onRemove: (root) => {
                // Unmount the root when the UI is removed
                root?.unmount();
            },
        });

        // 4. Mount the UI
        ui.mount();
        // window.__EXTENSION_TOAST__ = sonnerToast;
        console.log("激活我的插件");
        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'mqtt_action') {
                console.log('[content] Received action:', message.payload);
                // sonnerToast.success("Event has been created")
                sonnerToast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                })
                // 在这里执行你想要的页面操作
                // 例如：修改页面DOM、弹出提示等
                // executePageOperation(message.payload);
            }
            return true; // 保持消息通道开放
        });
    },
});

//
// Mantine doesn't work with shadow roots by default. We have to pass custom
// values for the MantineProvider's `cssVariablesSelector` and `getRootElement`
// options.
//
// We'll point both at the HTML element inside the shadow root WXT creates.
//




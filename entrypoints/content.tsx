import '@/styles/tailwind.css';
import { toast } from "sonner"
import '@/styles/tailwind.css';
import { createToastUI } from "./content/createIntegrated";

export default defineContentScript({
    matches: ["*://*/*"],
    cssInjectionMode: "manifest",

    async main(ctx) {
        let toastUI: any;
        toastUI = createToastUI(ctx);
        toastUI.mount();
        console.log("激活我的插件");
        browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
            if (message.action === 'mqtt_action') {
                console.log('[content] Received action:', message.payload);

                // sonnerToast.success("Event has been created")
                toast("Event has been created", {
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





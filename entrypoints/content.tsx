import '@/styles/tailwind.css';
import { createToastUI } from "./content/createIntegrated";
import { listenerMqttMessage } from './content/event'
import './pageStyle/main.css'

export default defineContentScript({
    matches: ["*://*/*"],
    cssInjectionMode: "manifest",

    async main(ctx) {
        let toastUI: any;
        toastUI = createToastUI(ctx);
        toastUI.mount();
        console.log("激活我的插件");
        listenerMqttMessage()
    },
});





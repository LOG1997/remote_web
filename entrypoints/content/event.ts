import { ALLOWED_ACTIONS, AllowedAppList } from '../types/mqtt.type';
import { toast } from "sonner"
import { switchActiveCard } from './pageAction/bilibili'

const changeWebVolume = (direction: typeof ALLOWED_ACTIONS['volume'][number]) => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        if (direction === 'up') {
            video.volume = Math.min(video.volume + 0.1, 1);
        } else if (direction === 'down') {
            video.volume = Math.max(video.volume - 0.1, 0);
        } else if (direction === 'mute') {
            video.muted = !video.muted;
        }
    });
};

const handleGlobalAction = (action: typeof ALLOWED_ACTIONS['global'][number]) => {
    switch (action) {
        case 'refresh':
            window.location.reload();
            break;
        case 'nextTab':
            browser.runtime.sendMessage({ type: 'NEXT_TAB' })
            break;
        case 'previousTab':
            browser.runtime.sendMessage({ type: 'PREVIOUS_TAB' })
            break;
        case 'closeTab':
            browser.runtime.sendMessage({ type: 'CLOSE_TAB' })
            break;
        case 'fullscreen':
            browser.runtime.sendMessage({ type: 'GLOBAL_FULLSCREEN' })
        default:
            break;
    }
}

const handleNavigateAction = (action: typeof ALLOWED_ACTIONS['navigate'][number]) => {
    switch (action) {
        case 'back':
            // browser.runtime.sendMessage({ type: 'NAVIGATE_BACK' })
            window.history.back();
            break;
        case 'forward':
            window.history.forward();
            // browser.runtime.sendMessage({ type: 'NAVIGATE_FORWARD' })
            break;
        default:
            break;
    }
}

const handleNewTab = async (action: typeof ALLOWED_ACTIONS['new'][number]) => {
    if (action === 'bilibili') {
        window.open('https://www.baidu.com/');
    }
}

const handleBilibiliAction = async (action: typeof AllowedAppList['bilibili'][number]) => {
    console.log('handleBilibiliAction', action);
    switch (action) {
        case 'right':
            // window.location.href = 'https://www.bilibili.com/';
            console.log('bilibili left');
            switchActiveCard('right')
            break;
        default:
            break;
    }
}
export const listenerMqttMessage = async () => {
    browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        console.log('broser actamsd,L:', message)
        const { action, data } = message
        if (action in ALLOWED_ACTIONS) {
            console.log('[content] Received action:', data);

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
            if (action === 'volume') {
                changeWebVolume(data as typeof ALLOWED_ACTIONS['volume'][number]);
            }
            if (action === 'global') {
                handleGlobalAction(data as typeof ALLOWED_ACTIONS['global'][number])
            }
            if (action === 'navigate') {
                handleNavigateAction(data as typeof ALLOWED_ACTIONS['navigate'][number])
            }
            if (action === 'new') {
                handleNewTab(data as typeof ALLOWED_ACTIONS['new'][number])
            }
            if (action === 'bilibili') {
                handleBilibiliAction(data as typeof AllowedAppList['bilibili'][number])
            }

        }
        return true; // 保持消息通道开放
    });
}

import { ALLOWED_ACTIONS, AllowedAppList } from '../types/mqtt.type';
import { toast } from "sonner"
import { switchActiveCard, enterTheVideo } from './pageAction/bilibili'

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
            break;
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

const handleSearchAction = async (payloadString: string = '') => {
    window.open(`https://www.bilibili.com/search?keyword=${payloadString}`, '_self');
}

const handleBilibiliAction = async (action: typeof AllowedAppList['bilibili'][number], payload?: string) => {
    console.log('handleBilibiliAction', action);
    switch (action) {
        case 'right':
            switchActiveCard('right')
            break;
        case 'left':
            switchActiveCard('left')
            break;
        case 'up':
            switchActiveCard('up')
            break;
        case 'down':
            switchActiveCard('down')
            break;
        case 'enter':
            enterTheVideo()
            break;
        case 'search':
            handleSearchAction(payload)
            break;
        default:
            break;
    }
}
export const listenerMqttMessage = async () => {
    browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        console.log('broser actamsd,L:', message)
        const { action, data, payload } = message
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
                handleBilibiliAction(data as typeof AllowedAppList['bilibili'][number], payload)
            }

        }
        return true; // 保持消息通道开放
    });
}

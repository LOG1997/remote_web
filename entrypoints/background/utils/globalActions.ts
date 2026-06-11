import { toast } from "sonner";

export const switchTab = async (direction: 'nextTab' | 'previousTab') => {
    const allTabs = await browser.tabs.query({ currentWindow: true });
    if (allTabs.length === 0) return;

    // 2. 找到当前活动标签页
    const currentTab = allTabs.find(tab => tab.active);
    if (!currentTab) return;

    // 3. 计算下一个标签页的索引
    // 顺序切换模式（切换到最后一个标签页后停止）
    let targetIndex = currentTab.index;
    if (direction === 'nextTab') {
        targetIndex = currentTab.index + 1;
        if (targetIndex >= allTabs.length) {
            targetIndex = 0;
        }
    }
    else if (direction === 'previousTab') {
        targetIndex = currentTab.index - 1;
        if (targetIndex < 0) {
            targetIndex = allTabs.length - 1;
        }
    }

    // 循环切换模式（打开最右边标签页后，下一个回到最左边）
    // let nextIndex = (currentTab.index + 1) % allTabs.length;

    // 4. 获取目标标签页并激活
    const nextTab = allTabs[targetIndex];
    await browser.tabs.update(nextTab.id, { active: true, highlighted: true });
}


export const closeTab = async () => {
    const allTabs = await browser.tabs.query({ currentWindow: true });
    if (allTabs.length === 0) return;
    if (allTabs.length === 1) {
        toast("This is the last tab, please close the extension", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
            },
        });
        return
    };
    // 找到当前活动标签页
    const currentTab = allTabs.find(tab => tab.active);
    if (!currentTab) return;

    // 关闭当前标签页
    if (currentTab.id !== undefined) {
        browser.tabs.remove(currentTab.id);
    }
}

export const setBrowserFullscreen = async () => {
    const allTabs = await browser.tabs.query({ currentWindow: true });
    if (allTabs.length === 0) return;

    // 找到当前活动标签页
    const currentTab = allTabs.find(tab => tab.active);
    if (!currentTab) return;

    // 获取当前标签页的窗口ID
    const windowId = currentTab.windowId;
    if (windowId === undefined) return;
    const fullscreenState = await browser.windows.get(windowId).then(window => window.state);
    if (fullscreenState === 'fullscreen') {
        browser.windows.update(windowId, {
            state: 'normal'
        });
    }
    else {
        browser.windows.update(windowId, {
            state: 'fullscreen'
        })
    }
}
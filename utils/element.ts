export function onClickOutside(uiContainer: HTMLElement, callback: () => void) {
    const handleClick = (event: MouseEvent) => {
        if (!(event.target instanceof Node)) return;
        if (!uiContainer.contains(event.target as Node)) {
            callback();
        }
    };

    document.addEventListener("click", handleClick);

    // 返回一个函数用于清理监听器
    return () => {
        document.removeEventListener("click", handleClick);
    };
}
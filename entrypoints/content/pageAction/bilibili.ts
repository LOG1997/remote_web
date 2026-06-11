import customStyle from '../../pageStyle/main.css?inline'

function getBelowIndex(items: Element[], current: number) {
    // 确定当前元素
    const currentEl = typeof current === 'number' ? items[current] : current;
    if (!currentEl || !items.length) return -1;

    const currentRect = currentEl.getBoundingClientRect();
    const currentCenterX = (currentRect.left + currentRect.right) / 2;

    let bestIndex = -1;
    let minVerticalDist = Infinity;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item === currentEl) continue;

        const rect = item.getBoundingClientRect();
        // 必须完全在当前元素下方（顶部边界大于当前底部）
        if (rect.top > currentRect.bottom) {
            const itemCenterX = (rect.left + rect.right) / 2;
            // 水平偏移容忍度：两个元素平均宽度的 30%（可调整）
            const maxHorizontalOffset = (currentRect.width + rect.width) / 6;
            const horizontalDist = Math.abs(itemCenterX - currentCenterX);

            if (horizontalDist <= maxHorizontalOffset) {
                const verticalDist = rect.top - currentRect.bottom;
                if (verticalDist < minVerticalDist) {
                    minVerticalDist = verticalDist;
                    bestIndex = i;
                }
            }
        }
    }
    return bestIndex;
}

function getUpIndex(items: Element[], current: number) {
    const currentEl = typeof current === 'number' ? items[current] : current;
    if (!currentEl || !items.length) return -1;

    const currentRect = currentEl.getBoundingClientRect();
    const currentCenterX = (currentRect.left + currentRect.right) / 2;

    let bestIndex = -1;
    let minVerticalDist = Infinity;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item === currentEl) continue;

        const rect = item.getBoundingClientRect();
        // 必须完全在当前元素上方（底部边界小于当前元素的顶部）
        if (rect.bottom < currentRect.top) {
            const itemCenterX = (rect.left + rect.right) / 2;
            // 水平偏移容忍度：两者平均宽度的 30%（可调整）
            const maxHorizontalOffset = (currentRect.width + rect.width) / 6;
            const horizontalDist = Math.abs(itemCenterX - currentCenterX);

            if (horizontalDist <= maxHorizontalOffset) {
                // 垂直距离：当前元素顶部 - 候选元素底部（正值）
                const verticalDist = currentRect.top - rect.bottom;
                if (verticalDist < minVerticalDist) {
                    minVerticalDist = verticalDist;
                    bestIndex = i;
                }
            }
        }
    }
    return bestIndex;
}
function isElementNearViewportEdge(el: Element, threshold = 50) {
    const rect = el.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    // 元素顶部距离视口顶部太近，或底部距离视口底部太近
    return rect.top < threshold || rect.bottom > viewHeight - threshold;
}
export const switchActiveCard = async (direction: 'right' | 'left' | 'up' | 'down') => {
    const shadowRootDiv = document.getElementById('bewly');
    console.log(shadowRootDiv);
    if (!shadowRootDiv) return;
    let videoCards: NodeListOf<Element> | null = null;
    if (shadowRootDiv && shadowRootDiv.shadowRoot) {
        const style = document.createElement('style');
        style.textContent = customStyle;
        shadowRootDiv.shadowRoot.appendChild(style);
        videoCards = shadowRootDiv.shadowRoot.querySelectorAll('.video-card');
    } else {
        console.log('元素不存在或不是 open shadowRoot');
        return
    }
    if (!videoCards) {
        return
    }
    const videoCardsArray = Array.from(videoCards);
    let nextIndex = 0
    const currentActiveCard = videoCardsArray.find(card => card.classList.contains('tv_web_active_video_card'));
    if (currentActiveCard) {
        const currentIndex = videoCardsArray.indexOf(currentActiveCard);
        nextIndex = currentIndex || 0;
        if (direction === 'right') {
            nextIndex = currentIndex + 1;
        } else if (direction === 'left') {
            nextIndex = currentIndex - 1;
        }
        else if (direction === 'down') {
            const nextBelowElement = getBelowIndex(videoCardsArray, currentIndex);
            if (nextBelowElement >= 0) {
                nextIndex = nextBelowElement
            }
        }
        else if (direction === 'up') {
            const nextBelowElement = getUpIndex(videoCardsArray, currentIndex);
            if (nextBelowElement >= 0) {
                nextIndex = nextBelowElement
            }
        }
    }
    videoCards.forEach((card, index) => {
        if (index !== nextIndex) {
            card.classList.remove('tv_web_active_video_card');
        }
    });
    videoCards[nextIndex].classList.add('tv_web_active_video_card');
    if (isElementNearViewportEdge(videoCards[nextIndex])) {
        // 滚动到可见区域
        videoCards[nextIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
    }
}

export const enterTheVideo = async () => {
    const shadowRootDiv = document.getElementById('bewly');
    console.log(shadowRootDiv);
    if (!shadowRootDiv) return;
    let targetVideoCard: Element | null = null;
    if (shadowRootDiv && shadowRootDiv.shadowRoot) {
        targetVideoCard = shadowRootDiv.shadowRoot.querySelector('.tv_web_active_video_card');
    } else {
        console.log('元素不存在或不是 open shadowRoot');
        return
    }
    console.log('targetdoc is', targetVideoCard);
    if (targetVideoCard) {
        //   获取子标签的a 元素的链接，在窗口内打开
        const aElement = targetVideoCard.querySelector('a');
        if (aElement) {
            const href = aElement.getAttribute('href');
            if (href) {
                window.open(href, '_self');
            }
        }
    }
}
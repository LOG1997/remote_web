import React from "react";
import ReactDOM from "react-dom/client";
import { ContentScriptContext } from "#imports";
import { CardInput } from "@/components/CardInput";
import { LeafElement } from "@/components/LeafElement";
import { CommandDemo } from "@/components/ContextMenu";
import { MessageTip } from "@/components/MessageTip1";
import { MantineProvider } from "@mantine/core";
import { onClickOutside } from "@/utils/element";
// Remember to import Mantine's styles
// import "@mantine/core/styles.css";
import '@/styles/tailwind.css';
import { Backpack } from "lucide-react";
export enum LeafKey {
    underline = "underline",
    wave = "wave",
    delete = "delete",
    red = "red",
    blue = "blue",
    orange = "orange",
}
export default defineContentScript({
    matches: ["*://*/*"],
    cssInjectionMode: "manifest",

    async main(ctx) {
        console.log("激活我的插件");
        let menuUi: any;
        let cardUi: any;
        let saveRange: any;
        const handleSubmitNote = async (note: string, color: string) => {
            console.log('得到笔记', note, color)
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            // 保持文本选择
            selection?.addRange(saveRange)
            if (cardUi) {
                cardUi.remove();
                cardUi = null
            }
            const style = {
                color: color || 'var(--foreground)',
                borderColor: color || 'var(--border)',
                backgroundColor: color ? `oklab(from ${color} calc(l - 0.1) a b/0.1)` : `oklab(from var(--foreground) calc(l - 0.1) a b/0.1)`
            }
            const extractContents = saveRange.extractContents();
            const leafKey = LeafKey.underline
            const leafTipElement = createLeafTipElement(ctx, saveRange, extractContents, note, style, leafKey)
            leafTipElement.mount()
            saveRange = null
        }
        const handleMark = async (type: string) => {
            console.log('parent handleMark::', type,saveRange);
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            // 保持文本选择
            selection?.addRange(saveRange)
            console.log('parent 1 handleMark::', selection);
            if (selection && selection.rangeCount > 0) {
                // const range = selection.getRangeAt(0);
                const text = saveRange.toString();
                if (!text) return;
                let leafKey: LeafKey | undefined = undefined;

                // 判断type是否是美剧类型LeafKey
                const isTrue = isLeafKey(type)
                console.log('parent isLeafType::', isTrue);
                if (isTrue) {
                    if (type === 'underline') {
                        leafKey = LeafKey.underline
                    }
                    else if (type === 'wave') {
                        leafKey = LeafKey.wave
                    }
                    else if (type === 'delete') {
                        leafKey = LeafKey.delete
                    }
                    else if (type === 'red' || type === 'blue' || type === 'orange') {
                        leafKey = LeafKey[type]
                    }
                    const extractContents = saveRange.extractContents();
                    const wrapper = createLeafElement(ctx, saveRange, extractContents, leafKey);
                    wrapper.mount()
                    saveRange=null
                    // window.getSelection()?.removeAllRanges();
                }
                else {
                    // 在鼠标的地方出现
                    const rect = saveRange.getBoundingClientRect();
                    const cardStyle = {
                        position: "fixed",
                        left: `${rect.left + 50}px`,
                        top: `${rect.top + 20}px`,
                    }
                    saveRange = range
                    const color = type.split('-')[1]
                    console.log('parent not handleMark::', type);
                    cardUi = createCardInput(ctx, color, cardStyle, handleSubmitNote);
                    cardUi.mount()
                }

            }

        }
        // 选中内容后展示
        document.addEventListener("mouseup", async () => {
            if (menuUi) {
                setTimeout(() => {
                    menuUi.remove();
                    menuUi = null;
                }, 0)
                return;
            }
            const selection = window.getSelection();
            console.log('parent mouseup::', selection);
            if (selection && selection.rangeCount > 0) {
                const text = selection.toString();
                if (!text) return;
                const range = selection.getRangeAt(0);
                saveRange = range
                const rect = range.getBoundingClientRect();
                const menuStyle = {
                    position: "fixed",
                    left: `${rect.left + 50}px`,
                    top: `${rect.top + 20}px`,
                }
                menuUi = await createContextMenu(ctx, '', menuStyle, handleMark);
                menuUi.mount();
            }
        })

        // 页面大小变化时根据选中内容的位置变更出现组件的位置
        window.addEventListener("resize", async () => {
            if (menuUi) {
                menuUi.remove();
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const text = selection.toString();
                    if (!text) return;
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    const menuStyle = {
                        position: "fixed",
                        left: `${rect.left + 20}px`,
                        top: `${rect.top + 20}px`,
                    }
                    menuUi = await createContextMenu(ctx, '', menuStyle, handleMark);
                    menuUi.mount();
                    // 设置menuUi display none
                }
            }
        });
        // 监听esc按键销毁元素
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                if (menuUi) {
                    menuUi.remove();
                    menuUi = null;
                }
                if (cardUi) {
                    cardUi.remove();
                    cardUi = null
                }
            }
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

function isLeafKey(value: any): value is LeafKey {
    return Object.values(LeafKey).includes(value);
}

function createContextMenu(ctx: ContentScriptContext, className?: string, style?: object, handleMark?: (text: string) => void) {
    let userStyle = style || {};
    const setStyle = (style: object) => {
        Object.assign(userStyle, style);
    }
    return createShadowRootUi(ctx, {
        name: "context-menu",
        position: "inline",
        anchor: "body",
        append: "first",
        onMount(uiContainer, shadow) {
            const app = document.createElement("div");
            uiContainer.append(app);

            // Create a root on the UI container and render a component
            const root = ReactDOM.createRoot(app);
            root.render(
                <React.StrictMode>
                    <MantineProvider
                        theme={theme}
                        cssVariablesSelector="html"
                        getRootElement={() => shadow.querySelector("html")!}
                    >
                        <CommandDemo className={className} style={userStyle} handleMark={handleMark} />
                    </MantineProvider>
                </React.StrictMode>
            )
            return root
        },
        onRemove(root: ReactDOM.Root | undefined) {
            root?.unmount();
        },

    })
}


function createLeafElement(ctx: ContentScriptContext, rootRange: Range, extractContents: DocumentFragment, leafKey?: LeafKey): globalThis.IntegratedContentScriptUi<ReactDOM.Root> {

    return createIntegratedUi(ctx, {
        position: 'inline',
        anchor: 'body',
        onMount: (uiContainer) => {
            // Append children to the container
            uiContainer.style.display = 'inline';
            rootRange.insertNode(uiContainer);
            const root = ReactDOM.createRoot(uiContainer);
            root.render(
                <React.StrictMode>
                    <MantineProvider
                        theme={theme}
                        cssVariablesSelector="html"
                        getRootElement={() => document.getElementById("__nuxt")!}
                    >
                        <LeafElement leafKey={leafKey} extractContents={extractContents} />
                    </MantineProvider>
                </React.StrictMode>
            );
            console.log('uiCOntainer', uiContainer)
            return root;
        },

    });

}
function createLeafTipElement(ctx: ContentScriptContext, rootRange: Range, extractContents: DocumentFragment, tip: string, style: object, leafKey?: LeafKey): globalThis.IntegratedContentScriptUi<ReactDOM.Root> {
    let userStyle = style || {}
    return createIntegratedUi(ctx, {
        position: 'inline',
        anchor: 'body',
        onMount: (uiContainer) => {
            uiContainer.style.display = 'inline';
            uiContainer.style.position = 'relative';
            rootRange.insertNode(uiContainer);
            // 获取uiContainer的高度
            const rect = uiContainer.getBoundingClientRect();
            const bottom = rect.height;
            console.log('bottom', bottom, rootRange);
            userStyle = Object.assign({}, userStyle, { bottom: bottom + 'px' });
            // Append children to the container

            uiContainer.style.lineHeight = `${rect.height + 42}px`;
            const root = ReactDOM.createRoot(uiContainer);
            root.render(
                <React.StrictMode>
                    <MantineProvider
                        theme={theme}
                        cssVariablesSelector="html"
                        getRootElement={() => document.getElementById("__nuxt")!}
                    >
                        <MessageTip tip={tip} style={userStyle} />
                        <LeafElement leafKey={leafKey} extractContents={extractContents} />
                    </MantineProvider>
                </React.StrictMode>
            );
            console.log('uiCOntainer', uiContainer)
            return root;
        },

    });

}
function createCardInput(ctx: ContentScriptContext, color: string, style?: object, handleSubmitNote?: (text: string, color: string) => void) {
    return createIntegratedUi(ctx, {
        // name: "card-input",
        position: "inline",
        anchor: "body",
        append: "first",
        onMount(uiContainer) {
            const app = document.createElement("div");
            app.classList.add("fixed", "z-100");
            uiContainer.append(app);


            // Create a root on the UI container and render a component
            const root = ReactDOM.createRoot(app);
            root.render(
                <CardInput style={style} data={''} color={color} onSubmit={handleSubmitNote} />
            )
            const removeListener = onClickOutside(uiContainer, () => {
                console.log('Clicked outside card input');
                root?.unmount();
                removeListener(); // 只执行一次
            });
            return root
        },
        onRemove(root: ReactDOM.Root | undefined) {
            root?.unmount();
        },

    })
}


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import {
    Waves,
    Strikethrough,
    Underline,
    MessageCircle
} from "lucide-react"
export function CommandDemo(props: any) {
    const { style, handleMark } = props
    function handleChildrenClick(e: React.MouseEvent, type: string) {
        console.log('handle children click', e)
        e.stopPropagation();
        e.preventDefault();
        handleMark(type)
    }
    return (
        <div style={style} className="absolute left-0 top-0 h-0 w-0">
            <Popover defaultOpen open={true}>
                <PopoverTrigger></PopoverTrigger>
                <PopoverContent>
                    <div className="flex items-center gap-2 hover:bg-gray-50" onClick={(e) => handleChildrenClick(e, 'underline')}>
                        <Underline />
                        <span>下划线</span>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50" onClick={(e) => handleChildrenClick(e, 'wave')}>
                        <Waves />
                        <span>波浪线</span>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50" onClick={(e) => handleChildrenClick(e, 'delete')}>
                        <Strikethrough />
                        <span>删除线</span>
                    </div>
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger>File</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>
                                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem>
                                    New Window <MenubarShortcut>⌘N</MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem disabled>New Incognito Window</MenubarItem>
                                <MenubarSeparator />
                                <MenubarSub defaultOpen open={true}>
                                    <MenubarSubTrigger>Share</MenubarSubTrigger>
                                    <MenubarSubContent>
                                        <MenubarItem>Email link</MenubarItem>
                                        <MenubarItem>Messages</MenubarItem>
                                        <MenubarItem>Notes</MenubarItem>
                                    </MenubarSubContent>
                                </MenubarSub>
                                <MenubarSeparator />
                                <MenubarItem>
                                    Print... <MenubarShortcut>⌘P</MenubarShortcut>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </PopoverContent>
            </Popover>
        </div>
    )
}

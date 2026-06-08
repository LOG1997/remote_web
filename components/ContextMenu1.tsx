import {
    Waves,
    Strikethrough,
    Underline,
    MessageCircle
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
            <DropdownMenu defaultOpen open={true}>
                <DropdownMenuTrigger asChild>
                    <span></span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'underline')}>
                            <Underline />
                            <span>下划线</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'wave')}>
                            <Waves />
                            <span>波浪线</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'delete')}>
                            <Strikethrough />
                            <span>删除线</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger onClick={(e) => handleChildrenClick(e, 'note-')}>注释</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'note-blue')}>
                                        <div className="w-4 h-4 bg-blue-500"></div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'note-red')}>
                                        <div className="w-4 h-4 bg-red-500"></div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'note-orange')}>
                                        <div className="w-4 h-4 bg-orange-500"></div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Message</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>More...</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'note')}>
                            <MessageCircle />
                            <span>注释</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'blue')}>
                        <div className="w-4 h-4 bg-blue-500"></div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'red')}>
                        <div className="w-4 h-4 bg-red-500"></div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleChildrenClick(e, 'orange')}>
                        <div className="w-4 h-4 bg-orange-500"></div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

import { Button } from "@/components/ui/button"
import { History, Search, LoaderPinwheel } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMqtt } from '@/components/MqttProvider'
import { useState } from "react"
export function OtherActionGroup() {
    const [searchValue, setSearchValue] = useState('')
    const mqttClient = useMqtt()
    const handleSearch = () => {
        mqttClient.publish('tv-web/log1997/receive', {
            action: 'bilibili',
            data: 'search',
            payload: searchValue
        })
    }
    return <div className="other-action-group flex justify-between px-6 my-6">
        <div className="w-3/12 h-10">
            <Button className="w-full h-full">
                <History className="h-4 w-4" />
            </Button>
        </div>
        <div className="w-5/12 h-10">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full h-full">
                        <Search className="h-4 w-4" />
                        Search
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Search</DialogTitle>
                        <DialogDescription>
                            open search page .
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="search-video"
                                type="text"
                                placeholder="Search..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" onClick={handleSearch}>Submit</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* <Button className="w-full h-full">
                <Search className="h-4 w-4" />
                Search
            </Button> */}
        </div>
        <div className="w-3/12 h-10">
            <Button className="w-full h-full">
                <LoaderPinwheel className="h-4 w-4" />
            </Button>
        </div>
    </div>
}

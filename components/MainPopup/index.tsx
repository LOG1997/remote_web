import { useState, useEffect } from "react"
import { Toggle } from "@/components/ui/toggle"
import { Label } from "@/components/ui/label"
import { storage } from '#imports';
import { toast } from "sonner"

export default function MainPopup() {

    const [isOn, setIsOn] = useState<undefined | boolean>(undefined);
    const getIsOn = async () => {
        const isOn: boolean = await storage.getItem('local:isOn') || false
        setIsOn(isOn)
    }
    const onChangeToggle = async () => {
        setIsOn(!isOn)
        storage.setItem('local:isOn', !isOn)
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        const currentUrl = tab.url;
        console.log(currentUrl);

    }
    useEffect(() => {
        getIsOn()
    }, [])
    return (
        <div>
            <div className="flex items-center space-x-2 w-60 h-100  bg-blue-100">
                <div className="flex items-center space-x-2">
                    <Label>开关</Label>
                    <Toggle onClick={onChangeToggle} className="ml-2 cursor-pointer">
                        {
                            isOn ? (
                                <div className="bg-green-400 px-2">ON</div>
                            ) : (
                                <div className="bg-red-400 px-2">OFF</div>
                            )
                        }
                    </Toggle>
                </div>
            </div>
        </div>
    );
}

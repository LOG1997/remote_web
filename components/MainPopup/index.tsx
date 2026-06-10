import { useState, useEffect } from "react"
import { Toggle } from "@/components/ui/toggle"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { storage } from '#imports';
import { PublicPath } from "wxt/browser";
import MqttConfigOptions from './mqttConfigOptions';


export default function MainPopup() {
    const openOptions = () => {
        window.open(browser.runtime.getURL('options.html' as PublicPath));
    };




    return (
        <div>
            <div className="flex flex-col items-center space-x-2 w-60 h-100  bg-blue-100 ">
                <MqttConfigOptions />
                <div className="flex flex-col gap-2">
                    <Label>去配置</Label>
                    <Button onClick={openOptions}>去配置</Button>
                </div>
            </div>
        </div>
    );
}

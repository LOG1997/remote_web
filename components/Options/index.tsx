import { MqttConfigForm } from './parts/MqttConfig.tsx'
import { storage } from "#imports";
import { useState } from "react";

export function MainOptions() {
    const [mqttConfig, setMqttConfig] = useState<any>({})

    const getMqttConfig = async () => {
        const mqttConfig = await storage.getItem('local:mqttConfig')
        console.log('mqttConfig', mqttConfig)
        setMqttConfig(mqttConfig)
    }
    const handleSubmitMqtt = (data: any) => {
        console.log('handle submit mqtt', data)
        storage.setItem('local:mqttConfig', data)
    }

    useEffect(() => {
        getMqttConfig()
    }, [])


    return (
        <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
            <MqttConfigForm handleSubmit={handleSubmitMqtt} value={mqttConfig} />
        </div>
    )
}

import { useState, useEffect } from "react"
import { Toggle } from "@/components/ui/toggle"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { storage } from '#imports';
import { PublicPath } from "wxt/browser";
import { CopyButtonStyled } from "@mshafiqyajid/react-copy-button/styled";
import "@mshafiqyajid/react-copy-button/styles.css";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MqttConfigType } from '@/entrypoints/types/mqtt.type'
import { Copy } from "lucide-react";
import { getTargetTopic } from "@/entrypoints/background/mqttClient";

enum ConnectStatus {
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
}
export default function MqttConfigOptions() {
    const [connectStatus, setConnectStatus] = useState<ConnectStatus>(ConnectStatus.DISCONNECTED);
    const [mqttConfig, setMqttConfig] = useState<MqttConfigType | null>(null);
    const [brokerUrl, setBrokerUrl] = useState('');
    const [targetTopic, setTargetTopic] = useState('');
    const getMqttConfig = async () => {
        let localMqttConfig: any = await storage.getItem('local:mqttConfig');
        setMqttConfig(localMqttConfig || {});
        if (localMqttConfig && localMqttConfig.address && localMqttConfig.port) {
            setBrokerUrl(`ws://${localMqttConfig.address}:${localMqttConfig.port}${localMqttConfig.path || ''}`)
        }
        if (localMqttConfig && localMqttConfig.topicName) {
            const manifest = browser.runtime.getManifest();
            setTargetTopic(`${manifest.name}/${localMqttConfig.topicName}/receive`)
        }
    }
    const onChangeToggle = async () => {
        if (connectStatus === ConnectStatus.CONNECTED) {
            await disconnectMqtt();
        } else {
            await connectMqtt();
        }
    }
    useEffect(() => {
        checkConnectionStatus();
        getMqttConfig()
        storage.watch('local:mqttConfig', getMqttConfig)
    }, [])


    async function checkConnectionStatus() {
        try {
            const response = await browser.runtime.sendMessage({ type: 'GET_CONNECTION_STATUS' });

            console.log('连接状态:', response);
            setConnectStatus(response.mqttStatus.toUpperCase() as ConnectStatus);
            // 更新 UI...
        } catch (error) {
            console.error('获取状态失败:', error);
        }
    }

    async function connectMqtt() {
        try {
            console.log('已设置MQTT配置:', mqttConfig);
            const response = await browser.runtime.sendMessage({ type: 'CONNECT_MQTT' });
            console.log('连接结果:', response);
            setConnectStatus(response.mqttStatus.toUpperCase() as ConnectStatus);
            // 刷新连接状态...
        } catch (error) {
            console.error('连接失败:', error);
        }
    }

    async function disconnectMqtt() {
        try {
            const response = await browser.runtime.sendMessage({ type: 'DISCONNECT_MQTT' });
            console.log('断开连接结果:', response);
            setConnectStatus(response.mqttStatus.toUpperCase() as ConnectStatus);
            // 刷新连接状态...
        } catch (error) {
            console.error('断开连接失败:', error);
        }
    }
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Mqtt Server Status</CardTitle>
            </CardHeader>
            <CardContent>

                <div className="flex items-center space-x-2">
                    <Label>状态</Label>
                    <Toggle onClick={onChangeToggle} disabled={connectStatus === ConnectStatus.CONNECTING} className="ml-2 cursor-pointer">
                        {
                            connectStatus === ConnectStatus.CONNECTED && (
                                <div className="bg-green-400 px-2">ON</div>
                            )
                        }
                        {
                            connectStatus === ConnectStatus.DISCONNECTED && (
                                <div className="bg-red-400 px-2">OFF</div>
                            )
                        }
                        {
                            connectStatus === ConnectStatus.CONNECTING && (
                                <div className="bg-yellow-400 px-2">CONNECTING</div>
                            )
                        }
                    </Toggle>
                </div>
                <div className="flex items-center space-x-2">
                    <Label>服务地址</Label>
                    <span>
                        {brokerUrl}
                    </span>
                    <CopyButtonStyled
                        text={brokerUrl}
                        size="icon"
                        variant="ghost"
                        copiedLabel='copied'
                        icon={{
                            copy: <Copy />,
                        }}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Label>订阅主题</Label>
                    <span>
                        {targetTopic}
                    </span>
                    <CopyButtonStyled
                        text={targetTopic}
                        size="icon"
                        variant="ghost"
                        copiedLabel='copied'
                        icon={{
                            copy: <Copy />,
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

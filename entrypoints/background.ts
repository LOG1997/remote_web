import { connectMqtt, handleMqttMessage } from "./background/mqttClient";
import { storage } from '#imports'
import { getMqttConfig } from './background/mqttClient/mqttConfig'

export default defineBackground(async () => {
    console.log("Hello background!", { id: browser.runtime.id });
    const mqttClient = await connectMqtt()
    console.log('MQTT client initialized with status:', mqttClient);
    browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.type === 'GET_CONNECTION_STATUS') {
            // 返回当前状态
            sendResponse({ mqttStatus: mqttClient.status });
        }
        else if (message.type === 'CONNECT_MQTT') {
            await mqttClient.connect(handleMqttMessage)
            const mqttConfig = await getMqttConfig();
            const manifest = browser.runtime.getManifest();
            let targetTopic = `${manifest.name}/${mqttConfig.topicName}/receive`;
            mqttClient.subscribe(targetTopic);
            sendResponse({ mqttStatus: mqttClient.status });
        }
        else if (message.type === 'DISCONNECT_MQTT') {
            mqttClient.disconnect();
            sendResponse({ mqttStatus: mqttClient.status });
        }
        // 重要：如果 sendResponse 是异步的或者你想保持通道开放，返回 true
        return { mqttStatus: mqttClient.status };
    });
});

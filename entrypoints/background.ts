import { connectMqtt, handleMqttMessage, getTargetTopic } from "./background/mqttClient";

export default defineBackground(async () => {
    console.log("Hello background!", { id: browser.runtime.id });
    const mqttClient = await connectMqtt()
    console.log('MQTT client initialized with status:', mqttClient);
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'GET_CONNECTION_STATUS') {
            // 返回当前状态
            sendResponse({ mqttStatus: mqttClient.status });
        }
        else if (message.type === 'CONNECT_MQTT') {
            (async () => {
                try {
                    await mqttClient.connect(handleMqttMessage);
                    let targetTopic = await getTargetTopic();
                    mqttClient.subscribe(targetTopic);
                    console.log('mqttClient connected:', mqttClient.status);
                    // 在异步操作完成后发送响应
                    sendResponse({ mqttStatus: mqttClient.status });
                } catch (error) {
                    console.error('MQTT Connect Error:', error);
                    sendResponse({ mqttStatus: 'DISCONNECTED', error: String(error) });
                }
            })();
        }
        else if (message.type === 'DISCONNECT_MQTT') {
            mqttClient.disconnect();
            sendResponse({ mqttStatus: mqttClient.status });
        }
        // 重要：如果 sendResponse 是异步的或者你想保持通道开放，返回 true
        return true;
    });
});

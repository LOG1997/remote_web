import { createMqttClient } from "./background/mqttCLient";
import { storage } from '#imports'

export default defineBackground(async () => {
    console.log("Hello background!", { id: browser.runtime.id });
    const mqttConfig: any = await storage.getItem('local:mqttConfig');
    const brokerUrl = `ws://${mqttConfig?.address}:${mqttConfig?.port}`;
    const mqttOptions = {
        clientId: `wxt_ext_${Math.random().toString(16).slice(2, 10)}`,
        username: mqttConfig.username,   // 如果需要
        password: mqttConfig.password,   // 如果需要
        keepalive: 60,
    };
    const mqttClient = createMqttClient(brokerUrl, mqttOptions);
    // 定义消息处理函数（收到 MQTT 消息后，转发给当前页面）
    const handleMqttMessage = async (topic: string, message: Buffer) => {
        const payload = message.toString();
        console.log(`[background] MQTT message on ${topic}: ${payload}`);

        // 根据你的业务逻辑决定是否转发
        if (topic === 'your/topic') {
            const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
            console.log('[background] Forwarding MQTT message to content script in tab:', tab);
            if (tab && tab.id) {
                browser.tabs.sendMessage(tab.id, {
                    action: 'mqtt_action',
                    payload,
                });
            }
            else {
                console.log('[background] No active tab found');
            }
        }
        else {
            alert(`Received MQTT message on ${topic}: ${payload}`); // 其他主题的消息直接弹窗显示
        }
    };
    mqttClient.connect(handleMqttMessage)
        .then(() => {
            console.log('MQTT ready, subscribing...');
            // 订阅需要的主题
            mqttClient.subscribe('your/topic');
            // 可以订阅多个
            // mqttService.subscribe('another/topic');
        })
        .catch((err) => {
            console.error('Failed to connect MQTT', err);
        });

});

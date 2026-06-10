import { createMqttClient } from './clientClass';
import { storage } from '#imports';
import { getMqttConfig } from './mqttConfig'
import { MqttConfigType } from '../../types/mqtt.type';
export const connectMqtt = async () => {
    const mqttConfig = await getMqttConfig();
    const mqttClient = createMqttClient(mqttConfig.brokerUrl, mqttConfig.mqttOptions);
    const manifest = browser.runtime.getManifest();
    let targetTopic = `${manifest.name}/${mqttConfig.topicName}/receive`;
    console.log('mqtt topic:', targetTopic);
    // 定义消息处理函数（收到 MQTT 消息后，转发给当前页面）


    mqttClient.connect(handleMqttMessage)
        .then(() => {
            console.log('MQTT ready, subscribing...');
            // 订阅需要的主题
            mqttClient.subscribe(targetTopic);
            // 可以订阅多个
            // mqttService.subscribe('another/topic');
        })
        .catch((err) => {
            console.error('Failed to connect MQTT', err);
        });

    storage.watch('local:mqttConfig', async (newConfig: MqttConfigType | null) => {
        if (!newConfig) {
            return
        }
        console.log('MQTT config changed, updating client...', newConfig);
        const newBrokerUrl = `ws://${newConfig?.address}:${newConfig?.port}`;
        const mqttOptions = {
            clientId: `wxt_ext_${Math.random().toString(16).slice(2, 10)}`,
            username: newConfig.username,   // 如果需要
            password: newConfig.password,   // 如果需要
            keepalive: 60,
        };
        targetTopic = `${manifest.name}/${newConfig.topicName}/receive`
        if (mqttClient.status === 'connected' || mqttClient.status === 'connecting') {
            mqttClient.disconnect();
            mqttClient.updateOptions(mqttOptions, newBrokerUrl);
            mqttClient.connect(handleMqttMessage)
                .then(() => {
                    console.log('MQTT reconnected with new config, subscribing...');
                    mqttClient.subscribe(targetTopic);
                })
                .catch((err) => {
                    console.error('Failed to reconnect MQTT with new config', err);
                });
        }
    })
    return mqttClient;
}

export const handleMqttMessage = async (topic: string, message: Buffer) => {
    const payload = message.toString();
    console.log(`[background] MQTT message on ${topic}: ${payload}`);
    const mqttConfig = await getMqttConfig();
    const manifest = browser.runtime.getManifest();
    let targetTopic = `${manifest.name}/${mqttConfig.topicName}/receive`;
    // 根据你的业务逻辑决定是否转发
    if (topic === targetTopic) {
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
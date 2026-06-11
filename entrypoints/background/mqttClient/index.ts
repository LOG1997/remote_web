import { createMqttClient } from './clientClass';
import { storage } from '#imports';
import { getMqttConfig } from './mqttConfig'
import { MqttConfigType, ValidAction, ValidatedPayload, ALLOWED_ACTIONS, AllowedAppList } from '../../types/mqtt.type';

export const getTargetTopic = async () => {
    const mqttConfig = await getMqttConfig();
    const manifest = browser.runtime.getManifest();
    let targetTopic = `${manifest.name}/${mqttConfig.topicName}/receive`;
    return targetTopic;
}
export const connectMqtt = async () => {
    const mqttConfig = await getMqttConfig();
    const mqttClient = createMqttClient(mqttConfig.brokerUrl, mqttConfig.mqttOptions);
    let targetTopic = await getTargetTopic();

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
        const newBrokerUrl = `ws://${newConfig?.address}:${newConfig?.port}${newConfig?.path || ''}`;
        const mqttOptions = {
            clientId: `wxt_ext_${Math.random().toString(16).slice(2, 10)}`,
            username: newConfig.username,   // 如果需要
            password: newConfig.password,   // 如果需要
            keepalive: 60,
        };
        targetTopic = await getTargetTopic();
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

const validatePayload = (rawPayload: string): ValidatedPayload | null => {
    try {
        const parsed: { action: string, data: string } = JSON.parse(rawPayload);
        console.log('[background] Validating MQTT payload:', parsed);
        // 1. 基本结构检查
        if (!parsed || typeof parsed !== 'object') {
            console.warn('[background] Payload is not a valid object');
            return null;
        }

        const { action, data } = parsed;

        // 2. 检查 action 是否存在且为字符串
        if (typeof action !== 'string') {
            console.warn('[background] Invalid action type');
            return null;
        }

        // 3. 检查 action 是否在白名单中
        if (!(action in ALLOWED_ACTIONS) && !(action in AllowedAppList)) {
            console.warn(`[background] Unknown action: ${action}`);
            return null;
        }

        // 4. 检查 data 是否存在且为字符串 (根据业务需求，有些 action 可能不需要 data，需自行调整)
        if (typeof data !== 'string') {
            console.warn('[background] Invalid data type or missing data');
            return null;
        }
        const validAction = action as ValidAction;
        const allowedDataList: readonly string[] = ALLOWED_ACTIONS[validAction];

        // 4. 检查 data 是否存在且为字符串
        if (typeof data !== 'string') {
            console.warn('[background] Invalid data type or missing data');
            return null;
        }
        // 5. 检查 data 的值是否在该 action 允许的列表中
        if (!(action in ALLOWED_ACTIONS) || !allowedDataList.includes(data)) {
            console.log('asdklasdkjaksopdkopaskopd:', action, data, ALLOWED_ACTIONS, allowedDataList, action in ALLOWED_ACTIONS, allowedDataList.includes(data))
            console.warn(`[background] Invalid data "${data}" for action "${action}". Allowed: ${allowedDataList.join(', ')}`);
            return null;
        }

        return { action: action as ValidAction, data, timestamp: Date.now() };

    } catch (error) {
        console.warn('[background] Failed to parse or validate MQTT payload:', error);
        return null;
    }
};
export const handleMqttMessage = async (topic: string, message: Buffer) => {
    const rawPayload = message.toString();
    console.log(`[background] MQTT message on ${topic}: ${rawPayload}`);
    let targetTopic = await getTargetTopic();
    // 根据你的业务逻辑决定是否转发
    if (topic === targetTopic) {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        console.log('[background] Forwarding MQTT message to content script in tab:', tab);
        const validatedPayload = validatePayload(rawPayload);
        console.log('[background] Validated payload:', validatedPayload);
        if (!validatedPayload) {
            console.warn('[background] Discarding invalid payload');
            return;
        }
        if (tab && tab.id) {
            browser.tabs.sendMessage(tab.id, {
                ...validatedPayload,
            });
        }
        else {
            console.log('[background] No active tab found');
        }
    }
    else {
        console.log(`Received MQTT message on ${topic}: ${rawPayload}`); // 其他主题的消息直接弹窗显示
    }
};
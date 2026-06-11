import { MqttService } from '../mqttClient/clientClass';
import { getTargetTopic, handleMqttMessage } from '../mqttClient';
import { switchTab, closeTab, setBrowserFullscreen } from '../utils/globalActions'
export const listenerBrowserEvent = (mqttClient: MqttService) => {
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
        else if (message.type === 'NEXT_TAB') {
            switchTab('nextTab');
        }
        else if (message.type === 'PREVIOUS_TAB') {
            switchTab('previousTab');
        }
        else if (message.type === 'CLOSE_TAB') {
            closeTab();
        }
        else if (message.type === 'GLOBAL_FULLSCREEN') {
            setBrowserFullscreen()
        }
        // 重要：如果 sendResponse 是异步的或者你想保持通道开放，返回 true
        return true;
    });
}
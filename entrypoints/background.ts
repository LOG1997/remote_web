import { connectMqtt, handleMqttMessage, getTargetTopic } from "./background/mqttClient";
import { listenerBrowserEvent } from './background/event/listener'

export default defineBackground(async () => {
    console.log("Hello background!", { id: browser.runtime.id });
    const mqttClient = await connectMqtt()
    console.log('MQTT client initialized with status:', mqttClient);
    listenerBrowserEvent(mqttClient);
});

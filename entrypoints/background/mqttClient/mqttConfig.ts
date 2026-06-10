import { storage } from '#imports';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

export const getMqttConfig = async () => {
    let mqttConfig: any = await storage.getItem('local:mqttConfig');
    console.log('mqttConfig init is', mqttConfig);
    if (!mqttConfig) {
        mqttConfig = {
            address: '127.0.0.1',
            port: 8889,
            username: '',
            password: '',
            topicName: generateRandomName(),
        };
        await storage.setItem('local:mqttConfig', mqttConfig);
    }

    const brokerUrl = `ws://${mqttConfig?.address}:${mqttConfig?.port}`;
    console.log('broker url:', brokerUrl);
    const mqttOptions = {
        clientId: `wxt_ext_${Math.random().toString(16).slice(2, 10)}`,
        username: mqttConfig.username,   // 如果需要
        password: mqttConfig.password,   // 如果需要
        keepalive: 60,
    };

    return {
        brokerUrl,
        mqttOptions,
        topicName: mqttConfig.topicName,
    };
}

const generateRandomName = () => {
    const name = uniqueNamesGenerator({
        dictionaries: [colors, animals],
        length: 2,
        separator: '-',
    });
    return name;
};
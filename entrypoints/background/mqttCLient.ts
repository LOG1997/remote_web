import mqtt, { MqttClient, IClientOptions } from 'mqtt';

export type MqttMessageHandler = (topic: string, message: Buffer) => void;

class MqttService {
    private client: MqttClient | null = null;
    private brokerUrl: string;
    private options: IClientOptions;
    private messageHandler?: MqttMessageHandler;

    constructor(brokerUrl: string, options: IClientOptions) {
        this.brokerUrl = brokerUrl;
        this.options = options;
    }

    // 初始化连接，并设置消息处理回调
    public connect(handler?: MqttMessageHandler): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.client) {
                console.warn('MQTT client already connected');
                resolve();
                return;
            }

            this.messageHandler = handler;
            this.client = mqtt.connect(this.brokerUrl, this.options);

            this.client.once('connect', () => {
                console.log('[MQTT] Connected to broker');
                resolve();
            });

            this.client.once('error', (err) => {
                console.error('[MQTT] Connection error:', err);
                reject(err);
            });

            // 转发收到的消息
            this.client.on('message', (topic, message) => {
                if (this.messageHandler) {
                    this.messageHandler(topic, message);
                } else {
                    console.warn('[MQTT] No message handler set, message dropped:', topic);
                }
            });

            // 可选的自动重连监听
            this.client.on('reconnect', () => {
                console.log('[MQTT] Reconnecting...');
            });
        });
    }

    // 订阅主题
    public subscribe(topic: string | string[], qos: 0 | 1 | 2 = 0): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                reject(new Error('MQTT client not connected'));
                return;
            }
            this.client.subscribe(topic, { qos }, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    // 发布消息
    public publish(topic: string, message: string | Buffer, qos: 0 | 1 | 2 = 0): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                reject(new Error('MQTT client not connected'));
                return;
            }
            this.client.publish(topic, message, { qos }, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    // 断开连接
    public disconnect(): void {
        if (this.client) {
            this.client.end(true);
            this.client = null;
            console.log('[MQTT] Disconnected');
        }
    }
}

// 导出一个单例实例（推荐在 background 中直接创建，也可以导出类）
export function createMqttClient(brokerUrl: string, options: IClientOptions) {
    return new MqttService(brokerUrl, options);
}
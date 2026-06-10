export interface MqttConfigType {
    address: string;
    port: number;
    path: string;
    username?: string;
    password?: string;
    topicName: string;
}
export interface MqttConfigType {
    address: string;
    port: number;
    username?: string;
    password?: string;
    topicName: string;
}
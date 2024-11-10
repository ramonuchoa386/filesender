export interface MqttPublisherConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  clientId?: string;
}

import mqtt, { MqttClient } from "mqtt";
import Logger from "../logger";

class MqttPublisher {
  private client: MqttClient;
  private logger = new Logger("MQTT");

  constructor() {
    this.client = mqtt.connect(
      `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
      {
        username: `${process.env.MQTT_USER}`,
        password: `${process.env.MQTT_PASS}`,
      }
    );

    this.client.on("connect", () => {
      this.logger.info("", "Connected to MQTT broker.");
    });

    this.client.on("error", (err) => {
      this.logger.error(JSON.stringify(err), "MQTT connection error.");
    });
  }

  public async publish(topic: string, message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.publish(`cmnd/${topic}/POWER`, message, { qos: 1 }, (err) => {
        if (err) {
          this.logger.error(JSON.stringify(err), "Failed to publish message.");

          reject(err);
        } else {
          this.logger.info(
            JSON.stringify({ topic, message }),
            "Message published to topic."
          );

          resolve();
        }
      });
    });
  }

  public disconnect(): void {
    this.client.end(() => {
      this.logger.info("", "Disconnected from MQTT broker.");
    });
  }
}

export default MqttPublisher;

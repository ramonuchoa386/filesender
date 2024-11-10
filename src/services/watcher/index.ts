import {
  Database,
  FileChecker,
  MqttPublisher,
  PlateRecognizerService,
} from "..";
import { GarageDirection } from "../../domain/plate-database.interface";

/**
 * Classe Watcher
 *
 * Classe responsável por observar o diretório de imagens JPG.
 *
 * A cada 3 segundos, a classe verifica se houve atualização na data de modificação do arquivo.
 *
 * Caso tenha modificação, ele envia para uma API de OCR e com os caracteres reconhecidos, ele consulta um banco de dados.
 * Caso tenha sucesso na consulta do banco de dados, ele publica uma mensagem em uma fila e aguarda alguns instantes para registrar o momento.
 * @param {string} file                                           - Arquivo a ser observado.
 * @property {FileChecker} fileChecker                            - Classe resposável por verificar o valor da ultima data de modificação do arquivo.
 * @property {MqttPublisher} publisher                            - Classe responsável por criar o cliente MQTT.
 * @property {PlateRecognizerService} plateRecognizerService      - Classe responsável pela API do OCR.
 * @property {Database} databaseService                           - Classe responsável pela API do banco de dados.
 * @property {number | null} lastModification                     - Propriedade para guardar a ultima modificação do arquivo.
 */
class Watcher {
  private file: string;
  private lastModification: number | null = null;
  private fileChecker: FileChecker;
  private publisher: MqttPublisher = new MqttPublisher();
  private plateRecognizerService: PlateRecognizerService =
    new PlateRecognizerService();
  private databaseService: Database = new Database();

  constructor(file: string) {
    this.file = file;
    this.fileChecker = new FileChecker(file);
  }

  /**
   * Método responsável por atualizar o valor da propriedade lastModification da class Watcher
   *
   * Caso o valor da propriedade lastModification seja nulo, atribui o valor enviado no parametro currentModification.
   *
   * @param {number | null} currentModify - Valor da atual modificação do arquivo
   * @returns {boolean} verdadeiro ou falso
   */
  private modified(currentModify: number | null): boolean {
    if (this.lastModification === null) {
      this.lastModification = currentModify;

      return false;
    }

    return !(currentModify === this.lastModification);
  }

  private async processFile(): Promise<void> {
    try {
      const recognitionResults =
        await this.plateRecognizerService.recognizePlate(this.file);
      if (!recognitionResults) return;

      const { camera_id, plate } = recognitionResults;
      if (!plate || !camera_id) return;

      const [direction, id_condominio] = camera_id.split(":");

      const plateDBRes = await this.databaseService.plateDatabase(
        plate,
        id_condominio
      );
      if (plateDBRes) {
        const { control, data } = plateDBRes;
        const { status } = control;

        if (status === 404 || !data) return;

        const { placa } = data;

        await this.publisher.publish(camera_id, "ON");
        await this.delay(2 * 60 * 1000);

        // const registerCar = await this.databaseService.register(
        //   placa,
        //   Number(id_condominio),
        //   direction as GarageDirection
        // );

        // if (registerCar === null) return;

        // console.log(registerCar);

        await this.databaseService.register(
          placa,
          Number(id_condominio),
          direction as GarageDirection
        );
      }
    } catch (error) {
      console.error("Error processing file:", error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async watchFile(interval: number = 3000): Promise<void> {
    console.log(`Now watching ${this.file}`);

    while (true) {
      const currentModify = await this.fileChecker.checkFileLastModify();

      if (this.modified(currentModify)) {
        this.lastModification = currentModify;
        await this.processFile();
      }

      await this.delay(interval);
    }
  }
}

export default Watcher;

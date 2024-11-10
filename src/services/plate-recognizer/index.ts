import fs from "fs";
import path from "path";
import FormData from "form-data";
import fetch from "node-fetch";
import {
  IPlateRecognizerAPIResponse,
  IPlateRecognizerNOKResponse,
  IPlateRecognizerResults,
} from "../../domain/plate-recognizer.interface";
import Logger from "../logger";

class PlateRecognizerService {
  private logger = new Logger("OCR");

  public async recognizePlate(
    filePath: string
  ): Promise<IPlateRecognizerResults | null> {
    try {
      const fileStream = fs.createReadStream(filePath);
      const fileName = path.basename(filePath);
      const camera_id = () => {
        const baseContext = fileName.split(".")[0];
        const context = baseContext.split("_");

        return `${context[1]}:${context[2]}`;
      };
      const formdata = new FormData();
      formdata.append("upload", fileStream, { filename: fileName });
      formdata.append("camera_id", camera_id());
      formdata.append("regions", "br");

      this.logger.info(JSON.stringify(formdata), "Request to OCR.");

      const response = await fetch(`${process.env.PLATE_RECOGNIZER_API_URL}`, {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.PLATE_RECOGNIZER_API_TOKEN}`,
        },
        body: formdata,
      });

      const result = (await response.json()) as
        | IPlateRecognizerAPIResponse
        | IPlateRecognizerNOKResponse;

      this.logger.info(JSON.stringify(result), "Resposta do OCR.");

      if ("status_code" in result) {
        const { detail, status_code } = result;

        this.logger.error(
          JSON.stringify({ status_code, detail }),
          "OCR API error."
        );

        return null;
      } else {
        const { results, camera_id } = result;

        if (results.length > 0) {
          const { plate } = results[0];

          return { plate, camera_id };
        } else {
          return null;
        }
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error), "Erro na requisição ao OCR.");

      return null;
    }
  }
}

export default PlateRecognizerService;

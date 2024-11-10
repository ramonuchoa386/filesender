import fetch from "node-fetch";
import {
  GarageDirection,
  IPlateDatabaseResponse,
  IPlateRegisterPassagemResponse,
} from "../../domain/plate-database.interface";
import TokenManager from "../auth";
import Logger from "../logger";

class Database {
  private tokenManager: TokenManager = new TokenManager();
  private logger = new Logger("Database");

  public async plateDatabase(
    plate: string,
    id_condominio: string
  ): Promise<IPlateDatabaseResponse | null> {
    const token = await this.tokenManager.getToken();

    try {
      this.logger.info(
        JSON.stringify({
          id_condominio,
          plate,
        }),
        "Resquest de consulta no banco."
      );

      const response = await fetch(
        `${process.env.PLATE_DATABASE_ENDPOINT}/${plate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            id_condominio: id_condominio,
          },
        }
      );
      const result = await response.json();

      this.logger.info(
        JSON.stringify(result),
        "Resposta de consulta no banco."
      );

      return result;
    } catch (error) {
      this.logger.error(
        JSON.stringify(error),
        "Erro de consulta ao banco de dados de placas."
      );

      return null;
    }
  }

  public async register(
    plate: string,
    id_condominio: number,
    direction: GarageDirection
  ): Promise<IPlateRegisterPassagemResponse | null> {
    const token = await this.tokenManager.getToken();
    try {
      const response = await fetch(
        `${process.env.PLATE_REGISTER_ENDPOINT}/registrar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            placa: plate,
            timestamp: Date.now(),
            id_condominio,
            direction,
          }),
        }
      );
      const result = await response.json();

      return result;
    } catch (error) {
      console.error(
        "Erro ao registrar passagem do carro no banco de dados: ",
        error
      );

      return null;
    }
  }
}

export default Database;

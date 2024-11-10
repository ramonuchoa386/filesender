interface ICarData {
  marca: string;
  modelo: string;
  placa: string;
  id_morador: number;
  id_veiculo: number;
}

interface IControl {
  status: number;
}

export interface IPlateDatabaseResponse {
  control: IControl;
  message: string;
  data: ICarData | null;
}

export enum GarageDirection {
  ENTRADA = "ENTRADA",
  SAIDA = "SAIDA",
}

interface IPlateRegisterPassagemData {
  placa: string;
  id_condominio: number;
  direction: string;
  timestamp: number;
}

export interface IPlateRegisterPassagemResponse {
  control: IControl;
  message: string;
  data: IPlateRegisterPassagemData;
}

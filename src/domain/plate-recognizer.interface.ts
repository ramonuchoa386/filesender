interface IPlateRecognizerCandidateItem {
  plate: string;
  score: number;
}

interface IPlateRecognizerBox {
  xmax: number;
  xmin: number;
  ymax: number;
  ymin: number;
}
interface IPlateRecognizerRegion {
  code: string;
  score: number;
}
interface IPlateRecognizerVehicle {
  box: IPlateRecognizerBox;
  score: number;
  type: string;
}

interface IPlateRecognizerResultItem {
  box: IPlateRecognizerBox;
  candidates: IPlateRecognizerCandidateItem[];
  dscore: number;
  plate: string;
  region: IPlateRecognizerRegion;
  score: number;
  vehicle: IPlateRecognizerVehicle;
}

export interface IPlateRecognizerNOKResponse {
  detail: string;
  status_code: number;
}

export interface IPlateRecognizerAPIResponse {
  camera_id: string | null;
  filename: string;
  processing_time: number;
  results: IPlateRecognizerResultItem[];
  timestamp: string;
  version: number;
}

export interface IPlateRecognizerResults {
  plate: string;
  camera_id: string | null;
}

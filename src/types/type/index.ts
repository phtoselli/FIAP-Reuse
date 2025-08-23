export enum Types {
  CATEGORYTYPE = "CATEGORYTYPE",
  CONDITIONTYPE = "CONDITIONTYPE",
}

export interface Type {
  id: number;
  code: Types;
  description: string;
}

export interface GetTypeParam {
  type: Types;
}

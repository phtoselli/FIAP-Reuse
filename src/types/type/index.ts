import { CategoryCode } from "./category";
import { ConditionCode } from "./condition";

export enum Types {
  CATEGORYTYPE = "CATEGORYTYPE",
  CONDITIONTYPE = "CONDITIONTYPE",
}

export interface Type {
  id: number;
  code: CategoryCode | ConditionCode;
  codeType: Types;
  description: string;
}

export interface GetTypeParam {
  type: Types;
}

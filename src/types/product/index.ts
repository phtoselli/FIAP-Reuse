import { CategoryCode } from "../type/category";
import { ConditionCode } from "../type/condition";

export interface Product {
  id: number;
  code: string;
  title: string;
  imageUrl: string;
  description: string;
  rate: number;
  rateNumber: number;
  categoryCode: CategoryCode;
  conditionCode: ConditionCode;
}

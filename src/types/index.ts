export type StringMap = {
  [key: string]: string;
};

export type GenericTypes =
  | string
  | number
  | boolean
  | Array<string | number | boolean>;

export type GenericTypesMap = {
  [key: string]: GenericTypes;
};

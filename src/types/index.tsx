export type StringMap = {
  [key: string]: string;
};

export type Types =
  | string
  | number
  | boolean
  | Array<string | number | boolean>;

export type TypesMap = {
  [key: string]: Types;
};

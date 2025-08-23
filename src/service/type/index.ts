import { GetTypeParam, Type } from "@/types/type";
import { CategoryCode } from "@/types/type/category";
import { ConditionCode } from "@/types/type/condition";

export const TypeService = {
  get: async (params: GetTypeParam): Promise<Type[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (params.type === "CATEGORYTYPE") {
          resolve([
            {
              id: 1,
              code: CategoryCode.CLOTHING,
              description: "Roupas",
            },
            {
              id: 2,
              code: CategoryCode.ELECTRONICS,
              description: "Eletrônicos",
            },
            {
              id: 3,
              code: CategoryCode.APPLIANCES,
              description: "Eletrodomésticos",
            },
            {
              id: 4,
              code: CategoryCode.FURNITURE,
              description: "Móveis",
            },
          ] as Type[]);
        }

        if (params.type === "CONDITIONTYPE") {
          resolve([
            {
              id: 1,
              code: ConditionCode.NEW,
              description: "Novo",
            },
            {
              id: 2,
              code: ConditionCode.USED,
              description: "Usado",
            },
          ] as Type[]);
        }

        resolve([]);
      }, 1000);
    });
  },
};

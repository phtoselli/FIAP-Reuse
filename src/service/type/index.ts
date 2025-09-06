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
              title: "Roupas",
              description:
                "Peças de vestuário em geral, como camisetas, calças, vestidos, casacos e acessórios de moda.",
            },
            {
              id: 2,
              code: CategoryCode.HOUSE,
              title: "Casa",
              description:
                "Aparelhos e dispositivos eletrônicos, como celulares, computadores, tablets, fones de ouvido e TVs.",
            },
            {
              id: 3,
              code: CategoryCode.FOOTWEAR,
              title: "Calçados",
              description:
                "Itens para facilitar o dia a dia em casa, como geladeiras, fogões, micro-ondas, liquidificadores e máquinas de lavar.",
            },
            {
              id: 4,
              code: CategoryCode.ACCESSORIES,
              title: "Acessórios",
              description:
                "Mobílias e peças de decoração, como sofás, mesas, cadeiras, estantes, camas e armários.",
            },
            {
              id: 5,
              code: CategoryCode.COSMETICS,
              title: "Cosméticos",
              description:
                "Mobílias e peças de decoração, como sofás, mesas, cadeiras, estantes, camas e armários.",
            },
            {
              id: 6,
              code: CategoryCode.OTHERS,
              title: "Outros",
              description:
                "Mobílias e peças de decoração, como sofás, mesas, cadeiras, estantes, camas e armários.",
            },
          ] as Type[]);
        }

        if (params.type === "CONDITIONTYPE") {
          resolve([
            {
              id: 1,
              code: ConditionCode.NEW,
              title: "Novo",
              description: "Produto novo e lacrado, nunca foi usado.",
            },
            {
              id: 2,
              code: ConditionCode.USED,
              title: "Usado",
              description:
                "A caixa do produto já foi aberta e o produto foi usado.",
            },
            {
              id: 3,
              code: ConditionCode.OPEN_BOX,
              title: "Caixa aberta",
              description:
                "Somente a caixa do produto foi aberta, mas o produto não foi usado.",
            },
          ] as Type[]);
        }

        resolve([]);
      }, 1000);
    });
  },
};

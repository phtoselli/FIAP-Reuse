import { Product } from "@/types/product";
import { CategoryCode } from "@/types/type/category";
import { ConditionCode } from "@/types/type/condition";

const products: Product[] = [
  {
    id: 1,
    ownerId: 519516,
    code: "VS001",
    title: "Camiseta Básica",
    imageUrl: "https://source.unsplash.com/400x400/?tshirt,clothes",
    description: "Camiseta básica de algodão",
    rate: 5,
    rateNumber: 120,
    categoryCode: CategoryCode.CLOTHING,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 2,
    ownerId: 75335,
    code: "VS002",
    title: "Jaqueta Jeans",
    imageUrl: "https://source.unsplash.com/400x400/?jacket,clothes",
    description: "Jaqueta jeans estilosa",
    rate: 4,
    rateNumber: 80,
    categoryCode: CategoryCode.CLOTHING,
    conditionCode: ConditionCode.USED,
  },
  {
    id: 3,
    ownerId: 453453,
    code: "VS003",
    title: "Tênis Casual",
    imageUrl: "https://source.unsplash.com/400x400/?sneakers,shoes",
    description: "Tênis casual confortável",
    rate: 4,
    rateNumber: 200,
    categoryCode: CategoryCode.CLOTHING,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 4,
    ownerId: 435435453,
    code: "VS004",
    title: "Vestido Floral",
    imageUrl: "https://source.unsplash.com/400x400/?dress,clothes",
    description: "Vestido floral leve",
    rate: 5,
    rateNumber: 60,
    categoryCode: CategoryCode.CLOTHING,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 5,
    ownerId: 453453345,
    code: "VS005",
    title: "Boné Esportivo",
    imageUrl: "https://source.unsplash.com/400x400/?cap,clothes",
    description: "Boné esportivo ajustável",
    rate: 3,
    rateNumber: 40,
    categoryCode: CategoryCode.CLOTHING,
    conditionCode: ConditionCode.USED,
  },
  {
    id: 6,
    ownerId: 51453453459516,
    code: "EL001",
    title: "Samsung S25",
    imageUrl: "https://source.unsplash.com/400x400/?samsung,phone",
    description: "Smartphone Samsung S25",
    rate: 4,
    rateNumber: 1561561,
    categoryCode: CategoryCode.ELECTRONICS,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 7,
    ownerId: 345534,
    code: "EL002",
    title: "Notebook Dell XPS",
    imageUrl: "https://source.unsplash.com/400x400/?laptop,dell",
    description: "Notebook Dell XPS ultrafino",
    rate: 5,
    rateNumber: 500,
    categoryCode: CategoryCode.ELECTRONICS,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 8,
    ownerId: 43545,
    code: "EL003",
    title: "Fone Bluetooth Sony",
    imageUrl: "https://source.unsplash.com/400x400/?headphones,sony",
    description: "Fone de ouvido sem fio Sony",
    rate: 4,
    rateNumber: 350,
    categoryCode: CategoryCode.ELECTRONICS,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 9,
    ownerId: 43545353,
    code: "EL004",
    title: "Monitor LG 27"",
    imageUrl: "https://source.unsplash.com/400x400/?monitor,lg",
    description: "Monitor LG 27 polegadas Full HD",
    rate: 5,
    rateNumber: 220,
    categoryCode: CategoryCode.ELECTRONICS,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 10,
    ownerId: 4345345345,
    code: "EL005",
    title: "Smartwatch Garmin",
    imageUrl: "https://source.unsplash.com/400x400/?smartwatch,garmin",
    description: "Relógio inteligente Garmin",
    rate: 4,
    rateNumber: 140,
    categoryCode: CategoryCode.ELECTRONICS,
    conditionCode: ConditionCode.USED,
  },
  {
    id: 11,
    ownerId: 9784534,
    code: "AP001",
    title: "Geladeira Brastemp Frost Free",
    imageUrl: "https://source.unsplash.com/400x400/?refrigerator",
    description: "Geladeira moderna e econômica",
    rate: 5,
    rateNumber: 600,
    categoryCode: CategoryCode.APPLIANCES,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 12,
    ownerId: 737837754523,
    code: "AP002",
    title: "Máquina de Lavar LG",
    imageUrl: "https://source.unsplash.com/400x400/?washingmachine",
    description: "Máquina de lavar roupas LG 12kg",
    rate: 4,
    rateNumber: 420,
    categoryCode: CategoryCode.APPLIANCES,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 13,
    ownerId: 878754523,
    code: "AP003",
    title: "Micro-ondas Panasonic",
    imageUrl: "https://source.unsplash.com/400x400/?microwave",
    description: "Micro-ondas 30L Panasonic",
    rate: 4,
    rateNumber: 310,
    categoryCode: CategoryCode.APPLIANCES,
    conditionCode: ConditionCode.USED,
  },
  {
    id: 14,
    ownerId: 778642423,
    code: "AP004",
    title: "Aspirador de Pó Electrolux",
    imageUrl: "https://source.unsplash.com/400x400/?vacuum,cleaner",
    description: "Aspirador potente da Electrolux",
    rate: 5,
    rateNumber: 150,
    categoryCode: CategoryCode.APPLIANCES,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 15,
    ownerId: 786782133,
    code: "AP005",
    title: "Cafeteira Nespresso",
    imageUrl: "https://source.unsplash.com/400x400/?coffee,machine",
    description: "Cafeteira automática Nespresso",
    rate: 5,
    rateNumber: 800,
    categoryCode: CategoryCode.APPLIANCES,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 16,
    ownerId: 51957811416,
    code: "FU001",
    title: "Sofá 3 Lugares",
    imageUrl: "https://source.unsplash.com/400x400/?sofa",
    description: "Sofá confortável de 3 lugares",
    rate: 4,
    rateNumber: 210,
    categoryCode: CategoryCode.FURNITURE,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 17,
    ownerId: 5195143453456,
    code: "FU002",
    title: "Cama Box Casal",
    imageUrl: "https://source.unsplash.com/400x400/?bed",
    description: "Cama box casal com molas ensacadas",
    rate: 5,
    rateNumber: 190,
    categoryCode: CategoryCode.FURNITURE,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 18,
    ownerId: 51950404516,
    code: "FU003",
    title: "Mesa de Jantar 6 lugares",
    imageUrl: "https://source.unsplash.com/400x400/?diningtable",
    description: "Mesa de jantar com 6 cadeiras",
    rate: 5,
    rateNumber: 170,
    categoryCode: CategoryCode.FURNITURE,
    conditionCode: ConditionCode.NEW,
  },
  {
    id: 19,
    ownerId: 51944534516,
    code: "FU004",
    title: "Escrivaninha Moderna",
    imageUrl: "https://source.unsplash.com/400x400/?desk,office",
    description: "Escrivaninha com design moderno",
    rate: 4,
    rateNumber: 90,
    categoryCode: CategoryCode.FURNITURE,
    conditionCode: ConditionCode.USED,
  },
  {
    id: 20,
    ownerId: 517878329516,
    code: "FU005",
    title: "Estante de Livros",
    imageUrl: "https://source.unsplash.com/400x400/?bookshelf",
    description: "Estante de madeira para livros",
    rate: 4,
    rateNumber: 130,
    categoryCode: CategoryCode.FURNITURE,
    conditionCode: ConditionCode.NEW,
  },
];

const productService = {
  get: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products);
      }, 500);
    });
  },

  create: async (newProduct: Omit<Product, "id">): Promise<Product> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product: Product = {
          ...newProduct,
          id: products.length ? products[products.length - 1].id + 1 : 1,
        };

        products.push(product);
        resolve(product);
      }, 500);
    });
  },

  getByCode: async (code: string): Promise<Product> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = products.find((p) => p.code === code);
        if (!product) {
          reject(new Error(`Produto com código ${code} não encontrado.`));
        } else {
          resolve(product);
        }
      }, 500);
    });
  },
};

export default productService;

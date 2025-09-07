import { Product } from "@/types/product";
import { CategoryCode } from "@/types/type/category";
import { ConditionCode } from "@/types/type/condition";
import axios from "axios";

const products: Product[] = [];

const productService = {
  get: async (): Promise<Product[]> => {
    return await axios
      .get(`http://localhost:3000/api/produtos`)
      .then((response) => {
        console.log("Resposta aqui", response.data.produtos);
        return response.data.produtos; // Dados retornados
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  },

  create: async (newProduct: Omit<Product, "id">): Promise<Product> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product: Product = {
          ...newProduct,
          id: products.length
            ? String(products[products.length - 1].id + 1)
            : "1",
        };

        products.push(product);
        resolve(product);
      }, 500);
    });
  },

  getByCode: async (code: string): Promise<Product> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = products.find((p) => p.categoria.nome === code);
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

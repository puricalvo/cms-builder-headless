import {
    AddProductActionSchema,
    EditProductActionSchema
} from "@/types/product.action.schema";

import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { api } from "@/services/api";
import { getCategories } from "@/services/pages";

export const products = {

    /*=============================================
    Crear producto
    =============================================*/

    addProduct: defineAction({
        accept: "form",
        input: AddProductActionSchema,

        handler: async (input, ctx) => {

            const categories = await getCategories();

            const category = categories.find(
                (item: any) =>
                    item.url_page === input.category_url
            );

            if (!category?.table || !category?.suffix) {
                throw new Error(
                    "No se ha encontrado la tabla o el sufijo de la categoría"
                );
            }

            const suffix = category.suffix;

            const body: Record<string, any> = {

                [`title_${suffix}`]: input.title,

                [`image_${suffix}`]: input.image,

                [`price_${suffix}`]:
                    input.variable_price === "true"
                        ? JSON.stringify(input.variants)
                        : input.price
            };

            const token =
                ctx.cookies.get("FRESHCOFFEE_TOKEN")?.value;

            await api(
                `externas?table=${category.table}&token=${token}&tableToken=admins&suffix=admin&suffix_module=${suffix}`,
                "POST",
                body
            );

            return {
                message: "Creado Correctamente"
            };
        }
    }),

    /*=============================================
    Editar producto
    =============================================*/

    updateProduct: defineAction({
        accept: "form",
        input: EditProductActionSchema,

        handler: async (input, ctx) => {

            const categories = await getCategories();

            const category = categories.find(
                (item: any) =>
                    item.url_page === input.category_url
            );

            if (!category?.table || !category?.suffix) {
                throw new Error(
                    "No se ha encontrado la tabla o el sufijo de la categoría"
                );
            }

            const suffix = category.suffix;

            const body: Record<string, any> = {

                [`title_${suffix}`]: input.title,

                [`image_${suffix}`]: input.image,

                [`price_${suffix}`]:
                    input.variable_price === "true"
                        ? JSON.stringify(input.variants)
                        : input.price
            };

            const token =
                ctx.cookies.get("FRESHCOFFEE_TOKEN")?.value;

            await api(
                `externas?table=${category.table}&id=${input.id}&nameId=id_${suffix}&token=${token}&tableToken=admins&suffix=admin&suffix_module=${suffix}`,
                "PUT",
                body
            );

            return {
                message: "Actualizado Correctamente"
            };
        }
    }),

    /*=============================================
    Eliminar producto
    =============================================*/

    deleteProduct: defineAction({
        accept: "json",

        input: z.object({
            id: z.number().min(1, {
                message: "ID no válido"
            }),

            table: z.string().min(1, {
                message: "Tabla no válida"
            })
        }),

        handler: async (input, ctx) => {

            const categories = await getCategories();

            const category = categories.find(
                (item: any) =>
                    item.table === input.table
            );

            if (!category?.suffix) {
                throw new Error(
                    "No se ha encontrado el sufijo de la categoría"
                );
            }

            const suffix = category.suffix;

            const token =
                ctx.cookies.get("FRESHCOFFEE_TOKEN")?.value;

            await api(
                `externas?table=${input.table}&id=${input.id}&nameId=id_${suffix}&token=${token}&tableToken=admins&suffix=admin&suffix_module=${suffix}`,
                "DELETE"
            );

            return {
                message: "Eliminado Correctamente"
            };
        }
    })

};
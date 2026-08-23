import { nullToEmptyString } from "@/utils";
import { z } from "astro:schema";

const CommonFields = {
    title: z.preprocess(
        nullToEmptyString,
        z.string().trim().min(1, {
            message: "El Título no puede ir vacío"
        })
    ),

    image: z.preprocess(
        nullToEmptyString,
        z.string().trim().min(1, {
            message: "La Imagen no puede estar vacía"
        })
    ),

    category_url: z.preprocess(
        nullToEmptyString,
        z.string().trim().min(1, {
            message: "Categoría no válida"
        })
    )
};

const FixedPriceSchema = z.object({
    variable_price: z.literal("false"),

    price: z.coerce.number().min(1, {
        message: "Precio no válido"
    }),

    ...CommonFields
});

const VariablePriceSchema = z.object({
    variable_price: z.literal("true"),

    variants: z.string().transform((value, ctx) => {

        try {

            const variants = JSON.parse(value);

            if (!Array.isArray(variants) || variants.length === 0) {
                ctx.addIssue({
                    code: "custom",
                    message: "Debes seleccionar al menos un precio"
                });

                return z.NEVER;
            }

            return variants.map((variant) => ({
                size: String(variant.size),
                price: Number(variant.price)
            }));

        } catch {

            ctx.addIssue({
                code: "custom",
                message: "Los precios no son válidos"
            });

            return z.NEVER;
        }

    }),

    ...CommonFields
});

export const AddProductActionSchema = z.discriminatedUnion(
    "variable_price",
    [
        FixedPriceSchema,
        VariablePriceSchema
    ]
);

const EditFixedPriceSchema = FixedPriceSchema.extend({
    id: z.number().min(1, {
        message: "ID no válido"
    })
});

const EditVariablePriceSchema = VariablePriceSchema.extend({
    id: z.number().min(1, {
        message: "ID no válido"
    })
});

export const EditProductActionSchema = z.discriminatedUnion(
    "variable_price",
    [
        EditFixedPriceSchema,
        EditVariablePriceSchema
    ]
);
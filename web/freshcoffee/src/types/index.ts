import { z } from 'astro/zod' 

const ImageSchema = z.object({
  url: z.string().url(),
  width: z.number(),
  height: z.number(),
});

const FeaturedImageSchema = z.object({
  thumbnail: ImageSchema,
  medium: ImageSchema,
  medium_large: ImageSchema,
  large: ImageSchema,
  full: ImageSchema
});

const VariablePairSchema = z.object({
    price: z.coerce.number(),
    size: z.string()
})

export const VariablePriceSchema = z.object({
    variable_price: z.literal(true),
    variants: z.array(VariablePairSchema)
})

const FixedPriceSchema = z.object({
    variable_price: z.literal(false),
    price: z.coerce.number()
})

export const ProductPriceSchema = z.discriminatedUnion('variable_price',
    [VariablePriceSchema, FixedPriceSchema]
)

const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    acf: z.object({
        icon: z.string()
    })
})
export const CategoriesSchema = z.array(CategorySchema)
export type Category = z.infer<typeof CategorySchema>



export const ProductSchema = z.object({
    id: z.number(),
    slug: z.string(),
    title: z.object({
      rendered: z.string()
    }),
    featured_media: z.number(),
    featured_images: FeaturedImageSchema,
    acf: ProductPriceSchema,
    freshcoffee_category: z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string()
    })
})
export const ProductsSchema = z.array(ProductSchema)
export type Product = z.infer< typeof ProductSchema>

const ProductWithVariablePriceSchema = ProductSchema.extend({
    acf: VariablePriceSchema
})
export type ProductWithVariablePrice = z.infer<typeof ProductWithVariablePriceSchema>

export const UploadedImageSchema = z.object({
    id: z.number(),
    source_url: z.string()
})
export type UploadedImage = z.infer<typeof UploadedImageSchema>


/* Orders - Clients */
const SelectedProductSchema = z.object({
    id: z.number(),
    table: z.string(),
    name: z.string().min(1, {message: 'El nombre del producto es obligatorio'}),
    price: z.number().min(1, {message: 'Precio no válido'}),
    size: z.optional(z.string().min(1, {message: 'Tamaño no válido'})),
    variants: z.optional(z.array(
        z.object({
            size: z.string(),
            price: z.coerce.number()
        })
    ))
})
export type SelectedProduct = z.infer<typeof SelectedProductSchema>

export const OrderItemSchema = SelectedProductSchema.extend({
    quantity: z.number().min(1, {message: 'Cantidad no válida'}),
    subtotal: z.number().min(1, {message: 'Cantidad no válida'}),
    key: z.optional(z.string().min(1, {message: 'Cantidad no válida'}))
})
export type OrderItem = z.infer<typeof OrderItemSchema>

export const OrderContentSchema = z.object({
    id_order: z.number(),
    total_order: z.coerce.number(),
    status_order: z.string(),
    name_order: z.string(),
    phone_order: z.string(),
    payment_method_order: z.string(),
    payment_status_order: z.string(),
    delivery_method_order: z.string(),
    delivery_address_order: z.string(),
    items_order: z.string(),
    date_created_order: z.string(),
    date_updated_order: z.string()
})

export type OrderContent = z.infer<typeof OrderContentSchema>

export const SizesSchema = z.array(VariablePairSchema)

export type Sizes = z.infer<typeof SizesSchema>

export interface CMSProduct {
    id: number;
    title: string;
    image?: string;
    category?: string;
    category_url?: string;
    price?: string | number;
    table?: string;
}

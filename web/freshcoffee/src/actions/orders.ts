import { OrderItemSchema } from "@/types";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createOrder, updateOrderStatus } from "@/services/orders";

export const orders = {

    
     createOrder: defineAction({
    accept: 'json',
    input: z.object({
        name: z.string().min(1, { message: 'El nombre es obligatorio' }),
        order: z.array(OrderItemSchema)
    }),

    handler: async (input, ctx) => {

    const token = ctx.cookies.get("FRESHCOFFEE_TOKEN")?.value;

    if (!token) {
        throw new ActionError({
            message: "No hay token",
            code: "UNAUTHORIZED"
        });
    }

    const response = await createOrder(
        {
            name: input.name,
            order: input.order
        },
        token
    );

    return {
        message: "Pedido creado correctamente",
        response
    };
}
    
}), 

   updateStatus: defineAction({
            accept: 'json',
            input: z.object({
                status: z.string(),
                id: z.number()
            }),

            handler: async (input, ctx) => {

                
            try {

                

                const token = ctx.cookies.get('FRESHCOFFEE_TOKEN')?.value;

                    if (!token) {
                        throw new ActionError({
                            message: "No hay token",
                            code: "UNAUTHORIZED"
                        });
                    }

                    const response = await updateOrderStatus(
                        input.id,
                        input.status,
                        token
                    );

            

                return {
                    message: "Actualizado correctamente"
                };

            } catch (error) {

            

                throw error;

            }

        } 
       
    })
};




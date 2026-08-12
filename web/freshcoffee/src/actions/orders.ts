import { OrderItemSchema } from "@/types";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import {
    createOrder,
    updateOrderStatus
} from "@/services/orders";

import {
    createTestOrder
} from "@/services/test-orders";
import { verifySession } from "@/auth/dal";

export const orders = {

    createOrder: defineAction({
        accept: "json",

        input: z.object({

            name: z.string().min(1, {
                message: "El nombre es obligatorio"
            }),

            phone: z.string().min(1, {
                message: "El teléfono es obligatorio"
            }),

            deliveryMethod: z.enum([
                "pickup",
                "delivery"
            ]),

            deliveryLocality: z.string(),

            paymentMethod: z.enum([
                "cash",
                "card"
            ]),

            deliveryAddress: z.string(),

            order: z.array(OrderItemSchema),

            /*
             * =============================================
             * PEDIDO DE PRUEBA
             * =============================================
             */

            isTestOrder: z.boolean().optional().default(false),

            adminName: z.string().optional()

        }),

        handler: async (input, ctx) => {

            const token =
                ctx.cookies.get("FRESHCOFFEE_TOKEN")?.value;

            if (!token) {

                throw new ActionError({
                    message: "No hay token",
                    code: "UNAUTHORIZED"
                });

            }

            /*
             * =============================================
             * COMPROBAR SESIÓN
             * =============================================
             */

            const { user } =
                await verifySession(token);

            if (!user) {

                throw new ActionError({
                    message: "No hay token",
                    code: "UNAUTHORIZED"
                });

            }

            /*
             * =============================================
             * INVITADO
             * =============================================
             */

            if (token === "INVITADO") {

                throw new ActionError({
                    message: "INVITADO",
                    code: "UNAUTHORIZED"
                });

            }

            /*
             * =============================================
             * PEDIDO DE PRUEBA
             * =============================================
             */

            if (input.isTestOrder) {

                const allowedRoles = [
                    "superadmin",
                    "admin",
                    "editor"
                ];

                /*
                 * Solo administradores pueden crear
                 * pedidos de prueba.
                 */

                if (!allowedRoles.includes(user.role)) {

                    throw new ActionError({
                        message:
                            "No tienes permiso para crear pedidos de prueba",
                        code: "FORBIDDEN"
                    });

                }

                /*
                 * El administrador debe identificarse.
                 */

                if (!input.adminName?.trim()) {

                    throw new ActionError({
                        message:
                            "El nombre del administrador es obligatorio",
                        code: "BAD_REQUEST"
                    });

                }

                const response =
                    await createTestOrder(
                        {
                            adminName:
                                input.adminName.trim(),

                            phone:
                                input.phone,

                            deliveryMethod:
                                input.deliveryMethod,

                             deliveryLocality:
                                input.deliveryLocality,

                            paymentMethod:
                                input.paymentMethod,

                            deliveryAddress:
                                input.deliveryAddress,

                            order:
                                input.order
                        },
                        token
                    );

                return {

                    message:
                        "Pedido de prueba creado correctamente",

                    id_test_order:
                        response.results.lastId,

                    response

                };

            }

            /*
             * =============================================
             * PEDIDO NORMAL
             * =============================================
             *
             * Este bloque sigue siendo el mismo flujo
             * que utilizaba el cliente.
             */

            const response =
                await createOrder(
                    {
                        name: input.name,
                        phone: input.phone,
                        deliveryMethod:
                            input.deliveryMethod,
                        deliveryLocality:
                            input.deliveryLocality,

                        paymentMethod:
                            input.paymentMethod,
                        deliveryAddress:
                            input.deliveryAddress,
                        order:
                            input.order
                    },
                    token
                );

            return {

                message:
                    "Pedido creado correctamente",

                id_order:
                    response.results.lastId,

                response

            };
        }
    }),

    updateStatus: defineAction({

        accept: "json",

        input: z.object({

            status: z.string(),

            id: z.number()

        }),

        handler: async (input, ctx) => {

            try {

                const token =
                    ctx.cookies
                        .get("FRESHCOFFEE_TOKEN")
                        ?.value;

                if (!token) {

                    throw new ActionError({
                        message: "No hay token",
                        code: "UNAUTHORIZED"
                    });

                }

                await updateOrderStatus(
                    input.id,
                    input.status,
                    token
                );

                return {

                    message:
                        "Actualizado correctamente"

                };

            } catch (error) {

                throw error;

            }
        }
    })

};
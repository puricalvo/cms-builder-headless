import { ActionError, defineAction } from "astro:actions";
import { getTestOrders } from "@/services/test-orders";

export const testOrders = {

    getTestOrders: defineAction({

        accept: "json",

        handler: async (_input, ctx) => {

            const token =
                ctx.cookies.get("FRESHCOFFEE_TOKEN")?.value;

            if (!token) {

                throw new ActionError({
                    message: "No hay token",
                    code: "UNAUTHORIZED"
                });

            }

            const response =
                await getTestOrders(token);

            return response;
        }
    })
};
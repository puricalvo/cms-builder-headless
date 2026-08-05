import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";

const API_URL = import.meta.env.API_URL;
const API_KEY = import.meta.env.API_KEY;

export const redsys = {

    createPayment: defineAction({

        accept: "json",

        input: z.object({
            amount: z.number().positive()
        }),

        handler: async (input, ctx) => {

            /*
             * Comprobar que el cliente está autenticado
             */

            const token =
                ctx.cookies.get("FRESHCOFFEE_TOKEN")?.value;

            if (!token) {

                throw new ActionError({
                    message: "No hay token",
                    code: "UNAUTHORIZED"
                });

            }

            /*
             * Enviar JSON a nuestra API
             */

            try {

                const response = await fetch(
                    `${API_URL}redsys`,
                    {
                        method: "POST",

                        headers: {
                            "Authorization": API_KEY,
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            amount: input.amount
                        })
                    }
                );

                const text =
                    await response.text();

                /*
                 * El endpoint /redsys devuelve directamente
                 * el formulario HTML generado por la
                 * librería Redsys.
                 */

                if (!response.ok) {

                    throw new Error(
                        text ||
                        `Error ${response.status}`
                    );

                }

                if (!text) {

                    throw new Error(
                        "La API no ha devuelto el formulario Redsys"
                    );

                }

                /*
                 * Devolvemos el HTML a SubmitOrderForm.
                 */

                return {
                    status: 200,
                    paymentForm: text
                };

            } catch (error) {

                console.error(
                    "ERROR REAL REDSYS:",
                    error
                );

                throw new ActionError({
                    message:
                        error instanceof Error
                            ? error.message
                            : "Error desconocido al iniciar Redsys",
                    code: "INTERNAL_SERVER_ERROR"
                });

            }
        }
    })
};
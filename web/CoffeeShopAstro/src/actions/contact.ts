import { nullToEmptyString } from "@/helpers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { api } from "@/services/api";

export const contact = {
    sendEmail: defineAction({
        accept: "form",

        input: z.object({
            name: z.preprocess(
                nullToEmptyString,
                z.string().min(1, {
                    message: "El Nombre no puede ir vacío"
                })
            ),

            email: z.preprocess(
                nullToEmptyString,
                z.string()
                    .min(1, {
                        message: "El Email no puede ir vacío"
                    })
                    .email({
                        message: "Email no válido"
                    })
            ),

            subject: z.preprocess(
                nullToEmptyString,
                z.string().min(1, {
                    message: "El Asunto no puede ir vacío"
                })
            ),

            message: z.preprocess(
                nullToEmptyString,
                z.string().min(30, {
                    message: "El mensaje no puede ir vacío o es muy corto"
                })
            ),
        }),

        handler: async (input) => {

            console.log("CONTACT INPUT:", input);

            try {

                const response = await api(
                    "mensajes?token=no&except=email_mensaje",
                    "POST",
                    {
                        name_mensaje: input.name,
                        email_mensaje: input.email,
                        subject_mensaje: input.subject,
                        message_mensaje: input.message,
                        status_mensaje: "Pendiente"
                    }
                );

                console.log("CONTACT API RESPONSE:", response);

                return {
                    error: false,
                    message: "Tu mensaje se envió correctamente",
                    response
                };

            } catch (error) {

                console.error("CONTACT ERROR:", error);

                throw error;
            }
        }
    })
};
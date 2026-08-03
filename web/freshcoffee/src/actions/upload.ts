import { ActionError, defineAction } from "astro:actions";
import { uploadImage } from "@/services/upload";

export const upload = {
    uploadImage: defineAction({
        accept: "form",

        handler: async (input) => {

            const file = input.get("file") as File;

            if (!file) {
                throw new ActionError({
                    message: "No se recibió ningún archivo",
                    code: "BAD_REQUEST"
                });
            }

            try {

                const image = await uploadImage(file);

                return image;

            } catch (error) {

                throw new ActionError({
                    message: "Hubo un error al subir la imagen",
                    code: "BAD_REQUEST"
                });

            }

        }
    })
}
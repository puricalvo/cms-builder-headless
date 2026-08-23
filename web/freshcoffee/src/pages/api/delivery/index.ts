import type { APIRoute } from "astro";
import { getPage, getTable } from "@/services/pages";

export const GET: APIRoute = async () => {

    const page = await getPage("repartos");

    if (!page) {
        return new Response(
            JSON.stringify({
                error: "No se encontró la página repartos"
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    const content = await getTable("repartos");

    return new Response(
        JSON.stringify(content),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};
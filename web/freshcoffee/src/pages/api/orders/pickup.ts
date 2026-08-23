import type { APIRoute } from "astro";
import { getPickupOrders } from "@/services/orders";

export const GET: APIRoute = async ({ url }) => {

    const perPage = Number(
        url.searchParams.get("per_page") ?? "5"
    );

    const result = await getPickupOrders(perPage);

    return new Response(
        JSON.stringify(result.results ?? []),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};
import type { APIRoute } from "astro";
import { verifySession } from "@/auth/dal";


export const GET: APIRoute = async ({ params, cookies }) => {


    const token =
        cookies.get("FRESHCOFFEE_TOKEN")?.value ?? "";



    const { user } = await verifySession(token);



    if (!user) {

        return new Response(
            JSON.stringify({
                message: "No autorizado"
            }),
            {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }



    const allowedRoles = [
        "superadmin",
        "admin",
        "editor"
    ];



    if (!allowedRoles.includes(user.role)) {

        return new Response(
            JSON.stringify({
                message: "Sin permisos"
            }),
            {
                status: 403,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }



    const status = params.status;



    const res = await fetch(
        `${import.meta.env.API_URL}orders?linkTo=status_order&equalTo=${status}`,
        {
            headers: {
                Authorization: import.meta.env.API_KEY
            }
        }
    );



    const json = await res.json();



    return new Response(
        JSON.stringify(json.results ?? []),
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

};






import { nullToEmptyString } from "@/utils";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createCustomer } from "@/services/customers";

export const auth = {

    signInAsGuest: defineAction({
        handler: async (_, ctx) => {

           

            ctx.cookies.set("FRESHCOFFEE_TOKEN", "INVITADO", {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 30
            });

            return true;
        }
    }),

    register: defineAction({

    accept: "form",

    input: z.object({

        name_customer: z.string().min(1, {
            message: "El nombre es obligatorio"
        }),

        email_customer: z.string().email({
            message: "El email no es válido"
        }),

        password_customer: z.string().min(6, {
            message: "La contraseña debe tener mínimo 6 caracteres"
        })

    }),


    handler: async (input) => {

  

    const response = await createCustomer(input);

    

    return {
        message: "Cuenta creada correctamente",
        response
    };
}

}),


    signIn: defineAction({
        accept: "form",

        input: z.object({
            email_admin: z.preprocess(
                nullToEmptyString,
                z.string().min(1, {
                    message: "El Email no puede ir vacío"
                })
            ),

            password_admin: z.preprocess(
                nullToEmptyString,
                z.string().min(1, {
                    message: "El Password no puede ir vacío"
                })
            ),
        }),


        handler: async (input, ctx) => {

            const body = new URLSearchParams();

            body.append("email_admin", input.email_admin);
            body.append("password_admin", input.password_admin);

            

            const apiUrl = import.meta.env.API_URL.replace(/\/$/, "");

           

            const res = await fetch(
                `${apiUrl}/admins?login=true&suffix=admin`,
                {
                    method: "POST",
                    headers: {
                        Authorization: import.meta.env.API_KEY,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body
                }
            );



            const json = await res.json();

            if (json.status !== 200) {

                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: json.results
                });

            }


            const admin = json.results[0];


            ctx.cookies.set(
                "FRESHCOFFEE_TOKEN",
                admin.token_admin,
                {
                    httpOnly: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 30
                }
            );


            return {
                success: true,
                user: {
                    id: admin.id_admin,
                    email: admin.email_admin,
                    role: admin.rol_admin,
                    permissions: admin.permissions_admin
                }
            };

        }

    }),

    signInUser: defineAction({

    accept: "form",

    input: z.object({

        email: z.preprocess(
            nullToEmptyString,
            z.string().email({
                message: "Email incorrecto"
            })
        ),

        password: z.preprocess(
            nullToEmptyString,
            z.string().min(1, {
                message: "El password no puede ir vacío"
            })
        )

    }),


    handler: async (input, ctx) => {


        const apiUrl = import.meta.env.API_URL.replace(/\/$/, "");


        let response: any = null;


        // =========================
        // PRIMERO BUSCAMOS ADMIN
        // =========================

        try {

            const body = new URLSearchParams();

            body.append("email_admin", input.email);
            body.append("password_admin", input.password);


            const res = await fetch(
                `${apiUrl}/admins?login=true&suffix=admin`,
                {
                    method: "POST",
                    headers: {
                        Authorization: import.meta.env.API_KEY,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body
                }
            );


            const json = await res.json();


            if(json.status === 200) {

                const admin = json.results[0];


                ctx.cookies.set(
                    "FRESHCOFFEE_TOKEN",
                    admin.token_admin,
                    {
                        httpOnly: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 60 * 60 * 24 * 30
                    }
                );


                return {
                    success: true,
                    role: "admin"
                };

            }


        } catch {

            

        }



        // =========================
        // SI NO ES ADMIN
        // PROBAMOS CUSTOMER
        // =========================


        try {


            const body = new URLSearchParams();

            body.append("email_customer", input.email);
            body.append("password_customer", input.password);



            const res = await fetch(
                `${apiUrl}/customers?login=true&suffix=customer`,
                {
                    method: "POST",
                    headers: {
                        Authorization: import.meta.env.API_KEY,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body
                }
            );


            const json = await res.json();



            if(json.status === 200) {


                const customer = json.results[0];


                ctx.cookies.set(
                    "FRESHCOFFEE_TOKEN",
                    customer.token_customer,
                    {
                        httpOnly: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 60 * 60 * 24 * 30
                    }
                );


                return {
                    success: true,
                    role: "customer"
                };


            }



        } catch {

            

        }



        // =========================
        // NO ES NINGUNO
        // =========================


        return {
            success: false
        };


    }

}),


    signOut: defineAction({
        handler: (_, ctx) => {

            ctx.cookies.delete("FRESHCOFFEE_TOKEN", {
                path: "/",
            });

            return true;
        }
    })

};

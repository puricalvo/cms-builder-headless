import { api } from "@/services/api";


export async function verifySession(token: string) {

   


    if (!token) {
        return { user: null };
    }



    // ==========================
    // COMPROBAR ADMIN
    // ==========================

    try {

        const admin = await api(
            `admins?table=admins&suffix=admin`,
            "GET"
        );


        



        if (
            admin?.status === 200 &&
            admin?.results?.length
        ) {


            const data = admin.results.find(
                (admin: any) =>
                    admin.token_admin === token
            );



            if (data) {

                return {
                    user: {
                        id: data.id_admin,
                        role: data.rol_admin,
                        email: data.email_admin
                    }
                };

            }

        }


    } catch {

        

    }





    // ==========================
    // COMPROBAR CUSTOMER
    // ==========================

    try {


        const customer = await api(
            `customers?table=customers&suffix=customer`,
            "GET"
        );


        



        if (
            customer?.status === 200 &&
            customer?.results?.length
        ) {


            const data = customer.results.find(
                (customer: any) =>
                    customer.token_customer === token
            );



            if (data) {

                return {
                    user: {
                        id: data.id_customer,
                        role: "freshcoffee_customer",
                        email: data.email_customer
                    }
                };

            }

        }


    } catch {

        

    }

    return {
        user: null
    };

}
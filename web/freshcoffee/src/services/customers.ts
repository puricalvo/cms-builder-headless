import { api } from "./api";

type CreateCustomerData = {
    name_customer: string;
    email_customer: string;
    password_customer: string;
};


export async function createCustomer(data: CreateCustomerData) {

    return await api(
        "externas?table=customers&register=true&suffix=customer&suffix_module=customer",
        "POST",
        {
            name_customer: data.name_customer,
            email_customer: data.email_customer,
            password_customer: data.password_customer
        }
    );

}
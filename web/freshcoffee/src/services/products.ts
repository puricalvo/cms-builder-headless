import { getTable, getCategories } from "./pages";

export async function getProductById(table: string, id: number) {

    const products = await getTable(table);

    const product = products.find(
        (item: any) => item.id === id
    );

    if (!product) {
        return null;
    }

    const categories = await getCategories();

    const category = categories.find(
        (item: any) => item.table === table
    );

    let prices: any = [];

    try {

        prices =
            typeof product.price === "string"
                ? JSON.parse(product.price)
                : product.price;

    } catch {

        prices = product.price;

    }

    const isVariable =
        Array.isArray(prices) && prices.length > 1;

    const isSimple =
        Array.isArray(prices) && prices.length === 1;

    return {
        ...product,
        category_url: category?.url_page,
        table,

        variable_price: isVariable,

        variants: isVariable
            ? prices
            : [],

        price: isSimple
            ? Number(prices[0].price)
            : (!Array.isArray(prices) ? Number(prices) : product.price)
    };
}
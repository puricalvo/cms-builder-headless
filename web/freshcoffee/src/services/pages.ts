import { api } from "./api";
import { decode } from "./utils";

function decodeItem(item: any) {

    const result: any = {};

    for (const key in item) {

        const value = typeof item[key] === "string"
            ? decode(item[key])
            : item[key];

        result[key] = value;

        // Campos ID
        if (key.startsWith("id_")) {
            result.id = value;
        }

        // Títulos
        if (key.startsWith("title_")) {
            result.title = value;
        }

        // URLs de páginas
        if (key.startsWith("url_")) {
            result.url_page = value;
        }

        // Imágenes
        if (key.startsWith("image_")) {
            result.image = value;
        }

        // Precios
        if (key.startsWith("price_")) {
            result.price = value;
        }

        // Tipos de módulos/páginas
        if (key.startsWith("type_")) {
            result.type = value;
        }

        // Contenido
        if (key.startsWith("content_")) {
            result.content = value;
        }

        // Relación página
        if (key.startsWith("id_page_")) {
            result.page_id = value;
        }

        // Sufijo del módulo
        if (key.startsWith("suffix_")) {
            result.suffix = value;
        }

        

    }

    return result;

}

export async function getPage(url: string) {

    const json = await api(
        `pages?linkTo=url_page&equalTo=${encodeURIComponent(url)}`
    );

    if (json.status !== 200 || !json.results?.length) {
        return null;
    }

    return decodeItem(json.results[0]);

}

export async function getPages() {

    const json = await api("pages");

    if (json.status !== 200) {
        return [];
    }

    return (json.results ?? []).map(decodeItem);

}

export async function getModuleByPage(idPage: number) {

    const json = await api(
        `modules?linkTo=id_page_module&equalTo=${idPage}`
    );

    if (json.status !== 200 || !json.results?.length) {
        return null;
    }

    const modules = json.results.map(decodeItem);

    return modules.find(
        (module: any) => module.type === "tables"
    ) ?? null;

}
export async function getTable(table: string) {

    
    const json = await api(table);

    if (json.status !== 200) {
        return [];
    }

    return (json.results ?? []).map(decodeItem);

}

export async function getCategories() {

    const categories = await getTable("listas");
    const pages = await getPages();

    

    const parent = pages.find(
        (page: any) => page.url_page === "productos_freshcoffee"
    );

    if (!parent) {
        return categories;
    }

    const children = pages.filter(
        (page: any) =>
            page.parent_id_page === parent.id &&
            page.url_page !== "catalogo"
    );

    return await Promise.all(

        categories.map(async (category: any) => {

            const page = children.find(
                (p: any) =>
                    p.title_page.replace("Precios ", "") === category.title_lista
            );

            if (!page) {
                return category;
            }

            const module = await getModuleByPage(page.id);

            return {
                ...category,
                url_page: page.url_page,
                suffix: module?.suffix,
                table: module?.title
            }

        })

    );

}
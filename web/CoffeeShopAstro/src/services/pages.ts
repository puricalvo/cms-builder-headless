import { api } from "./api";

export async function getPage(url: string) {

    const json = await api(
        `pages?linkTo=url_page&equalTo=${encodeURIComponent(url)}`
    );

     

    if (json.status !== 200 || !json.results?.length) {
        return null;
    }

    return json.results[0];
}

export async function getPages() {

    const json = await api("pages");

    if (json.status !== 200) {
        return [];
    }

    return json.results ?? [];
}

export async function getTable(table: string) {

    const json = await api(table);

    if (json.status !== 200) {
        return [];
    }

    return json.results ?? [];

}
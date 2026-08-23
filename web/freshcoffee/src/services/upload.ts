export async function uploadImage(file: File) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${import.meta.env.API_URL}media`,
        {
            method: "POST",
            headers: {
                "Authorization": import.meta.env.API_KEY
            },
            body: formData,
        }
    );

    const data = await response.json();

    if (data.status !== 200) {

        throw new Error(
            data.results ?? "Error al subir la imagen"
        );

    }

    return data;

}
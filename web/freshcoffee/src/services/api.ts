const API_URL = import.meta.env.API_URL;
const API_KEY = import.meta.env.API_KEY;

export async function api(
  endpoint: string,
  method: string = "GET",
  body?: BodyInit | Record<string, any>
) {

  const options: RequestInit = {
    method,
    headers: {
      Authorization: API_KEY
    }
  };

  // Si enviamos un FormData, lo usamos directamente
  if (body instanceof FormData) {

    options.body = body;

  // Si es un objeto, lo convertimos en URLSearchParams
  } else if (body && typeof body === "object") {

    options.body = new URLSearchParams(body as Record<string, string>);

  // Si ya viene preparado (string, etc.)
  } else if (body) {

    options.body = body;

  }

  
 
   const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {

    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const text = await response.text();

  if (!text) {
    return {
      status: response.status
    };
  }

  return JSON.parse(text);
} 
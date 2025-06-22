import { url } from "../../config";

async function getImgFile(fileName) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${url}/getImg/${encodeURIComponent(fileName)}`,
      {
        method: "GET",
        headers: {
          // Incluir el token si la ruta está protegida
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Verificar que venga un blob y un content-type de imagen
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      throw new Error("El archivo recibido no es una imagen");
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl;
  } catch (error) {
    console.error("Error descargando el archivo:", error);
    throw error;
  }
}

export default getImgFile;

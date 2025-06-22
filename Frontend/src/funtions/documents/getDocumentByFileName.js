import { url } from "../../config";

const downloadFile = async (fileName) => {
    try {
      // Configuración de la solicitud para descargar el archivo
      const response = await fetch(`${url}/document/download/${fileName}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Convertir la respuesta a blob para manejar archivos binarios
      const blob = await response.blob();
      
      // Crear un enlace temporal para descargar el archivo
      const urlDoc = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlDoc;
      link.setAttribute('download', fileName); // Nombre del archivo a descargar
      document.body.appendChild(link);
      link.click();
      
      // Limpiar el enlace del DOM y revocar el objeto URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlDoc);
    } catch (error) {
      console.error('Error descargando el archivo:', error);
    }
  };

export default downloadFile;



/* import axios from "axios";
import { url } from "../../config";

const downloadFile = async (fileName) => {
    try {
      // Configuración de la solicitud para descargar el archivo
      const response = await axios.get(`${url}/document/download/${fileName}`, {
        responseType: 'blob' // Para manejar archivos binarios como PDF
      });
      
      // Crear un enlace temporal para descargar el archivo
      const urlDoc = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlDoc;
      link.setAttribute('download', fileName); // Nombre del archivo a descargar
      document.body.appendChild(link);
      link.click();

      // Limpiar el objeto URL
      window.URL.revokeObjectURL(urlDoc);
    } catch (error) {
      console.error('Error descargando el archivo:', error);
    }
  };

  export default downloadFile; */
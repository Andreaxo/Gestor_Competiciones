// src/functions/competitions/deleteCompetition.js
import { url } from "../../config";


async function deleteCompetition(idCompetition) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${url}/competitions/delete/${idCompetition}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    // lee el cuerpo de error como texto
    const errTxt = await response.text();
    throw new Error(`Error ${response.status}: ${errTxt}`);
  }

  // Detecta content-type
  const ct = response.headers.get("content-type") || "";
  let result;
  if (ct.includes("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  return result;
}

export default deleteCompetition;

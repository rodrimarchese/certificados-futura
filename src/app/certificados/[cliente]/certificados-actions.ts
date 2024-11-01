import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "";
const CLIENT_EMAIL = process.env.CLIENT_EMAIL || "";
const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").replace(/\\n/g, "\n");

export async function fetchClientData(cliente: string): Promise<string[][]> {
  const auth = new google.auth.JWT(CLIENT_EMAIL, undefined, PRIVATE_KEY, [
    "https://www.googleapis.com/auth/spreadsheets",
  ]);

  const sheets = google.sheets({ version: "v4", auth });
  const range = `${cliente}!A1:J17`;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    console.error(`Error fetching data for sheet ${cliente}:`, error);
    return [];
  }
}

interface FuturaData {
  companyName: string;
  phoneNumbers: string;
  email: string;
  website: string;
  instagram: string;
  pestControlRegistration: string;
  tankCleaningRegistration: string;
  certifications: string;
}

// Nueva función para obtener los datos de Futura
export async function fetchFuturaData(): Promise<FuturaData> {
  // Reutilizamos fetchClientData para obtener los valores de la hoja "Futura"
  const values = await fetchClientData("Futura");

  // Verificamos que se hayan obtenido al menos 8 filas
  if (values.length < 8) {
    throw new Error('No se encontraron suficientes datos en la hoja "Futura".');
  }

  // Mapeamos los valores obtenidos a las propiedades de FuturaData
  const futuraData: FuturaData = {
    companyName: values[0][0] || "",
    phoneNumbers: values[1][0] || "",
    email: values[2][0] || "",
    website: values[3][0] || "",
    instagram: values[4][0] || "",
    pestControlRegistration: values[5][0] || "",
    tankCleaningRegistration: values[6][0] || "",
    certifications: values[7][0] || "",
  };

  return futuraData;
}

import FuturaInfo from "./_components/FuturaInfo";
import { fetchClientData } from "./certificados-actions";

interface ClientePageProps {
  params: { cliente: string };
}

// Declaramos el componente como `async`
const ClientePage = async ({ params }: ClientePageProps) => {
  // Esperamos los datos de manera asíncrona

  const { cliente } = await params;

  const data = await fetchClientData(cliente);

  return (
    <div className="flex flex-col justify-content">
      <div className="mb-10 ">
        <FuturaInfo />
      </div>

      <p>Datos obtenidos de la hoja de Google Sheets:</p>
      <ul>
        {data.length > 0 ? (
          data.map((row, index) => <li key={index}>{row.join(", ")}</li>)
        ) : (
          <li>No hay datos disponibles para este cliente.</li>
        )}
      </ul>
    </div>
  );
};

export default ClientePage;

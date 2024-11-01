import { PageProps } from "../../../../.next/types/app/layout";
import FuturaInfo from "./_components/FuturaInfo";
import { fetchClientData } from "./certificados-actions";

interface ClienteData {
  obleaNumero: string;
  direccion: string;
  cliente: string;
  fechaServicio: string;
  fechaVencimiento: string;
  directorTecnico: string;
  matricula: string;
  personalActuante: string;
  cuit: string;
  productosUtilizados: Producto[];
}

interface Producto {
  denominacion: string;
  registroAnmat: string;
  composicion: string;
  laboratorio: string;
  metodologiaAplicacion: string;
}

function processClientData(data: string[][]): ClienteData {
  // Inicializamos el objeto con propiedades vacías
  const clienteData: ClienteData = {
    obleaNumero: "",
    direccion: "",
    cliente: "",
    fechaServicio: "",
    fechaVencimiento: "",
    directorTecnico: "",
    matricula: "",
    personalActuante: "",
    cuit: "",
    productosUtilizados: [],
  };

  // Variable para rastrear la fila actual
  let rowIndex = 0;

  // Mapear las propiedades simples
  clienteData.obleaNumero = data[rowIndex++][1] || "";
  clienteData.direccion = data[rowIndex++][1] || "";
  clienteData.cliente = data[rowIndex++][1] || "";
  clienteData.fechaServicio = data[rowIndex++][1] || "";
  clienteData.fechaVencimiento = data[rowIndex++][1] || "";
  clienteData.directorTecnico = data[rowIndex++][0] || "";
  clienteData.matricula = data[rowIndex++][0] || "";

  // Saltamos filas vacías si las hay
  while (
    data[rowIndex] &&
    data[rowIndex].every((cell) => cell?.trim() === "")
  ) {
    rowIndex++;
  }

  clienteData.personalActuante = data[rowIndex++][1] || "";
  clienteData.cuit = data[rowIndex++][1] || "";

  // Saltamos filas vacías hasta llegar a "Productos Utilizados"
  while (
    data[rowIndex] &&
    data[rowIndex][0]?.trim() !== "Productos Utilizados"
  ) {
    rowIndex++;
  }

  // Avanzamos una fila para empezar con los encabezados de los productos
  rowIndex++;

  // Obtenemos los encabezados de los productos
  const headers = [];
  headers.push(data[rowIndex++]); // Denominacion y marca
  headers.push(data[rowIndex++]); // Registro ANMAT
  headers.push(data[rowIndex++]); // Composicion
  headers.push(data[rowIndex++]); // Laboratorio
  headers.push(data[rowIndex++]); // Metodologia de Aplicacion

  // El número de productos es el número de columnas menos 1 (porque la primera columna es el título)
  const numProductos = headers[0].length - 1;

  // Construimos los productos
  for (let i = 1; i <= numProductos; i++) {
    const producto: Producto = {
      denominacion: headers[0][i] || "",
      registroAnmat: headers[1][i] || "",
      composicion: headers[2][i] || "",
      laboratorio: headers[3][i] || "",
      metodologiaAplicacion: headers[4][i] || "",
    };
    clienteData.productosUtilizados.push(producto);
  }

  return clienteData;
}

interface ClientePageProps extends PageProps {
  params: Promise<{ cliente: string }>;
}

const ClientePage = async ({ params }: ClientePageProps) => {
  const { cliente } = await params;

  const data = await fetchClientData(cliente);

  // Procesamos los datos
  const clienteData = processClientData(data);

  return (
    <div className="flex flex-col items-center p-6">
      <div className=" border-gray-300 rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div className="mb-10 w-full">
          <FuturaInfo />
        </div>

        <div className="w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
          <p>
            <strong>Oblea N°:</strong> {clienteData.obleaNumero}
          </p>
          <p>
            <strong>Dirección:</strong> {clienteData.direccion}
          </p>
          <p>
            <strong>Cliente:</strong> {clienteData.cliente}
          </p>
          <p>
            <strong>Fecha de Servicio:</strong> {clienteData.fechaServicio}
          </p>
          <p>
            <strong>Fecha de Vencimiento:</strong>{" "}
            {clienteData.fechaVencimiento}
          </p>
          <p>
            <strong>Director Técnico:</strong> {clienteData.directorTecnico}
          </p>
          <p>
            <strong>Matrícula:</strong> {clienteData.matricula}
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">
            Información Adicional
          </h2>
          <p>
            <strong>Personal Actuante:</strong> {clienteData.personalActuante}
          </p>
          <p>
            <strong>CUIT:</strong> {clienteData.cuit}
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Productos Utilizados</h2>
          {clienteData.productosUtilizados.length > 0 ? (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Denominación y Marca</th>
                  <th className="border px-4 py-2">Registro ANMAT</th>
                  <th className="border px-4 py-2">Composición</th>
                  <th className="border px-4 py-2">Laboratorio</th>
                  <th className="border px-4 py-2">
                    Metodología de Aplicación
                  </th>
                </tr>
              </thead>
              <tbody>
                {clienteData.productosUtilizados.map((producto, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      {producto.denominacion}
                    </td>
                    <td className="border px-4 py-2">
                      {producto.registroAnmat}
                    </td>
                    <td className="border px-4 py-2">{producto.composicion}</td>
                    <td className="border px-4 py-2">{producto.laboratorio}</td>
                    <td className="border px-4 py-2">
                      {producto.metodologiaAplicacion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay productos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientePage;

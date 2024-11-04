import { PageProps } from "../../../../.next/types/app/layout";
import FuturaInfo from "./_components/FuturaInfo";
import { fetchClientData } from "./certificados-actions";

interface ClienteData {
  obleaNumero: string;
  direccion: string;
  cliente: string;
  fechaServicio: string;
  fechaVencimiento: string;
  fechaProximoServicio: string;
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
    fechaProximoServicio: "",
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
  clienteData.fechaProximoServicio = data[rowIndex++][1] || "";
  clienteData.directorTecnico = data[rowIndex++][1] || "";
  clienteData.matricula = data[rowIndex++][1] || "";

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
    <div className="flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl border-gray-300 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-10 w-full">
          <FuturaInfo />
        </div>

        <div className="w-full">
          {/* make a box with important warning and showing fechaProximoServicio */}
          <div className="bg-yellow-600 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="text-base sm:text-lg">
              <strong>AVISO:</strong> El próximo servicio está programado para
              el <strong>{clienteData.fechaProximoServicio}</strong>.
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Información del Cliente
          </h2>
          <p className="text-base sm:text-lg">
            Oblea N°: <strong>{clienteData.obleaNumero}</strong>
          </p>
          <p className="text-base sm:text-lg">
            Dirección: <strong>{clienteData.direccion}</strong>
          </p>
          <p className="text-base sm:text-lg">
            Cliente: <strong>{clienteData.cliente}</strong>
          </p>
          <p className="text-base sm:text-lg">
            Fecha de Servicio: <strong>{clienteData.fechaServicio}</strong>
          </p>
          <p className="text-base sm:text-lg">
            Fecha de Vencimiento:{" "}
            <strong>{clienteData.fechaVencimiento}</strong>
          </p>
          <p className="text-lg sm:text-xl mt-5">
            Fecha de Próximo servicio:{" "}
            <strong>{clienteData.fechaProximoServicio}</strong>
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-6 mb-4">
            Información Adicional
          </h2>
          <p className="text-base sm:text-lg">
            Personal Actuante: <strong>{clienteData.personalActuante}</strong>
          </p>
          <p className="text-base sm:text-lg">
            CUIT: <strong>{clienteData.cuit}</strong>
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Productos Utilizados</h2>
          {clienteData.productosUtilizados.map((producto, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <p className="text-base sm:text-lg">
                Denominación y Marca: <strong>{producto.denominacion}</strong>
              </p>
              <p className="text-base sm:text-lg">
                Registro ANMAT: <strong>{producto.registroAnmat}</strong>
              </p>
              <p className="text-base sm:text-lg">
                Composición: <strong>{producto.composicion}</strong>
              </p>
              <p className="text-base sm:text-lg">
                Laboratorio: <strong>{producto.laboratorio}</strong>
              </p>
              <p className="text-base sm:text-lg">
                Metodología de Aplicación:{" "}
                <strong>{producto.metodologiaAplicacion}</strong>
              </p>
            </div>
          ))}

          <h2 className="text-2xl font-bold mt-6 mb-4">Director Técnico</h2>
          <p className="text-base sm:text-lg">
            <strong>{clienteData.directorTecnico}</strong>
          </p>
          <p className="text-base sm:text-lg">
            Matrícula: <strong>{clienteData.matricula}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientePage;

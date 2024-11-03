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
    <div className="flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl border-gray-300 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-10 w-full">
          <FuturaInfo />
        </div>

        <div className="w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Información del Cliente
          </h2>
          <p className="text-base sm:text-lg">
            <strong>Oblea N°:</strong> {clienteData.obleaNumero}
          </p>
          <p className="text-base sm:text-lg">
            <strong>Dirección:</strong> {clienteData.direccion}
          </p>
          <p className="text-base sm:text-lg">
            <strong>Cliente:</strong> {clienteData.cliente}
          </p>
          <p className="text-base sm:text-lg">
            <strong>Fecha de Servicio:</strong> {clienteData.fechaServicio}
          </p>
          <p className="text-base sm:text-lg">
            <strong>Fecha de Vencimiento:</strong>{" "}
            {clienteData.fechaVencimiento}
          </p>
          <p className="text-base sm:text-lg">
            <strong>Director Técnico:</strong> {clienteData.directorTecnico}
          </p>
          <p className="text-base sm:text-lg">
            <strong>Matrícula:</strong> {clienteData.matricula}
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-6 mb-4">
            Información Adicional
          </h2>
          <p className="text-base sm:text-lg">
            <strong>Personal Actuante:</strong> {clienteData.personalActuante}
          </p>
          <p className="text-base sm:text-lg">
            <strong>CUIT:</strong> {clienteData.cuit}
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-4">Productos Utilizados</h2>
          {clienteData.productosUtilizados.map((producto, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <p className="text-base sm:text-lg">
                <strong>Denominación y Marca:</strong> {producto.denominacion}
              </p>
              <p className="text-base sm:text-lg">
                <strong>Registro ANMAT:</strong> {producto.registroAnmat}
              </p>
              <p className="text-base sm:text-lg">
                <strong>Composición:</strong> {producto.composicion}
              </p>
              <p className="text-base sm:text-lg">
                <strong>Laboratorio:</strong> {producto.laboratorio}
              </p>
              <p className="text-base sm:text-lg">
                <strong>Metodología de Aplicación:</strong>{" "}
                {producto.metodologiaAplicacion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientePage;

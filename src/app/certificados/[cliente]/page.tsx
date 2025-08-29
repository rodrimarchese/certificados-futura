import { PageProps } from "../../../../.next/types/app/layout";
import FuturaInfo from "./_components/FuturaInfo";
import { fetchClientData } from "./certificados-actions";
import Image from "next/image";

interface ClienteData {
  obleaNumero: string;
  direccion: string;
  cliente: string;
  fechaServicio: string;
  fechaVencimiento: string;
  fechaProximoServicio: string;
  horaProximoServicio: string;
  fechasServiciosPasados: string[];
  directorTecnico: string;
  matricula: string;
  personalActuante: string;
  cuit: string;
  productosUtilizados: Producto[];
  logo: string;
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
    horaProximoServicio: "",
    fechasServiciosPasados: [],
    directorTecnico: "",
    matricula: "",
    personalActuante: "",
    cuit: "",
    logo: "",
    productosUtilizados: [],
  };

  // Usamos índices de fila específicos (las filas en Excel empiezan en 1, pero los arrays en 0)
  // Fila 1: Oblea Número
  clienteData.obleaNumero = data[0]?.[1] || "";
  // Fila 2: Dirección
  clienteData.direccion = data[1]?.[1] || "";
  // Fila 3: Cliente
  clienteData.cliente = data[2]?.[1] || "";
  // Fila 4: Fecha de Servicio
  clienteData.fechaServicio = data[3]?.[1] || "";
  // Fila 5: Fecha de Vencimiento
  clienteData.fechaVencimiento = data[4]?.[1] || "";
  // Fila 6: Fecha Próximo Servicio (columna B)
  clienteData.fechaProximoServicio = data[5]?.[1] || "";
  // Fila 6: Hora Próximo Servicio (columna C)
  clienteData.horaProximoServicio = data[5]?.[2] || "";
  // Fila 7: Director Técnico
  clienteData.directorTecnico = data[6]?.[1] || "";
  // Fila 8: Matrícula
  clienteData.matricula = data[7]?.[1] || "";
  // Fila 9: Personal Actuante
  clienteData.personalActuante = data[9]?.[1] || "";
  // Fila 10: CUIT
  clienteData.cuit = data[10]?.[1] || "";
  // Fila 20: Logo
  clienteData.logo = data[19]?.[1] || "";

  // Fila 19: Fechas de servicios pasados (columnas B, C, D)
  if (data[18] && data[18][0]?.trim() === "Fechas de servicios pasados") {
    clienteData.fechasServiciosPasados = [
      data[18][1] || "", // Columna B
      data[18][2] || "", // Columna C
      data[18][3] || "", // Columna D
    ];
  }

  // Buscamos la fila de "Productos Utilizados" (puede estar en diferentes posiciones)
  let productosRowIndex = 10; // Empezamos desde la fila 11
  while (
    productosRowIndex < data.length &&
    data[productosRowIndex] &&
    data[productosRowIndex][0]?.trim() !== "Productos Utilizados"
  ) {
    productosRowIndex++;
  }

  // Si encontramos "Productos Utilizados", procesamos los productos
  if (
    productosRowIndex < data.length &&
    data[productosRowIndex] &&
    data[productosRowIndex][0]?.trim() === "Productos Utilizados"
  ) {
    // Avanzamos una fila para empezar con los encabezados
    productosRowIndex++;

    // Obtenemos los encabezados de los productos
    const headers = [];
    headers.push(data[productosRowIndex++]); // Denominacion y marca
    headers.push(data[productosRowIndex++]); // Registro ANMAT
    headers.push(data[productosRowIndex++]); // Composicion
    headers.push(data[productosRowIndex++]); // Laboratorio
    headers.push(data[productosRowIndex++]); // Metodologia de Aplicacion

    // Verificamos que los encabezados existan antes de procesar productos
    if (headers[0] && Array.isArray(headers[0]) && headers[0].length > 1) {
      // El número de productos es el número de columnas menos 1 (porque la primera columna es el título)
      const numProductos = headers[0].length - 1;

      // Construimos los productos
      for (let i = 1; i <= numProductos; i++) {
        const producto: Producto = {
          denominacion: headers[0][i] || "",
          registroAnmat: headers[1]?.[i] || "",
          composicion: headers[2]?.[i] || "",
          laboratorio: headers[3]?.[i] || "",
          metodologiaAplicacion: headers[4]?.[i] || "",
        };
        clienteData.productosUtilizados.push(producto);
      }
    }
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
        <div className="mb-4 w-full">
          <FuturaInfo />
        </div>

        {clienteData.logo && clienteData.logo !== "ninguno" && (
          <div className="w-full flex justify-center items-center my-5">
            <Image
              src={`/logos/${clienteData.logo}.webp`}
              alt="Logo"
              width={256}
              height={256}
              className="max-w-64 w-auto"
            />
          </div>
        )}

        <div className="w-full">
          {/* make a box with important warning and showing fechaProximoServicio */}
          <div className="bg-yellow-600 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="text-base sm:text-lg">
              <strong>AVISO:</strong> El próximo servicio está programado para
              el <strong>{clienteData.fechaProximoServicio}</strong> a las{" "}
              <strong>{clienteData.horaProximoServicio} hs</strong>.
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
            <strong>{clienteData.fechaProximoServicio}</strong> a las{" "}
            <strong>{clienteData.horaProximoServicio} hs</strong>
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

          {clienteData.fechasServiciosPasados.length > 0 && (
            <div className="mt-5">
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                Fechas de Servicios Pasados:
              </h3>
              <ul className="list-disc list-inside">
                {clienteData.fechasServiciosPasados.map((fecha, index) => (
                  <li key={index} className="text-base sm:text-lg mb-2">
                    <strong>{fecha}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientePage;

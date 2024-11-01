// Importamos la función fetchFuturaData

import { fetchFuturaData } from "../certificados-actions";
import Image from "next/image";

const FuturaInfo = async () => {
  const data = await fetchFuturaData();

  return (
    <div>
      <Image src="/logofutura.png" alt="Logo" width={300} height={300} />
      <h1>{data.companyName}</h1>
      <p>
        <strong>Teléfonos:</strong> {data.phoneNumbers}
      </p>
      <p>
        <strong>Email:</strong> {data.email}
      </p>
      <p>
        <strong>Sitio web:</strong> {data.website}
      </p>
      <p>
        <strong>Instagram:</strong> {data.instagram}
      </p>
      <p>
        <strong>Registro Control de Plagas:</strong>{" "}
        {data.pestControlRegistration}
      </p>
      <p>
        <strong>Registro Limpieza de Tanques:</strong>{" "}
        {data.tankCleaningRegistration}
      </p>
      <h1>{data.certifications}</h1>
    </div>
  );
};

export default FuturaInfo;

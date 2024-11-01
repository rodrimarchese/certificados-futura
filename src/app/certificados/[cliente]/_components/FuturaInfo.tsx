// Importamos la función fetchFuturaData
import { fetchFuturaData } from "../certificados-actions";
import Image from "next/image";

const FuturaInfo = async () => {
  const data = await fetchFuturaData();

  return (
    <div className="flex flex-col items-center p-6">
      <Image
        src="/logofutura2.jpeg"
        alt="Logo"
        width={400}
        height={400}
        className="mb-6"
      />
      <h1 className="mt-4 text-4xl font-bold text-center">
        {data.companyName}
      </h1>
      <div className="mt-6 w-full max-w-xl">
        <p className="mb-4 text-lg">
          {/* <strong>Teléfonos:</strong> */}
          {data.phoneNumbers}
        </p>
        <p className="mb-4 text-lg">
          <strong>Email:</strong>
          {data.email}
        </p>
        <p className="mb-4 text-lg">
          <strong>Sitio web:</strong> {data.website}
        </p>
        <p className="mb-4 text-lg">
          <strong>Instagram:</strong> {data.instagram}
        </p>
        <p className="mb-4 text-lg">
          <strong>Registro Control de Plagas:</strong>{" "}
          {data.pestControlRegistration}
        </p>
        <p className="mb-4 text-lg">
          <strong>Registro Limpieza de Tanques:</strong>{" "}
          {data.tankCleaningRegistration}
        </p>
      </div>
      <h1 className="mt-10 text-3xl font-semibold text-center">
        {data.certifications}
      </h1>
    </div>
  );
};

export default FuturaInfo;

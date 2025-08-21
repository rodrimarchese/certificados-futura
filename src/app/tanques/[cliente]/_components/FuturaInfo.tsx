// FuturaInfo.tsx

import { fetchFuturaData } from "../tanques-actions";
import Image from "next/image";

const FuturaInfo = async () => {
  const data = await fetchFuturaData();

  return (
    <div className="flex flex-col items-center lg:items-start">
      <Image
        src="/logofutura2.jpeg"
        alt="Logo"
        width={200}
        height={200}
        className="mb-4 sm:mb-6"
      />
      <h1 className="mt-2 sm:mt-4 text-2xl sm:text-4xl font-bold text-center lg:text-left">
        {data.companyName}
      </h1>
      <div className="mt-4 sm:mt-6 w-full">
        <div className="border border-gray-300 rounded-lg shadow-md p-4">
          <p className="mb-2 sm:mb-4 text-base sm:text-lg">
            Teléfonos: <strong>{data.phoneNumbers}</strong>
          </p>
          <p className="mb-2 sm:mb-4 text-base sm:text-lg">
            Email: <strong>{data.email}</strong>
          </p>
          <p className="mb-2 sm:mb-4 text-base sm:text-lg">
            Sitio web: <strong>{data.website}</strong>
          </p>
          <p className="mb-2 sm:mb-4 text-base sm:text-lg">
            Instagram: <strong>{data.instagram}</strong>
          </p>
          <p className="mb-2 sm:mb-4 text-base sm:text-lg">
            Registro Control de Plagas:{" "}
            <strong>{data.pestControlRegistration}</strong>
          </p>
          <p className="mb-2 sm:mb-4 text-base sm:text-lg">
            Registro Limpieza de Tanques:{" "}
            <strong>{data.tankCleaningRegistration}</strong>
          </p>
        </div>
      </div>
      <h1 className="mt-6 sm:mt-10 text-xl sm:text-3xl font-semibold text-center lg:text-left">
        {data.certifications}
      </h1>
    </div>
  );
};

export default FuturaInfo;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Tras quitar package-lock.json de la carpeta padre (Profile), Turbopack ya no
     confunde la raíz del workspace. Si el aviso vuelve, define aquí:
     experimental: { turbo: { root: "..." } } según la doc de tu versión de Next. */
};

export default nextConfig;

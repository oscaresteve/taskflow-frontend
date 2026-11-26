import { RealtimeBridge } from "@/components/realtime/realtime-bridge";

// Unico punto de montaje del puente: queda por debajo de QueryProvider y cubre toda ruta
// autenticada, que son las unicas que tienen sesion con la que abrir el socket.
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RealtimeBridge />
      {children}
    </>
  );
}

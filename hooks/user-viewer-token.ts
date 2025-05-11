import { toast } from "sonner";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { createViewerToken } from "@/actions/token";

interface DecodedToken {
  name?: string;
  metadata?: string; // contiene tu identidad personalizada
}

export const useViewerToken = (hostIdentity: string) => {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");

  useEffect(() => {
    const createToken = async () => {
      try {
        const viewerToken = await createViewerToken(hostIdentity);
        setToken(viewerToken);

        const decodedToken = jwtDecode<DecodedToken>(viewerToken);

        if (decodedToken.name) {
          setName(decodedToken.name);
        }

        if (decodedToken.metadata) {
          const metadata = JSON.parse(decodedToken.metadata);
          if (metadata.customIdentity) {
            setIdentity(metadata.customIdentity);
          }
        }
      } catch (error) {
        toast.error("No se pudo crear el token");
      }
    };

    createToken();
  }, [hostIdentity]);

  return {
    token,
    name,
    identity,
  };
};

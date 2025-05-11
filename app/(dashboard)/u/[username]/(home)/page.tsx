import { StreamPlayer } from "@/components/stream-player";
import { getUserByUsername } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs/server";

interface CreatorPageProps {
  params: {
    username: string;
  };
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  // Asegúrate de que los parámetros sean resueltos antes de usarlos
  const { username } = await params;

  // Obtener el usuario autenticado
  const externalUser = await currentUser();

  // Esperar la obtención del usuario por nombre de usuario
  const user = await getUserByUsername(username);

  // Verificar si el usuario está autorizado
  if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="h-full">
      <StreamPlayer user={user} stream={user.stream} isFollowing />
    </div>
  );
};

export default CreatorPage;

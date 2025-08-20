// app/users/[username]/page.tsx
import { notFound } from "next/navigation";

type Props = {
  params: {
    userId: string;
  };
};

export default function UserPage({ params }: Props) {
  const { userId } = params;

  const users = ["123", "maria", "ana"];
  const userExists = users.includes(userId.toLowerCase());

  if (!userExists) {
    notFound();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Perfil de {userId}</h1>
      <p>Informações públicas sobre o usuário {userId}</p>
    </div>
  );
}

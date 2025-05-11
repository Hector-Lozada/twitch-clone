import { getSelfByUsername } from "@/lib/auth-service";
import { redirect } from "next/navigation";
import Navbar from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { Container } from "./_components/container";

interface CreatorLayoutProps {
  params: { username: string };
  children: React.ReactNode;
}

const CreatorLayout = async ({ params, children }: CreatorLayoutProps) => {
  try {
    // Destructure params directly (no await needed)
    const { username } = params;

    // Get user asynchronously
    const self = await getSelfByUsername(username);

    if (!self) {
      redirect("/");
    }

    return (
      <>
        <Navbar />
        <div className="flex h-full pt-20">
          <Sidebar />
          <Container>{children}</Container>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in CreatorLayout:", error);
    redirect("/");
  }
};

export default CreatorLayout;
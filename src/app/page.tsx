import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { LandingPage } from "@/app/_components/landing-page";

export default async function Page() {

  return (
      <main className="max-w-screen-xl m-auto">
        <LandingPage />
      </main>
  );
}

import { redirect } from 'next/navigation'
import { auth } from "@/server/auth";
import { HeroSection } from "@/app/_components/auth/hero-section";
import { CompleteForm } from "@/app/_components/auth/complete/complete-form";

export default async function Page() {

    const session = await auth();
    if (session) {
        if (session.user.userType) {
            redirect('/');
        }
    }

    return (
        <HeroSection title="Join CareerFit AI – Where Talent and Opportunity Meet" description="Create an account to access AI-driven tools that connect job seekers with ideal roles and employers with the perfect candidates. Your next great opportunity or hire is just a step away." Form={CompleteForm} />
    );
}

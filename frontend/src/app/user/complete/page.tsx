'use client'

import { HeroSection } from "@/app/_components/auth/hero-section";
import { CompleteForm } from "@/app/_components/auth/complete/complete-form";

export default function Page() {

    return (
        <HeroSection title="Join CareerFit AI – Where Talent and Opportunity Meet" description="Create an account to access AI-driven tools that connect job seekers with ideal roles and employers with the perfect candidates. Your next great opportunity or hire is just a step away." Form={CompleteForm} />
    );
}

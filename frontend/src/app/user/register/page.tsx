'use client'

import { redirect } from 'next/navigation'
import { HeroSection } from "@/app/_components/auth/hero-section";
import { RegisterForm } from "@/app/_components/auth/register/register-form";
import useAuth from '@/app/_components/global/useAuth';

export default function Page() {

    const { isAuthenticated, user, loading } = useAuth();
    if (!loading && isAuthenticated && !user.userType) {
        redirect('/user/complete');
    }

    return (
        <HeroSection title="Join CareerFit AI – Where Talent and Opportunity Meet" description="Create an account to access AI-driven tools that connect job seekers with ideal roles and employers with the perfect candidates. Your next great opportunity or hire is just a step away." Form={RegisterForm} />
    );
}

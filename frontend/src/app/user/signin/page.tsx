'use client'

import { redirect } from 'next/navigation'
import { HeroSection } from "@/app/_components/auth/hero-section";
import { SigninForm } from "@/app/_components/auth/signin/signin-form";
import useAuth from '@/app/_components/global/useAuth';

export default function Page() {

    const { isAuthenticated, user, loading } = useAuth();
    if (!loading && isAuthenticated && !user.userType) {
        redirect('/user/complete');
    }

    return (
        <HeroSection title="Welcome Back to CareerFit AI" description="Sign in to continue your journey with personalized job matches, insights, and connections tailored just for you. Employers and job seekers, let's pick up where we left off." Form={SigninForm} />
    );
}

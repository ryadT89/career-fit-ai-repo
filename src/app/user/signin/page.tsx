import { redirect } from 'next/navigation'
import { auth } from "@/server/auth";
import { HeroSection } from "@/app/_components/auth/hero-section";
import { SigninForm } from "@/app/_components/auth/signin/signin-form";

export default async function Page() {

    const session = await auth();
    if (session) {
        if (session.user.userType){
            redirect('/');
        } else {
            redirect('/user/complete');
        }
    }

    return (
        <HeroSection title="Welcome Back to CareerFit AI" description="Sign in to continue your journey with personalized job matches, insights, and connections tailored just for you. Employers and job seekers, let's pick up where we left off." Form={SigninForm} />
    );
}

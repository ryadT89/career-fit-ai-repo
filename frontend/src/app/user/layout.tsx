'use client'

import { Navbar } from "@/app/_components/global/navbar";
import { redirect } from "next/navigation";
import useAuth from "@/app/_components/global/useAuth";

export default function RecruiterLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {

    const { isAuthenticated, user, loading } = useAuth();

    if (!loading && isAuthenticated) {
        if (user.userType === 'Recruiter') {
            redirect('/recruiter/my-offers');
        } else if (user.userType === 'Candidate') {
            redirect('/candidate/job-offers');
        }
    }

    return (
        <main className="max-w-screen-xl m-auto">
            <Navbar />
            {children}
        </main>
    )
}
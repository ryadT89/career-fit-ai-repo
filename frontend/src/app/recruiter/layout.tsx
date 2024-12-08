'use client'

import { Navbar, Sidebar } from '@/app/_components/recruiter';
import { redirect } from 'next/navigation';
import useAuth from '../_components/global/useAuth';
import ChatAssistant from '../_components/global/chat';

export default function RecruiterLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {

    const { isAuthenticated, user, loading } = useAuth();

    if (!loading) {
        if (!isAuthenticated || !user.userType) {
            redirect('/user/signin');
        }

        if (user.userType === 'Candidate') {
            redirect('/candidate/job-offers');
        }
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full grid grid-rows-8 h-screen py-4 px-8">
                <Navbar />
                {children}
            </div>
            <ChatAssistant />
        </div>
    )
}
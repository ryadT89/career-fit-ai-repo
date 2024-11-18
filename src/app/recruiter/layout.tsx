import { Navbar, Sidebar } from '@/app/_components/recruiter';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function RecruiterLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {

    const session = await auth();
    if (!session || !session.user.userType) {
        redirect('/user/signin');
    }

    if (session.user.userType === 'Candidate') {
        redirect('/candidate/job-offers');
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full grid grid-rows-8 h-screen py-4 px-8">
                <Navbar />
                {children}
            </div>
        </div>
    )
}
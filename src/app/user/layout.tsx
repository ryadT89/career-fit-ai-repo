import { Navbar } from "@/app/_components/global/navbar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function RecruiterLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {

    const session = await auth();

    if (session?.user.userType === 'Recruiter') {
        redirect('/recruiter/my-offers');
    } else if (session?.user.userType === 'Candidate') {
        redirect('/candidate/job-offers');
    }

    return (
        <main className="max-w-screen-xl m-auto">
            <Navbar />
            {children}
        </main>
    )
}
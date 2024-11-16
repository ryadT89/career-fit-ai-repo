import { Navbar } from "@/app/_components/global/navbar";

export default function RecruiterLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <main className="max-w-screen-xl m-auto">
            <Navbar />
            {children}
        </main>
    )
}
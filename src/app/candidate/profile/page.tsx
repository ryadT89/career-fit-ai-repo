import { Profile } from "@/app/_components/candidate/profile"
import { auth } from "@/server/auth"
import { redirect } from "next/navigation"

export default async function Page() {

    const session = await auth();
    if (!session) {
        redirect('/user/signin');
    }

    return <Profile />
}
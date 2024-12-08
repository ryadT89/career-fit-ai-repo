import { use, useEffect, useState } from "react";
import { getResume } from "../global/fileService";
import { HiDocumentSearch } from "react-icons/hi";

export function ResumeButton({userId}: {userId: string}) {

    const [resume, setResume] = useState<any>(null);
    const fetchResume = async () => {
        setResume(await getResume(userId));
    }

    useEffect(() => {
        fetchResume();
    }, [userId]);

    return (
        <a href={resume} className="flex w-fit gap-2 text-lg mb-4 items-center bg-neutral text-white px-4 rounded-full cursor-pointer">
            <HiDocumentSearch /> Check Resume
        </a>
    );
}
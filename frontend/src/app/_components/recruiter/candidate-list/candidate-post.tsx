import { useState } from "react";
import { ProfilePicture } from "../../global/profile-picture";
import { getProfilePicture } from "../../global/fileService";

export function CandidatePost({ name, email, location, experience, userId }: { name: string, email: string, location: string, experience: number, userId: string }) {

    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    }

    const [image, setImage] = useState<string | null>(null);

    const getImage = async () => {
        setImage(await getProfilePicture(userId));
    }

    getImage();

    return (
        <div className="shadow-lg flex flex-col items-center rounded-xl p-4 cursor-pointer hover:bg-gray-50">
            <ProfilePicture className='w-20 h-20' src={image || ''} />
            <p className="text-lg font-bold mb-1">{name}</p>
            <p className="text-lg text-gray-500 mb-1">{location}</p>
            <p className="text-sm text-gray-500 mb-2">{email}</p>
            <div className="text-sm text-gray-500">{experience} {experience === 1 ? 'year' : 'years'} of experience</div>
        </div>
    )
}
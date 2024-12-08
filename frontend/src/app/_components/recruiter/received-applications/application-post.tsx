import { formatDistance } from 'date-fns';
import { ProfilePicture } from '../../global/profile-picture';
import { getProfilePicture } from '../../global/fileService';
import { useState } from 'react';

export function ApplicationPost({ title, description, applicationStatus, user, userId, time }: { title: string, description: string, applicationStatus: string, user: string, userId: string, time: number}) {

    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    }

    const relativeTime = formatDistance(new Date(time * 1000), new Date(), { addSuffix: true });

    var color = "";
    switch (applicationStatus) {
        case "applied":
            color = "bg-info";
            break;
        case "accepted":
            color = "bg-success";
            break;
        case "rejected":
            color = "bg-error";
            break;
    }

    const [image, setImage] = useState<string>();
    const getImage = async () => {
        setImage(await getProfilePicture(userId));
    }

    getImage();

    return (
        <div className="shadow-lg rounded-xl p-4 cursor-pointer hover:bg-gray-50">
            <h1 className="text-lg font-bold mb-2">{title}</h1>
            <p className="text-sm text-gray-500 text-ellipsis mb-4">{truncate(description, 100)}</p>
            <div className={`rounded-full ${color} w-fit mb-4 text-white px-2`}>{applicationStatus}</div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ProfilePicture className='w-6 h-6' src={image || ''} />
                    <div className="text-sm font-bold">{user}</div>
                </div>
                <div className="text-sm text-gray-500">{relativeTime}</div>
            </div>
        </div>
    )
}
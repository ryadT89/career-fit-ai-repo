import { formatDistance } from 'date-fns';
import { ProfilePicture } from '../global/profile-picture';
import { useState } from 'react';
import { getProfilePicture } from '../global/fileService';

export function Post({title, description, jobStatus, user, userId, time}: {title: string, description: string, jobStatus: string, user: string, userId: string, time: number}) {

    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    }

    const relativeTime = formatDistance(new Date(time * 1000), new Date(), { addSuffix: true });

    const [image, setImage] = useState<string>();
    const getImage = async () => {
        setImage(await getProfilePicture(userId));
    }

    getImage();

    return (
        <div className="shadow-lg rounded-xl p-4 cursor-pointer hover:bg-gray-50">
            <h1 className="text-lg font-bold pb-4">{title}</h1>
            <p className="text-sm text-gray-500 text-ellipsis mb-2">{truncate(description, 100)}</p>
            { jobStatus === "open" ?
                <div className="rounded-full bg-success w-fit mb-4 text-white px-2">{jobStatus}</div>
                :
                <div className="rounded-full bg-error w-fit mb-4 text-white px-2">{jobStatus}</div>
            }
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ProfilePicture className='w-8 h-8' src={image || ''} />
                    <div className="text-sm font-bold">{user}</div>
                </div>
                <div className="text-sm text-gray-500">{relativeTime}</div>
            </div>
        </div>
    )
}
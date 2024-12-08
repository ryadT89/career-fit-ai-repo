import { formatDistance } from 'date-fns';
import { ProfilePicture } from '../../global/profile-picture';
import { useState } from 'react';
import { getProfilePicture } from '../../global/fileService';

export function InvitationPost({ userId, recruiterName, message, time}: { userId: string, recruiterName: string, message: string, time: number }) {

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
            <div className='flex gap-1 items-center'>
                <ProfilePicture className='w-6 h-6' src={image || ''} />
                <h1 className="text-lg font-bold">{recruiterName}</h1>
            </div>
            <p className="text-sm text-gray-500 text-ellipsis mb-2">{truncate(message, 100)}</p>
            <div className="text-sm text-gray-500">{relativeTime}</div>
        </div>
    )
}
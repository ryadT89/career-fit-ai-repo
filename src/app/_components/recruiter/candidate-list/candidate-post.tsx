import { ProfilePicture } from "../../global/profile-picture";

export function CandidatePost({ name, email, location, experience, image }: { name: string, email: string, location: string, experience: number, image: string }) {

    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    }

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
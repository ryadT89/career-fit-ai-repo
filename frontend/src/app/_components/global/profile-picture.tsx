import { HiUserCircle } from "react-icons/hi";

export function ProfilePicture({ className, src}: { className?: string, src?: string }) {
    return (
        <>
            {src !== '' ? 
                <img src={src} alt='Profile Picture' className={`${className} object-cover rounded-full`} /> 
            :
                <HiUserCircle className={className}/>
            }
        </>
    )
}
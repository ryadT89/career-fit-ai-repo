'use client'

import { HiLogout, HiUser } from 'react-icons/hi';
import { ProfilePicture } from '../global/profile-picture';
import useSignout from '../global/useSignout';
import useAuth from '../global/useAuth';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getProfilePicture } from '../global/fileService';

export function Navbar() {

    const signout = useSignout();

    const handleLogout = () => {
        signout();
        window.location.reload();
    }

    const { user, loading } = useAuth();
    const [userData, setUserData] = useState({} as any);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const fetchUserData = async () => {
        await axios.get(`http://localhost:8000/user/${user.id}`).then(response => {
            setUserData(response.data);
        }).catch(error => {});
    }

    useEffect(() => {
        if (!loading) {
            fetchUserData();
            const loadImage = async () => {
                setProfileImage(await getProfilePicture(user.id) || null);
            }
            loadImage();
        }
    }, [loading]);

    return (
        <div className='flex h-16 justify-end w-full items-center gap-4 pb-4'>
            {/* <div className='btn bg-base-content text-white rounded-full'>
                <HiBell className='text-3xl' />
            </div> */}
            <div className="dropdown">
                <div tabIndex={0} className="btn bg-base-content text-white rounded-full">
                    <ProfilePicture className='w-8 h-8' src={ profileImage || ''} />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] right-4 w-52 p-2 shadow">
                    <li>
                        <a href="/candidate/profile" className='btn btn-ghost'> <HiUser /> Profile</a>
                    </li>
                    <li>
                        <a onClick={handleLogout} className='btn btn-ghost'> <HiLogout /> Logout </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
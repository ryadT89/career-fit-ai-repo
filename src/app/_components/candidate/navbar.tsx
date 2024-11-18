'use client'

import { HiBell, HiLogout, HiUser, HiUserCircle } from 'react-icons/hi';
import { signOut } from 'next-auth/react';
import { ProfilePicture } from '../global/profile-picture';
import { api } from '@/trpc/react';
import { useSession } from 'next-auth/react';

export function Navbar() {

    const handleLogout = () => {
        signOut({ redirect: false });
        window.location.reload();
    }

    const { data: session } = useSession();
    const { data: userData } = api.user.getUserById.useQuery({
        id: session?.user.id || ''
    });

    return (
        <div className='flex h-16 justify-end w-full items-center gap-4 pb-4'>
            {/* <div className='btn bg-base-content text-white rounded-full'>
                <HiBell className='text-3xl' />
            </div> */}
            <div className="dropdown">
                <div tabIndex={0} className="btn bg-base-content text-white rounded-full">
                    <ProfilePicture className='w-8 h-8' src={userData?.image || ''} />
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
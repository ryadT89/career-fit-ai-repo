import { HiBell, HiLogout, HiUser, HiUserCircle } from 'react-icons/hi';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function Navbar() {

    const router = useRouter();
    const handleLogout = () => {
        signOut({ redirect: false });
        router.push('/user/signin');
    }

    return (
        <div className='flex h-16 justify-end w-full items-center gap-4 pb-4'>
            <div className='btn bg-base-content text-white rounded-full'>
                <HiBell className='text-3xl' />
            </div>
            <div className="dropdown">
                <div tabIndex={0} className="btn bg-base-content text-white rounded-full">
                    <HiUserCircle className='text-4xl' />
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
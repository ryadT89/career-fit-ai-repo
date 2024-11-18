'use client'

import { HiClipboardList, HiDocumentDuplicate, HiInbox } from 'react-icons/hi';
import { useRef } from 'react';

export function Sidebar() {

    return (
        <div className="w-28 lg:w-80 h-screen fix">
            <div className="flex justify-between flex-col h-full p-4 bg-base-content shadow-md rounded-r-3xl text-white">
                <a href="/" className="text-2xl text-center font-bold mb-20">
                    <h1 className='hidden lg:inline'>CareerFit AI</h1>
                    <h1 className='lg:hidden text-lg'>CFAI</h1>
                    <p className='text-sm font-normal'>
                        Discover your career path
                    </p>
                </a>
                <div className='flex flex-col gap-2'>
                    <a href="/candidate/job-offers" className='btn btn-white w-full rounded-2xl'>
                        <HiClipboardList className='text-xl' /><span className='hidden lg:inline'>Job Offers</span>
                    </a>
                    <a href="/candidate/my-applications" className='btn btn-white w-full rounded-2xl'>
                        <HiDocumentDuplicate className='text-xl' /><span className='hidden lg:inline'>My Applications</span>
                    </a>
                    <a href="/candidate/received-invitations" className='btn btn-white w-full rounded-2xl'>
                        <HiInbox className='text-xl' /><span className='hidden lg:inline'>Received Invitations</span>
                    </a>
                </div>
                <p className='text-center mt-20 text-sm lg:text-md'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    <span className='block mt-4'>
                        © 2024 CareerFit AI
                    </span>
                </p>
            </div>
        </div>
    )
}
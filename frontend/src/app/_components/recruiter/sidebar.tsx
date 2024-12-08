'use client'

import { HiClipboardList, HiDuplicate, HiInbox, HiPlusCircle, HiUsers, HiViewGrid } from 'react-icons/hi';
import { AddJobModal } from './add-job-modal';
import { useRef } from 'react';

export function Sidebar() {

    const modalRef = useRef<HTMLDialogElement>(null);

    const showModal = () => {
        const modal = modalRef.current
        if (!modal) return null;
        modal.showModal();
    }

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
                    <div className='btn text-white bg-sky-400 w-full border-none rounded-2xl' onClick={showModal}>
                        <HiPlusCircle className='text-xl' /><span className='hidden lg:inline'>Add Offer</span>
                        <AddJobModal modalRef={modalRef} />
                    </div>
                    <a href="/recruiter/my-offers" className='btn btn-white w-full rounded-2xl'>
                        <HiClipboardList className='text-xl' /><span className='hidden lg:inline'>My Offers</span>
                    </a>
                    <a href="/recruiter/candidate-list" className='btn btn-white w-full rounded-2xl'>
                        <HiUsers className='text-xl' /><span className='hidden lg:inline'>Candidate List</span>
                    </a>
                    <a href="/recruiter/invitations-sent" className='btn btn-white w-full rounded-2xl'>
                        <HiInbox className='text-xl' /><span className='hidden lg:inline'>Invitations Sent</span>
                    </a>
                    <a href="/recruiter/received-applications" className='btn btn-white w-full rounded-2xl'>
                        <HiDuplicate className='text-xl' /><span className='hidden lg:inline'>Received Applications</span>
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
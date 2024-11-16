'use client'

import { HiClipboardList, HiPlusCircle, HiUsers, HiViewGrid } from 'react-icons/hi';
import { AddJobModal } from '../_components/recruiter/add-job-modal';
import { useRef } from 'react';
import { Navbar } from '@/app/_components/recruiter/navbar';

export default function RecruiterLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const modalRef = useRef<HTMLDialogElement>(null);

    const showModal = () => {
        const modal = modalRef.current
        if (!modal) return null;
        modal.showModal();
    }
    return (
        <div className="flex">
            <div className="w-28 lg:w-80 h-screen fix">
                <div className="flex justify-between flex-col h-full p-4 bg-base-content shadow-md rounded-r-3xl text-white">
                    <div className="text-2xl text-center font-bold mb-20">
                        <h1 className='hidden lg:inline'>CareerFit AI</h1>
                        <h1 className='lg:hidden text-lg'>CFAI</h1>
                        <p className='text-sm font-normal'>
                            Discover your career path
                        </p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='btn text-white bg-sky-400 w-full border-none rounded-2xl' onClick={showModal}>
                            <HiPlusCircle className='text-xl' /><span className='hidden lg:inline'>Add Offer</span>
                            <AddJobModal modalRef={modalRef} />
                        </div>
                        <a href="/recruiter/my-offers" className='btn btn-white w-full rounded-2xl'>
                            <HiClipboardList className='text-xl' /><span className='hidden lg:inline'>My Offers</span>
                        </a>
                        <div className='btn btn-white w-full rounded-2xl'>
                            <HiUsers className='text-xl' /><span className='hidden lg:inline'>Candidates</span>
                        </div> 
                    </div>
                    <p className='text-center mt-20 text-sm lg:text-md'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        <span className='block mt-4'>
                            © 2024 CareerFit AI
                        </span>
                    </p>
                </div>
            </div>
            <div className="w-full grid grid-rows-8 h-screen py-4 px-8">
                <Navbar />
                {children}
            </div>
        </div>
    )
}
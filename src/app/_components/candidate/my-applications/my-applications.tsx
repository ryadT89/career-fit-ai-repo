'use client'

import { Post } from '@/app/_components/recruiter/post';
import { useSession } from 'next-auth/react';
import { api } from '@/trpc/react';
import { useRef, useState, useMemo, useEffect } from 'react';
import { sleep } from '@trpc/server/unstable-core-do-not-import';
import { OfferModal } from '../job-offers/offer-modal';
import { ApplicationPost } from './application-post';
import { ApplicationModal } from './application-modal';
import { HiFolderOpen } from 'react-icons/hi';

export function MyApplications() {
    const { data: session } = useSession();

    const { data: applications, refetch: refetchApplications } = api.application.getApplicationByCandidateId.useQuery({
        id: session?.user.id || ''
    });

    const [searchQuery, setSearchQuery] = useState('');

    const modalRef = useRef<HTMLDialogElement>(null);
    const [selectedApplication, setSelectedApplication] = useState<number>(0);

    const showModal = (id: number) => {
        setSelectedApplication(id);
        const modal = modalRef.current;
        if (!modal) return null;

        modal.showModal();
    }

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Memoize filtered offers based on search query
    const filteredApplications = useMemo(() => {
        if (!searchQuery) return applications;

        const lowercasedQuery = searchQuery.toLowerCase();
        return applications?.filter((application) =>
            application.jobListing.title.toLowerCase().includes(lowercasedQuery) ||
            application.jobListing.description.toLowerCase().includes(lowercasedQuery) ||
            application.jobListing.status.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, applications]);

    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='py-4 pb-8 font-bold text-3xl'>My Applications</div>

                {/* Search Input Field */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search applications..."
                        className="input input-bordered w-full rounded-full"
                    />
                </div>
            </div>

            <div className='overflow-y-scroll row-span-7'>
                {applications === undefined &&
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                }

                {applications?.length === 0 ?
                    <div className="flex justify-center items-center h-96 text-2xl font-bold">
                        <HiFolderOpen className="text-6xl mr-4" />
                        <span>No Applications Yet</span>
                    </div>
                    :

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                        {filteredApplications?.map((application) => (
                            <span onClick={() => showModal(application.id)} key={application.id}>
                                <ApplicationPost
                                    title={application.jobListing.title}
                                    description={application.jobListing.description}
                                    applicationStatus={application.status}
                                    user={application.jobListing.recruiter?.user.name || ''}
                                    time={application.appliedAt}
                                />
                            </span>
                        ))}
                        <ApplicationModal
                            modalRef={modalRef}
                            applicationId={selectedApplication}
                        />
                    </div>
                }
            </div>
        </>
    );
}

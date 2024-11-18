'use client'

import { ApplicationPost } from './application-post';
import { useSession } from 'next-auth/react';
import { api } from '@/trpc/react';
import { useRef, useState, useMemo } from 'react';
import { ApplicationModal } from './application-modal';
import { sleep } from '@trpc/server/unstable-core-do-not-import';

export function ReceivedApplications() {
    const { data: session } = useSession();

    const { data: applications, refetch: refetchApplications } = api.application.getApplicationsByRecruiterId.useQuery({
        id: session?.user?.id || '',
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

    // Memoize filtered applications based on search query
    const filteredApplications = useMemo(() => {
        if (!searchQuery) return applications;

        const lowercasedQuery = searchQuery.toLowerCase();
        return applications?.filter((application) =>
            application.candidate.user.name.toLowerCase().includes(lowercasedQuery) ||
            application.candidate.user.email.toLowerCase().includes(lowercasedQuery) ||
            application.jobListing.title.toLowerCase().includes(lowercasedQuery) ||
            application.jobListing.description.toLowerCase().includes(lowercasedQuery) ||
            application.status.toLowerCase().includes(lowercasedQuery) ||
            application.candidate.skills.toLowerCase().includes(lowercasedQuery) ||
            application.candidate.location.toLowerCase().includes(lowercasedQuery) ||
            application.candidate.experience.toString().includes(lowercasedQuery) ||
            application.candidate.interestSectors?.toLowerCase().includes(lowercasedQuery) ||
            application.jobListing.location.toLowerCase().includes(lowercasedQuery) ||
            application.jobListing.status.toLowerCase().includes(lowercasedQuery) ||
            application.jobListing.requiredSkills.toLowerCase().includes(lowercasedQuery) ||
            application.jobListing.requiredExperience.toString().includes(lowercasedQuery)
        );
    }, [searchQuery, applications]);

    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='py-4 pb-8 font-bold text-3xl'>Received Applications</div>

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

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {filteredApplications?.map((application) => (
                        <span onClick={() => showModal(application.id)} key={application.id}>
                            <ApplicationPost
                                title={application.jobListing.title}
                                description={application.coverLetter}
                                applicationStatus={application.status}
                                user={application.candidate.user.name}
                                image={application.candidate.user.image || ''}
                                time={application.appliedAt}
                            />
                        </span>
                    ))}
                    <ApplicationModal
                        modalRef={modalRef}
                        refetchApplications={refetchApplications}
                        applicationId={selectedApplication}
                    />
                </div>
            </div>
        </>
    );
}

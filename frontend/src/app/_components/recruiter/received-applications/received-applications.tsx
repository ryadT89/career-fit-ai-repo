'use client'

import { ApplicationPost } from './application-post';
import { useRef, useState, useMemo, useEffect } from 'react';
import { ApplicationModal } from './application-modal';
import useAuth from '../../global/useAuth';
import axios from 'axios';

export function ReceivedApplications() {

    const { isAuthenticated, user, loading } = useAuth();
    const [applications, setApplications] = useState([]);

    const getApplicationsByRecruiterId = async () => {
        await axios.get(`http://localhost:8000/application/recruiter/${user.id}`).then((response) => {
            const applications = response.data.data[0];

            setApplications(applications);
        }).catch((error) => { });
    }

    useEffect(() => {
        if (!loading) {
            getApplicationsByRecruiterId();
        }
    }, [loading]);

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
        return applications?.filter((application: any) =>
            application.candidate.user.fullname.toLowerCase().includes(lowercasedQuery) ||
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
                    {filteredApplications?.map((application: any, index) => (
                        <span onClick={() => showModal(application.id)} key={index}>
                            <ApplicationPost
                                title={application.jobListing.title}
                                description={application.coverLetter}
                                applicationStatus={application.status}
                                user={application.candidate.user.fullname}
                                userId={application.candidate.userId}
                                time={application.appliedAt}
                            />
                        </span>
                    ))}
                    <ApplicationModal
                        modalRef={modalRef}
                        refetchApplications={getApplicationsByRecruiterId}
                        applicationId={selectedApplication}
                    />
                </div>
            </div>
        </>
    );
}

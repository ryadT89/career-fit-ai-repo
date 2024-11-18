'use client'

import { CandidatePost } from './candidate-post';
import { useSession } from 'next-auth/react';
import { api } from '@/trpc/react';
import { useRef, useState, useMemo } from 'react';
import { CandidateModal } from './candidate-modal';
import { sleep } from '@trpc/server/unstable-core-do-not-import';

export function CandidateList() {

    const { data: candidates, refetch: refetchCandidates } = api.candidate.getAllCandidates.useQuery();

    const [searchQuery, setSearchQuery] = useState('');

    const modalRef = useRef<HTMLDialogElement>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<number>(0);

    const showModal = (id: number) => {
        setSelectedCandidate(id);
        const modal = modalRef.current;
        if (!modal) return null;

        modal.showModal();
    }

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Memoize filtered candidates based on search query
    const filteredCandidates = useMemo(() => {
        if (!searchQuery) return candidates;

        const lowercasedQuery = searchQuery.toLowerCase();
        return candidates?.filter((candidate) =>
            candidate.user.name.toLowerCase().includes(lowercasedQuery) ||
            candidate.user.email.toLowerCase().includes(lowercasedQuery) ||
            candidate.skills.toLowerCase().includes(lowercasedQuery) ||
            candidate.location.toLowerCase().includes(lowercasedQuery) ||
            candidate.experience.toString().includes(lowercasedQuery) ||
            candidate.interestSectors?.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, candidates]);

    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='py-4 pb-8 font-bold text-3xl'>List Of Candidates</div>

                {/* Search Input Field */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search candidates..."
                        className="input input-bordered w-full rounded-full"
                    />
                </div>
            </div>

            <div className='overflow-y-scroll row-span-7'>
                {candidates === undefined &&
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                }

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {filteredCandidates?.map((candidate) => (
                        <span onClick={() => showModal(candidate.id)} key={candidate.id}>
                            <CandidatePost
                                name={candidate.user.name}
                                email={candidate.user.email}
                                location={candidate.location}
                                experience={candidate.experience}
                                image={candidate.user.image || ''}
                            />
                        </span>
                    ))}
                    <CandidateModal
                        modalRef={modalRef}
                        candidateId={selectedCandidate}
                    />
                </div>
            </div>
        </>
    );
}
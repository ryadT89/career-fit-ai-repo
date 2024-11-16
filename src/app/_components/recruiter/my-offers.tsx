'use client'

import { Post } from './post';
import { useSession } from 'next-auth/react';
import { api } from '@/trpc/react';
import { useRef, useState, useMemo } from 'react';
import { OfferModal } from './offer-modal';
import { sleep } from '@trpc/server/unstable-core-do-not-import';

export function MyOffers() {
    const { data: session } = useSession();

    const { data: recruiterData } = api.recruiter.getRecuiterProfileById.useQuery({
        userId: session?.user.id ?? ''
    });

    const { data: offers, refetch: refetchOffers } = api.jobListing.getJobListingsByRecruiterId.useQuery({
        recruiterId: recruiterData?.id ?? 0
    });

    const [searchQuery, setSearchQuery] = useState('');

    const modalRef = useRef<HTMLDialogElement>(null);
    const [selectedOffer, setSelectedOffer] = useState<number>(0);

    const showModal = (id: number) => {
        setSelectedOffer(id);
        const modal = modalRef.current;
        if (!modal) return null;
        sleep(1000);
        modal.showModal();
    }

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Memoize filtered offers based on search query
    const filteredOffers = useMemo(() => {
        if (!searchQuery) return offers;

        const lowercasedQuery = searchQuery.toLowerCase();
        return offers?.filter((offer) =>
            offer.title.toLowerCase().includes(lowercasedQuery) ||
            offer.description.toLowerCase().includes(lowercasedQuery) ||
            offer.status.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, offers]);

    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='py-4 pb-8 font-bold text-3xl'>My Offers</div>

                {/* Search Input Field */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search offers..."
                        className="input input-bordered w-full rounded-full"
                    />
                </div>
            </div>

            <div className='overflow-y-scroll row-span-7'>
                {offers === undefined &&
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                }

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {filteredOffers?.map((offer) => (
                        <span onClick={() => showModal(offer.id)} key={offer.id}>
                            <Post
                                title={offer.title}
                                description={offer.description}
                                jobStatus={offer.status}
                                user={recruiterData?.user?.name || ''}
                                time={offer.createdAt}
                            />
                        </span>
                    ))}
                    <OfferModal
                        modalRef={modalRef}
                        refetchOffers={refetchOffers}
                        jobListingId={selectedOffer}
                        userName={recruiterData?.user?.name || ''}
                    />
                </div>
            </div>
        </>
    );
}

'use client'

import { Post } from '../post';
import { useRef, useState, useMemo, useEffect } from 'react';
import { OfferModal } from './offer-modal';
import { HiFolderOpen } from 'react-icons/hi';
import useAuth from '../../global/useAuth';
import axios from 'axios';
import { getProfilePicture } from '../../global/fileService';

export function MyOffers() {

    const { user, loading } = useAuth();
    const [recruiterData, setRecruiterData] = useState({} as any);
    const [offers, setOffers] = useState([]);

    const getRecruiterProfile = async () => {
        await axios.get(`http://localhost:8000/recruiter/userId/${user.id}`).then((response) => {
            const recruiterData = response.data.data[0];  // Data will hold the recruiter profile
            setRecruiterData(recruiterData);
        }).catch((error) => {});
    }

    const fetchUserJobListings = async () => {
        await axios.get(`http://localhost:8000/joblisting/recruiter/${user.id}`).then((response) => {
            const offers = response.data.data[0];
            setOffers(offers);
        }).catch((error) => {setOffers([])});
    }

    useEffect(() => {
        if (!loading) {
            getRecruiterProfile();
            fetchUserJobListings();
        }
    }, [loading]);

    const [searchQuery, setSearchQuery] = useState('');

    const modalRef = useRef<HTMLDialogElement>(null);
    const [selectedOffer, setSelectedOffer] = useState<number>(0);

    const showModal = (id: number) => {
        setSelectedOffer(id);
        const modal = modalRef.current;
        if (!modal) return null;

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
        return offers.filter((offer: any) =>
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

                {offers?.length === 0 ?
                    <div className="flex justify-center items-center h-96 text-2xl font-bold">
                        <HiFolderOpen className="text-6xl mr-4" />
                        <span>No job offers</span>
                    </div>
                    :

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {filteredOffers.map((offer: any, index) => (
                            <span onClick={() => showModal(offer.id)} key={index}>
                                <Post
                                    title={offer.title}
                                    description={offer.description}
                                    jobStatus={offer.status}
                                    user={recruiterData?.user?.fullname || ''}
                                    userId={user.id || ''}
                                    time={offer.createdAt}
                                />
                            </span>
                        ))}
                        <OfferModal
                            modalRef={modalRef}
                            refetchOffers={fetchUserJobListings}
                            jobListingId={selectedOffer}
                            userName={recruiterData?.user?.fullanme || ''}
                        />
                    </div>
                }
            </div>
        </>
    );
}

'use client'

import { useRef, useState, useMemo, useEffect } from 'react';
import { InvitationModal } from './invitation-modal';
import { InvitationPost } from './invitation-post';
import useAuth from '../../global/useAuth';
import axios from 'axios';

export function ReceivedInvitations() {

    const { isAuthenticated, user, loading } = useAuth();

    const [invitations, setInvitations] = useState([]);

    const fetchInvitations = async () => {

        await axios.get(`http://localhost:8000/invitation/candidate/${user.id}`).then((response) => {
            const invitations_list = response.data.data[0];
            setInvitations(invitations_list);
        }).catch((error) => { });
    }

    useEffect(() => {
        if (!loading) {
            fetchInvitations();
        }
    }, [loading]);

    const [searchQuery, setSearchQuery] = useState('');

    const modalRef = useRef<HTMLDialogElement>(null);
    const [selectedInvitation, setSelectedInvitation] = useState<number>(0);

    const showModal = (id: number) => {
        setSelectedInvitation(id);
        const modal = modalRef.current;
        if (!modal) return null;
        modal.showModal();
    }

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Memoize filtered invitations based on search query
    const filteredInvitations = useMemo(() => {
        if (!searchQuery) return invitations;

        const lowercasedQuery = searchQuery.toLowerCase();
        return invitations?.filter((invitation: any) =>
            invitation.recruiter.user.name.toLowerCase().includes(lowercasedQuery) ||
            invitation.recruiter.user.email.toLowerCase().includes(lowercasedQuery) ||
            invitation.recruiter.company.toLowerCase().includes(lowercasedQuery) ||
            invitation.message?.toLowerCase().includes(lowercasedQuery) ||
            invitation.recruiter.website?.toLowerCase().includes(lowercasedQuery) ||
            invitation.recruiter.sector.toLowerCase().includes(lowercasedQuery) ||
            invitation.recruiter.description?.toLowerCase().includes(lowercasedQuery)

        );
    }, [searchQuery, invitations]);

    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='py-4 pb-8 font-bold text-3xl'>Invitations Sent</div>

                {/* Search Input Field */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search invitations..."
                        className="input input-bordered w-full rounded-full"
                    />
                </div>
            </div>

            <div className='overflow-y-scroll row-span-7'>
                {invitations === undefined &&
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                }

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {filteredInvitations?.map((invitation: any) => (
                        <span onClick={() => showModal(invitation.id)} key={invitation.id}>
                            <InvitationPost
                                userId={invitation.recruiter.userId || ''}
                                recruiterName={invitation.recruiter.user.fullname}
                                message={invitation.message || ''}
                                time={invitation.invitedAt}
                            />
                        </span>
                    ))}
                    <InvitationModal
                        modalRef={modalRef}
                        invitationId={selectedInvitation}
                    />
                </div>
            </div>
        </>
    );
}

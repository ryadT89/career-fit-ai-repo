'use client'

import { HiDocumentRemove, HiDotsVertical, HiInbox, HiInboxIn, HiOutlineInbox, HiPencil } from "react-icons/hi";
import { api } from "@/trpc/react";
import { useEffect, useRef, useState } from "react";
import { InviteModal } from './invite-modal';
import { ProfilePicture } from "../../global/profile-picture";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    candidateId: number;
}

export const CandidateModal: React.FC<AddJobModalProps> = ({ modalRef, candidateId}) => {

    const { data: candidate, refetch: refetchApplication } = api.candidate.getCandidateProfileById.useQuery({
        id: candidateId
    });

    useEffect(() => {
        refetchApplication();
    }, [candidateId]);

    const inviteModalRef = useRef<HTMLDialogElement>(null);
    const openInviteModal = () => {
        const modal = inviteModalRef.current;
        if (!modal) return null;
        modal.showModal();
    }

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content w-1/4">
                { candidate === undefined ?
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                :
                <>
                    <div className="relative modal-body">
                        <div className="flex justify-end">
                            <div onClick={openInviteModal} className="font-bold gap-1 border-2 cursor-pointer hover:bg-gray-50 flex items-center py-1 px-2 rounded-full">
                                <HiOutlineInbox className="text-xl" /> Invite
                                <InviteModal modalRef={inviteModalRef} candidateId={candidateId} />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <ProfilePicture className='w-20 h-20' src={candidate?.user.image || ''} />
                            <h1 className="text-xl font-bold my-2">{candidate?.user.name}</h1>
                            <h2 className="text-sm"></h2>
                            <h2 className="text-lg font-bold">Skills</h2>
                            <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {candidate?.skills}
                            </p>
                            <h2 className="text-lg font-bold">Experience</h2>
                            <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {candidate?.experience} {candidate?.experience === 1 ? 'years' : 'year'} of experience
                            </p>
                            <h2 className="text-lg font-bold">Sectors of Interest</h2>
                            <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                                    {candidate?.interestSectors}
                            </p>
                        </div>
                    </div>
                </>
                }
                </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>

    )
};
'use client'

import { HiDocumentRemove, HiDotsVertical, HiInbox, HiInboxIn, HiOutlineInbox, HiPencil } from "react-icons/hi";
import { api } from "@/trpc/react";
import { useEffect, useRef } from "react";
import { ProfilePicture } from "../../global/profile-picture";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    invitationId: number;
}

export const InvitationModal: React.FC<AddJobModalProps> = ({ modalRef, invitationId}) => {

    const { data: invitation, refetch: refetchInvitation } = api.invitation.getInvitationById.useQuery({
        id: invitationId
    });

    useEffect(() => {
        refetchInvitation();
    }, [invitationId]);

    const inviteModalRef = useRef<HTMLDialogElement>(null);
    const openInviteModal = () => {
        const modal = inviteModalRef.current;
        if (!modal) return null;
        modal.showModal();
    }

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content w-1/4">
                { invitation === undefined ?
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                :
                <>
                    <div className="modal-body">
                        <div className="flex flex-col justify-center items-center">
                            <ProfilePicture className='w-24 h-24' src={invitation?.recruiter?.user.image || ''} />
                            <h1 className="text-xl font-bold my-2">{invitation?.recruiter?.user.name}</h1>
                            <div className="text-center border-2 w-full rounded-lg p-2 mb-4">
                                <h1 className="font-bold text-sm mb-2">Invitation Message</h1>
                                <p>{invitation?.message}</p>
                            </div>
                            <div className="text-center border-2 w-full rounded-lg">
                                <h2 className="text-sm"></h2>
                                <h2 className="text-sm font-bold">company</h2>
                                <p className="text-sm text-gray-500 text-ellipsis">
                                        {invitation?.recruiter?.company}
                                </p>
                                <h2 className="text-sm font-bold">sector</h2>
                                <p className="text-sm text-gray-500 text-ellipsis">
                                        {invitation?.recruiter?.sector}
                                </p>
                                <h2 className="text-sm font-bold">website</h2>
                                <p className="text-sm text-gray-500 text-ellipsis">
                                        {invitation?.recruiter?.website}
                                </p>
                                <h2 className="text-sm font-bold">description</h2>
                                <p className="text-sm text-gray-500 text-ellipsis">
                                        {invitation?.recruiter?.description}
                                </p>
                            </div>
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
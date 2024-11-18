'use client'

import { api } from "@/trpc/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { HiCheckCircle } from "react-icons/hi";

interface ApplyModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    candidateId: number;
}

export function InviteModal({ modalRef, candidateId }: ApplyModalProps) {

    const { data: session } = useSession();
    const recruiterId = api.recruiter.getRecruiterProfileByUserId.useQuery({
        userId: session?.user?.id || ''
    }).data?.id;

    const [ message, setMessage ] = useState<string>('');
    const [ invitationSent, setInvitationSent ] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    const sendInvite = api.invitation.createInvitation.useMutation({
        onSuccess: async () => {
            setInvitationSent(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            modalRef.current?.close();
            setInvitationSent(false);
        },
        onError: (error) => {
            console.error(error);
        }
    });


    const invite = () => {
        sendInvite.mutate({
            candidateId: candidateId,
            recruiterId: recruiterId || 0,
            message: message,
        });
    }

    return (
        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                {invitationSent ? 
                    <div className="h-60 flex flex-col items-center justify-center">
                        <HiCheckCircle className="text-4xl text-green-500" />
                        Invitation Sent!
                    </div>
                :
                    <>
                        <div className="modal-header mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold ">Send Candidate Invite</h1>
                                    <p className="text-sm font-normal text-gray-500">
                                        Write a message for the candidate
                                    </p>
                                </div>
                                <button onClick={invite} className="btn bg-info rounded-full text-white">Send Invite</button>
                            </div>
                        </div>
                        <div className="modal-body">
                            <textarea onChange={handleChange} name="coverLetter" className="textarea h-24 min-h-60 textarea-bordered w-full font-normal" placeholder="Write your invite message here..."></textarea>
                        </div>
                    </>
                }
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
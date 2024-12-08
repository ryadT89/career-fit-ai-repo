'use client'

import { useEffect, useState } from "react";
import { ProfilePicture } from "../../global/profile-picture";
import axios from "axios";
import { getProfilePicture } from "../../global/fileService";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    invitationId: number;
}

export const InvitationModal: React.FC<AddJobModalProps> = ({ modalRef, invitationId}) => {

    const [invitation, setInvitation] = useState<any>();

    const fetchInvitation = async () => {
        await axios.get(`http://localhost:8000/invitation/${invitationId}`).then((response) => {
            const invitation = response.data.data[0];
            setInvitation(invitation);
        }).catch((error) => {});
    }

    useEffect(() => {
        fetchInvitation();
    }, [invitationId]);

    const [image, setImage] = useState<string>();
    const getImage = async () => {
        setImage(await getProfilePicture(invitation?.recruiter?.userId));
    }

    getImage();

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
                            <ProfilePicture className='w-24 h-24' src={image || ''} />
                            <h1 className="text-xl font-bold my-2">{invitation?.recruiter?.user?.fullname}</h1>
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
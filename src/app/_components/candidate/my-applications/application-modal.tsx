'use client'

import { HiCheckCircle, HiDocumentRemove, HiDotsVertical, HiPencil } from "react-icons/hi";
import { api } from "@/trpc/react";
import { use, useEffect, useRef, useState } from "react";
import { formatDistance } from 'date-fns'

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    applicationId: number;
}

export const ApplicationModal: React.FC<AddJobModalProps> = ({ modalRef, applicationId}) => {

    const { data: application, refetch: refetchOffer } = api.application.getApplicationById.useQuery({
        id: applicationId
    });

    var color = "";
    switch (application?.status) {
        case "applied":
            color = "bg-info";
            break;
        case "accepted":
            color = "bg-success";
            break;
        case "rejected":
            color = "bg-error";
            break;
    }

    useEffect(() => {
        refetchOffer();
    }, [applicationId]);
    
    const relativeOfferTime = formatDistance(new Date(application?.jobListing.createdAt || new Date()), new Date(), { addSuffix: true });
    const relativeApplicationTime = formatDistance(new Date(application?.appliedAt || new Date()), new Date(), { addSuffix: true });

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                { application === undefined ?
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                :
                <>
                    <div className="modal-header mb-4">
                        <div className="flex justify-between items-center mb-4 gap-4">
                            <div className="flex gap-2 items-center">
                                <h2 className="text-lg font-thin">Application Status</h2>
                                <div className={`rounded-full ${color} w-fit text-white px-2`}>{application?.status}</div>
                            </div>
                            <div className='flex gap-2'><HiCheckCircle className="text-xl"/> Applied {relativeApplicationTime}</div>
                        </div>
                        <h1 className="text-xl font-bold my-2">{application?.jobListing?.title}</h1>
                        {application?.jobListing?.status === "open" ?
                            <div className="rounded-full bg-success w-fit mb-4 text-white px-2">{application?.jobListing?.status}</div>
                            :
                            <div className="rounded-full bg-error w-fit mb-4 text-white px-2">{application?.jobListing?.status}</div>
                        }
                        <div className="text-sm text-gray-500">{relativeOfferTime}</div>
                    </div>
                    <div className="modal-body">
                        <h2 className="text-lg font-bold">Description</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {application?.jobListing?.description}
                        </p>
                        <h2 className="text-lg font-bold">Location</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {application?.jobListing?.location}
                        </p>
                        <h2 className="text-lg font-bold">Skills</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {application?.jobListing?.requiredSkills}
                        </p>
                        <h2 className="text-lg font-bold">Experience</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {application?.jobListing?.requiredExperience} {application?.jobListing?.requiredExperience === 1 ? 'year' : 'years'} of experience
                        </p>
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
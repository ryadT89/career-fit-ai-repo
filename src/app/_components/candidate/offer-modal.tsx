'use client'

import { HiDocumentRemove, HiDotsVertical, HiPencil } from "react-icons/hi";
import { api } from "@/trpc/react";
import { useEffect, useRef } from "react";
import { formatDistance } from 'date-fns'

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    refetchOffers: () => void;
    jobListingId: number;
}

export const OfferModal: React.FC<AddJobModalProps> = ({ modalRef, refetchOffers, jobListingId}) => {

    const editModalRef = useRef<HTMLDialogElement>(null);

    const { data: offerData, refetch: refetchOffer } = api.jobListing.getJobListingById.useQuery({
        id: jobListingId
    });

    useEffect(() => {
        console.log(jobListingId);
        refetchOffer();
        console.log(offerData);
    }, [jobListingId]);

    const refetch = () => {
        refetchOffer();
        refetchOffers();
    }

    const removeJobListing = api.jobListing.deleteJobListing.useMutation({
        onSuccess: () => {
            console.log("Job Listing Deleted");
            refetchOffers();
            modalRef.current?.close();
        },
        onError: (error: any) => {
            console.error(error);
        }
    });

    const applyJobListing = api.application.useMutation({

    const relativeTime = formatDistance(new Date(offerData?.createdAt || new Date()), new Date(), { addSuffix: true });

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                { offerData === undefined ?
                    <div className="flex justify-center items-center h-96">
                        <span className="loading loading-ring loading-lg"></span>
                    </div>
                :
                <>
                    <div className="modal-header mb-4">
                        <div className="flex justify-between">
                            <h1 className="text-xl font-bold my-2">{offerData?.title}</h1>
                            <div className="btn bg-sky-400 text-white rounded-full">Apply</div>
                        </div>
                        {offerData?.status === "open" ?
                            <div className="rounded-full bg-success w-fit mb-4 text-white px-2">{offerData?.status}</div>
                            :
                            <div className="rounded-full bg-error w-fit mb-4 text-white px-2">{offerData?.status}</div>
                        }
                        <div className="text-sm font-bold">{'test'}</div>
                        <div className="text-sm text-gray-500">{relativeTime}</div>
                    </div>
                    <div className="modal-body">
                        <h2 className="text-lg font-bold">Description</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {offerData?.description}
                        </p>
                        <h2 className="text-lg font-bold">Location</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {offerData?.location}
                        </p>
                        <h2 className="text-lg font-bold">Skills</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {offerData?.requiredSkills}
                        </p>
                        <h2 className="text-lg font-bold">Experience</h2>
                        <p className="text-sm text-gray-500 pb-4 text-ellipsis">
                            {offerData?.requiredExperience} {offerData?.requiredExperience === 1 ? 'year' : 'years'} of experience
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
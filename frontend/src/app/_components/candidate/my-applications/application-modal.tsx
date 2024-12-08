'use client'

import { HiCheckCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import { formatDistance } from 'date-fns'
import axios from "axios";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    applicationId: number;
}

export const ApplicationModal: React.FC<AddJobModalProps> = ({ modalRef, applicationId}) => {

    const [application, setApplication] = useState<any>();

    const fetchApplication = async () => {
        await axios.get(`http://localhost:8000/application/${applicationId}`).then((response) => {
            const application = response.data.data[0];
            setApplication(application);
        }).catch((error) => {});
    }

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
        fetchApplication();
    }, [applicationId]);
    
    const relativeOfferTime = formatDistance(new Date(application?.jobListing.createdAt * 1000 || new Date()), new Date(), { addSuffix: true });
    const relativeApplicationTime = formatDistance(new Date(application?.appliedAt * 1000|| new Date()), new Date(), { addSuffix: true });

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
'use client'

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { Error } from "@/app/_components/global/error";
import { HiPencil } from "react-icons/hi";

interface EditJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
    id: number;
    refetchOffer: () => void;
}

interface jobListing {
    title: string,
    description: string,
    location: string,
    status: string,
    requiredSkills: string,
    requiredExperience: number
}

export const EditJobModal: React.FC<EditJobModalProps> = ({ modalRef, refetchOffer, id }) => {

    const [error, setError] = useState("");
    
    const {data: offerData} = api.jobListing.getJobListingById.useQuery({
        id: id
    });

    const [jobListingForm, setJobListingForm] = useState<jobListing>({
        title: offerData?.title || "",
        description: offerData?.description || "",
        location: offerData?.location || "",
        status: offerData?.status || "",
        requiredSkills: offerData?.requiredSkills || "",
        requiredExperience: offerData?.requiredExperience || NaN,
    });

    useEffect(() => {
        setJobListingForm({
            title: offerData?.title || "",
            description: offerData?.description || "",
            location: offerData?.location || "",
            status: offerData?.status || "",
            requiredSkills: offerData?.requiredSkills || "",
            requiredExperience: offerData?.requiredExperience || 0,
        });
    }, [offerData]);

    const handleFormChange = (e: any) => {
        setError("");
        console.log(e.target.name);
        console.log(e.target.value);
        // convert required experience to number
        if (e.target.name === "requiredExperience") {
            setJobListingForm({ ...jobListingForm, [e.target.name]: parseInt(e.target.value) });
            return;
        }

        setJobListingForm({ ...jobListingForm, [e.target.name]: e.target.value });
    }

    // create a new job listing
    const jobMutation = api.jobListing.updateJobListing.useMutation({
        onSuccess: () => {
            console.log("Job Listing Updated");
            refetchOffer();
            modalRef.current?.close();
        },
        onError: (error: any) => {
            console.error(error);
        }
    });

    const handleFromSubmit = async () => {
        // verify the form
        console.log(jobListingForm);
        if (jobListingForm.status === "" || jobListingForm.title === "" || jobListingForm.description === "" || jobListingForm.location === "" || jobListingForm.requiredSkills === "" || isNaN(jobListingForm.requiredExperience)) {
            setError("Please fill all fields");
            return;
        }

        jobMutation.mutate({ ...jobListingForm, id: id });
    }

    return (

        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                <div className="modal-header mb-10">
                    <h1 className="text-xl font-bold my-2 flex items-center gap-2 "> <HiPencil /> Edit Your Job Offer</h1>
                    <h3>Enter your job information right here</h3>
                </div>
                <div className="modal-body">
                    <input type="text" defaultValue={offerData?.title} placeholder="Job Title" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="title"/>
                    <textarea placeholder="Job Description" defaultValue={offerData?.description} className="textarea textarea-bordered w-full mt-2" onChange={handleFormChange} name="description" />
                    <input type="text" defaultValue={offerData?.location}  placeholder="Job Location" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="location" />
                    <select className="select select-bordered w-full mt-2" defaultValue={offerData?.status} name="status" onChange={handleFormChange}>
                        <option disabled>Select the status of your offer</option>
                        <option value="open">open</option>
                        <option value="filled">filled</option>
                    </select>
                    <input type="text" defaultValue={offerData?.requiredSkills} placeholder="Required Skills" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="requiredSkills" />
                    <input type="number" defaultValue={offerData?.requiredExperience} placeholder="Required Experience" className="input input-bordered w-full mt-2" onChange={handleFormChange} name="requiredExperience" />
                    { error && <Error message={error} />}
                    <br />
                    <div className="btn mt-8 w-full" onClick={handleFromSubmit}>Edit Offer</div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>

    )
};
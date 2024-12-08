'use client'

import { useEffect, useState } from "react";
import useAuth from "../global/useAuth";
import { getResume, uploadResume } from "../global/fileService";
import { Success } from "../global/success";

interface AddJobModalProps {
    modalRef: React.RefObject<HTMLDialogElement>;
}

export const MyResume: React.FC<AddJobModalProps> = ({ modalRef }) => {

    const [resume, setResume] = useState<any>(null);
    const [previewURL, setPreviewURL] = useState<string>('');
    const {user, loading} = useAuth();
    const [success, setSuccess] = useState<boolean>(false);

    const fetchResume = async () => {
        setPreviewURL(await getResume(user.id));
    }

    useEffect(() => {
        if (!loading) {
            fetchResume();
        }
    }, [loading]);

    const handleUpload = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            await uploadResume(user.id, file);
            setResume(file);
            const fileURL = URL.createObjectURL(file);
            setPreviewURL(fileURL);
            setSuccess(true);
        }
    };

    const handleNewUpload = async () => {
        setResume(null);
        setPreviewURL('');
    };

    return (
        <dialog ref={modalRef} className="modal backdrop-blur-lg">
            <div className="modal-box text-base-content">
                <div className="modal-header mb-4">
                    <h1 className="text-xl font-bold m-2">My Resume</h1>
                    <h3>Manage your resume from here</h3>
                </div>
                { success && <Success message="Resume uploaded successfully" /> }
                <div className="modal-body">
                    {resume || previewURL ? (
                        <div className="resume-preview">
                            <iframe
                                src={previewURL}
                                className="mt-4 border rounded w-full h-64"
                                title="Resume Preview"
                            ></iframe>
                            <button className="btn btn-neutral mt-4" onClick={handleNewUpload}>
                                Upload a New Resume
                            </button>
                        </div>
                    ) : (
                        <div className="upload-resume">
                            <p className="mb-4">Upload your resume in PDF format</p>
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full max-w-xs"
                                accept=".pdf"
                                onChange={handleUpload}
                            />
                        </div>
                    )}
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
};
import React, { useState } from "react";
import { ProfilePicture } from "./profile-picture";
import { uploadProfilePicture } from "@/app/_components/global/fileService";
import useAuth from "./useAuth";

function ProfilePictureUpload({ userId, userImage, refetchUser }: { userId: string, userImage: string, refetchUser: () => void }) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const { user } = useAuth();

    interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
        target: HTMLInputElement & EventTarget;
    }

    const handleFileChange = (event: FileChangeEvent): void => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) {
            return;
        }

        await uploadProfilePicture(user.id, file).then((res) => {
            refetchUser();
        }).catch((error) => {});
    };

    return (
        <div>
            <div className="cursor-pointer">
                <label htmlFor="file-input">
                    <div className="w-32 h-32 rounded-full overflow-hidden mx-auto">
                        <ProfilePicture className="w-32 h-32" src={preview || userImage} />
                    </div>
                </label>
                <input
                    id="file-input"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            <button
                onClick={handleUpload}
                className="btn btn-neutral rounded-full w-32 mt-4"
            >
                Upload
            </button>
        </div>
    );
}

export default ProfilePictureUpload;

import React, { useState } from "react";
import { ProfilePicture } from "./profile-picture";
import { fileUploader } from "@/app/_components/global/file-uploader";
import { api } from "@/trpc/react";
import { fileDelete } from "./file-delete";

function ProfilePictureUpload({ userId, userImage, refetchUser }: { userId: string, userImage: string, refetchUser: () => void }) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

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

    const updateProfile = api.user.updateUser.useMutation();

    const handleUpload = async () => {
        if (!file) {
            return;
        }

        await fileUploader(file).then(async (res) => {
            if (!res.filePath) {
                console.error("File upload failed!");
                return;
            }
            updateProfile.mutate({ id: userId, image: res.filePath });
            refetchUser();
            await fileDelete(userImage);
            console.log("File uploaded successfully:", res.filePath);
        }
        ).catch((error) => {
            console.error(error);
        });
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
                    accept="image/*"
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

import axios from "axios";

export const uploadProfilePicture = async (user_id: string, file: File ): Promise<{ filePath: string }> => {

    const formData = new FormData();
    formData.append('file', file);

    await axios.post(`http://localhost:8000/upload/profile-picture/${user_id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {}).catch((error) => {});

    return { filePath: '' };
};

export const uploadResume = async (user_id: string, file: File ) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`http://localhost:8000/upload/resume/${user_id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading resume:", error);
        throw error;
    }
};

export const getProfilePicture = async (userId: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/upload/profile-picture/${userId}`, {
            responseType: "blob", // To handle binary data (image file)
        });
        const objectUrl = URL.createObjectURL(response.data);
        return objectUrl;
    } catch (error) {
        console.error("Error fetching profile picture:", error);
        throw error;
    }
}

export const getResume = async (userId: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/upload/resume/${userId}`, {
            responseType: "blob", // To handle binary data (image file)
        });
        const objectUrl = URL.createObjectURL(response.data);
        return objectUrl;
    } catch (error) {
        console.error("Error fetching Resume:", error);
        throw error;
    }
}

export const fileUploader = async (file: File ): Promise<{ filePath: string }> => {

    const formData = new FormData();
    formData.append('file', file);

    console.log(formData.get('file'));

    try {
        const response = await fetch('/api/file/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Upload Failed');
    }
};

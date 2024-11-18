export const fileDelete = async (filePath: string): Promise<{ filePath: string }> => {

    try {
        const response = await fetch('/api/file/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath }),
        });

        if (!response.ok) {
            throw new Error('Delete Image failed');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Delete Image Failed');
    }
};

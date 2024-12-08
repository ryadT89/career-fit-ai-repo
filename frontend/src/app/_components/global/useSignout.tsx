'use client'

const useSignOut = () => {

    const signOut = () => {
        localStorage.removeItem("authToken");
        window.location.reload();
    };

    return signOut;
};

export default useSignOut;

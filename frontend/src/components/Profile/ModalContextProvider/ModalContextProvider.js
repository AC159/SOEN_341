import React, { useState } from 'react';

export const ModalContext = React.createContext();

function ModalContextProvider ({children}) {

    const [openFollowersModal, setFollowersModal] = useState(false);
    const [openFollowingModal, setFollowingModal] = useState(false);

    const closeFollowersDialog = () => {
        setFollowersModal(false);
    }

    const closeFollowingDialog = () => {
        setFollowingModal(false);
    }

    const openFollowersDialog = () => {
        setFollowersModal(true);
    }

    const openFollowingDialog = () => {
        setFollowingModal(true);
    }

    return (
        <ModalContext.Provider value={{
            openFollowersModal,
            openFollowingModal,
            closeFollowersDialog,
            closeFollowingDialog,
            openFollowersDialog,
            openFollowingDialog
        }}>
            {children}
        </ModalContext.Provider>
    );

}

export default ModalContextProvider;

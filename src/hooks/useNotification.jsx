import  { useState } from 'react';

const useNotification = () => {
    const initialState = {
        isOpen: false,
        type: 'success', // error, success, warning, info
        description: '',
        duration: 3000
    }
    const [notificationState, setNotificationState] = useState(initialState);

    return {notificationState, setNotificationState}
}

export default useNotification;

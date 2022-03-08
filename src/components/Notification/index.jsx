import React, { forwardRef, useContext } from 'react'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { NotificationContext } from './../../context/NotificationContext'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Notification = () => {
    const { notificationState, setNotificationState } = useContext(NotificationContext)
    const { isOpen, type, description, duration } = notificationState

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setNotificationState({ ...notificationState, isOpen: false, type: 'success', description: '' })
    }

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar
                open={isOpen}
                autoHideDuration={duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {description}
                </Alert>
            </Snackbar>
        </Stack>
    )
}

export default Notification

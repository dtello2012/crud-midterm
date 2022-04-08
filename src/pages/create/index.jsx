import React, { useState, useContext, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { StyledInputWrap, StyledButtonWrap } from './../../components/utils.style'
import { StyledCreateWrap } from './index.style'
import Autocomplete from '@mui/material/Autocomplete'
import { addDoc, collection } from 'firebase/firestore'
import { db, auth } from './../../firebase-config'
import { useNavigate, useParams } from 'react-router-dom'
import { ISSUE_TYPE, ISSUE_PRIORITY, ISSUE_STATE, ISSUE_RESOLUTION } from './../../App.data'
import { format } from 'date-fns'
import { NotificationContext } from './../../context/NotificationContext'
import { IssuesCollectionContext } from './../../context/IssuesCollectionContext'
import { doc, updateDoc } from 'firebase/firestore'

const Create = ({ isAuth, isEdit }) => {
    const navigate = useNavigate()
    const params = useParams()
    const { issuesList, getListOfIssues } = useContext(IssuesCollectionContext) || []
    const editIssue = issuesList?.find((issue) => issue.id === params?.issueId)
    const { notificationState, setNotificationState } = useContext(NotificationContext)
    const [title, setTitle] = useState(isEdit ? editIssue?.title : '')
    const [description, setDescription] = useState(isEdit ? editIssue?.description : '')
    const [issueType, setIssueType] = useState(isEdit ? editIssue?.issueType : '')
    const [priority, setPriority] = useState(isEdit ? editIssue?.priority : '')
    const [issueState, setIssueState] = useState(isEdit ? editIssue?.issueState : '')
    const [resolution, setResolution] = useState(isEdit ? editIssue?.resolution : '')

    useEffect(() => {
        if (!isAuth) {
            navigate('/')
        }
    }, [])

    const handleSubmit = async () => {
        if (!title || !description) return
        const submittedValues = {
            title,
            description,
            issueType,
            priority,
            issueState,
            resolution,
            dateCreated: format(new Date(), 'yyyy-MM-dd hh:mm'),
            updatedDate: null,
            author: {
                userName: auth.currentUser.email.split('@')[0],
                id: auth.currentUser.uid
            }
        }
        const issuesCollectionRef = collection(db, 'issues')
        await addDoc(issuesCollectionRef, submittedValues)
        await getListOfIssues()
        navigate(`/dashboard/${auth?.currentUser?.uid}`)
        showToast('success', `${issueType} created`)
    }
    const updateIssue = async (id) => {
        if (!title || !description) return
        const listDoc = doc(db, 'issues', id)
        const submittedValues = {
            title,
            description,
            issueType,
            priority,
            issueState,
            resolution,
            dateCreated: format(new Date(), 'yyyy-MM-dd hh:mm'),
            updatedDate: format(new Date(), 'yyyy-MM-dd hh:mm')
        }
        await updateDoc(listDoc, submittedValues)

        showToast('success', `updated issue`)
        await getListOfIssues()
        navigate(`/dashboard/${auth?.currentUser?.uid}`)
    }

    const showToast = (type, description) => {
        setNotificationState({
            ...notificationState,
            isOpen: true,
            type,
            description
        })
    }

    return (
        <StyledCreateWrap>
            <h1>{isEdit ? 'Edit issue' : 'Create an issue'}</h1>
            <StyledInputWrap>
                <TextField label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} />
            </StyledInputWrap>
            <StyledInputWrap>
                <TextField
                    multiline
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </StyledInputWrap>
            <StyledInputWrap>
                <Autocomplete
                    disablePortal
                    clearOnEscape
                    value={issueType}
                    onChange={(e, newValue) => setIssueType(newValue)}
                    options={[...ISSUE_TYPE]}
                    renderInput={(params) => <TextField {...params} label="Issue Type" />}
                />
            </StyledInputWrap>
            <StyledInputWrap>
                <Autocomplete
                    disablePortal
                    clearOnEscape
                    value={priority}
                    onChange={(e, newValue) => setPriority(newValue)}
                    options={[...ISSUE_PRIORITY]}
                    renderInput={(params) => <TextField {...params} label="Priority" />}
                />
            </StyledInputWrap>
            <StyledInputWrap>
                <Autocomplete
                    disablePortal
                    clearOnEscape
                    value={issueState}
                    onChange={(e, newValue) => setIssueState(newValue)}
                    options={[...ISSUE_STATE]}
                    renderInput={(params) => <TextField {...params} label="Bug State" />}
                />
            </StyledInputWrap>
            <StyledInputWrap>
                <Autocomplete
                    disablePortal
                    clearOnEscape
                    value={resolution}
                    onChange={(e, newValue) => setResolution(newValue)}
                    options={[...ISSUE_RESOLUTION]}
                    renderInput={(params) => <TextField {...params} label="Resolution" />}
                />
            </StyledInputWrap>
            <StyledButtonWrap>
                <Button variant="contained" onClick={!isEdit ? handleSubmit : () => updateIssue(params?.issueId)}>
                    {isEdit ? 'Edit' : 'Create'}
                </Button>
                {isEdit && (
                    <Button variant="outlined" onClick={() => navigate(`/dashboard/${auth?.currentUser?.uid}`)}>
                        {'cancel'}
                    </Button>
                )}
            </StyledButtonWrap>
        </StyledCreateWrap>
    )
}

export default Create

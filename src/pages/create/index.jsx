import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { StyledInputWrap, StyledButtonWrap } from '../../components/utils.style'
import { StyledCreateWrap } from './index.style'
import Autocomplete from '@mui/material/Autocomplete'
import { addDoc, collection } from 'firebase/firestore'
import { db, auth } from './../../firebase-config'
import {useNavigate} from 'react-router-dom'
import {ISSUE_TYPE, ISSUE_PRIORITY, ISSUE_STATE, ISSUE_RESOLUTION} from './../../App.data'
import {format} from 'date-fns'

const Create = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [issueType, setIssueType] = useState('');
    const [priority, setPriority] = useState('');
    const [issueState, setIssueState] = useState('')
    const [resolution, setResolution] = useState('')

    const handleSubmit =  async () => {
        if(!title || !description) return
        console.log('auth', auth);
        const submittedValues = {
            title,
            description,
            issueType,
            priority,
            issueState,
            resolution,
            dateCreated: format(new Date(), 'yyyy-MM-dd'),
            author: {
                userName: auth.currentUser.email.split('@')[0],
                id: auth.currentUser.uid
            }
        }
        const issuesCollectionRef = collection(db, 'issues')
        await addDoc(issuesCollectionRef, submittedValues)
        navigate('/dashboard')
        
        console.log('%c [ submittedValues ]-30', 'font-size:13px; background:pink; color:#bf2c9f;', submittedValues)
    }

    return (
        <StyledCreateWrap>
            <h1>Create an issue</h1>
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
            <Button variant="contained" onClick={handleSubmit}>
                    Create
            </Button>
            </StyledButtonWrap>
        </StyledCreateWrap>
    )
}

export default Create

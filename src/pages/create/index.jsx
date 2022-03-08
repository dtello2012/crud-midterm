import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Paper } from '@mui/material'
import { StyledInputWrap } from '../../components/utils.style'
import { StyledCreateWrap } from './index.style'
import Autocomplete from '@mui/material/Autocomplete'

const Create = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [issueType, setIssueType] = useState('');
    const [priority, setPriority] = useState('');
    const [bugState, setBugState] = useState('')
    const [resolution, setResolution] = useState('')

    const submittedValues = {
        title,
        description,
        issueType,
        priority,
        state: bugState,
        resolution,
        dateCreated: new Date()
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
                    options={['Bug', 'Improvement', 'Story', 'Task']}
                    renderInput={(params) => <TextField {...params} label="Issue Type" />}
                />
            </StyledInputWrap>
            <StyledInputWrap>
                <Autocomplete
                    disablePortal
                    clearOnEscape
                    value={priority}
                    onChange={(e, newValue) => setPriority(newValue)}
                    options={['Blocker','Critical', 'Major', 'Minor', 'Trivial']}
                    renderInput={(params) => <TextField {...params} label="Priority" />}
                />
            </StyledInputWrap>
            <StyledInputWrap>
                <Autocomplete
                    disablePortal
                    clearOnEscape
                    value={bugState}
                    onChange={(e, newValue) => setBugState(newValue)}
                    options={['Open', 'In Progress', 'Resolved', 'Reopened', 'Duplicate', 'QA Ready', 'Backlog','Done', 'Closed']}
                    renderInput={(params) => <TextField {...params} label="Bug State" />}
                />
            </StyledInputWrap>
            <StyledInputWrap>
                <Autocomplete
                    disablePortal
                    clearOnEscape
                    value={resolution}
                    onChange={(e, newValue) => setResolution(newValue)}
                    options={['Fixed', "Won't Fix", 'Duplicate', 'Incomplete', 'Cannot Reproduce', 'Done','By Design', "Won't Do" ]}
                    renderInput={(params) => <TextField {...params} label="Resolution" />}
                />
            </StyledInputWrap>
        </StyledCreateWrap>
    )
}

export default Create

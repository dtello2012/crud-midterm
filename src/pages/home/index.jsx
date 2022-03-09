import React, { useState, useEffect, Fragment, useRef } from 'react'
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore'
import { db, auth } from './../../firebase-config'
import { StyledHomeList, StyledHome } from './index.style'
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DropdownButton from './../../components/DropdownButton'
import {ISSUE_TYPE, ISSUE_PRIORITY, ISSUE_STATE, ISSUE_RESOLUTION} from './../../App.data'


const Home = ({ isAuth }) => {
    const [issuesList, setIssuesList] = useState([])
    const issuesCollectionRef = collection(db, 'issues')

    useEffect(() => {
        getListOfIssues()
    }, [])

    const deleteIssue = async (id) => {
        const listDoc = doc(db, 'issues', id)
        await deleteDoc(listDoc)
        getListOfIssues()
    }

    async function getListOfIssues () {
        const data = await getDocs(issuesCollectionRef)
        setIssuesList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    
    console.log('%c [ issuesList ]-36', 'font-size:13px; background:pink; color:#bf2c9f;', issuesList)

    return (
        <StyledHome>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="center">Priority</TableCell>
                            <TableCell align="center">Issue State</TableCell>
                            <TableCell align="center">Issue type</TableCell>
                            <TableCell align="center">Resolution</TableCell>
                            <TableCell align="right">{' '}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issuesList.map((issue) => {
                            const { title, description, priority, issueState, issueType, resolution, id } = issue   
                            return (
                                <Fragment key={id}>
                                    <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{fontWeight: 'bold'}}>
                                            {title}
                                        </TableCell>
                                        <TableCell align="left">{description}</TableCell>
                                        <TableCell align="right">
                                            <DropdownButton options={[...ISSUE_PRIORITY]} selected={priority} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton options={[...ISSUE_STATE]} selected={issueState} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton options={[...ISSUE_TYPE]} selected={issueType} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton options={[...ISSUE_RESOLUTION]} selected={resolution} />
                                        </TableCell>
                                        
                                        {isAuth && auth.currentUser.uid === issue.author.id && <TableCell align="right">
                                            {<Button onClick={() => deleteIssue(id)}>Delete</Button>}
                                        </TableCell>}
                                    </TableRow>
                                </Fragment>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </StyledHome>
    )
}

export default Home

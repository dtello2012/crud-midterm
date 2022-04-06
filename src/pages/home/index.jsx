import React, { useEffect, Fragment, useContext } from 'react'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from './../../firebase-config'
import { StyledHome, StyledHomeList } from './index.style'
import { format } from 'date-fns'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import MenuItem from '@mui/material/MenuItem'
import DropdownButton from './../../components/DropdownButton'
import { ISSUE_TYPE, ISSUE_PRIORITY, ISSUE_STATE, ISSUE_RESOLUTION } from './../../App.data'
import { useNavigate, useParams } from 'react-router-dom'
import OptionsDropdown from './../../components/OptionsDropdown'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { IssuesCollectionContext } from './../../context/IssuesCollectionContext'
import { NotificationContext } from './../../context/NotificationContext'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Home = ({ isAuth }) => {
    const navigate = useNavigate()
    const params = useParams()
    const { issuesList, getListOfIssues } = useContext(IssuesCollectionContext) || []
    const { notificationState, setNotificationState } = useContext(NotificationContext)
    const ISSUES_LIST = params?.userId
        ? issuesList && issuesList?.filter((issue) => issue?.author.id === auth?.currentUser?.uid)
        : issuesList

    useEffect(() => {
        if (!isAuth) {
            navigate('/')
            return
        }
        if (!issuesList || issuesList?.length === 0) {
            getListOfIssues()
        }
    }, [])

    const deleteIssue = async (id) => {
        const listDoc = doc(db, 'issues', id)
        await deleteDoc(listDoc)
        getListOfIssues()
    }

    const editIssue = (id) => {
        navigate(`/edit-issues/${id}`)
    }

    const updateIssue = async (id, update) => {
        const _update = { ...update, updatedDate: format(new Date(), 'yyyy-MM-dd hh:mm') }
        const listDoc = doc(db, 'issues', id)
        await updateDoc(listDoc, _update)
        const updatedKey = Object.entries(_update).map(([key, value]) => `value updated to: ${value}`)

        setNotificationState({
            ...notificationState,
            isOpen: true,
            type: 'success',
            description: `${updatedKey}`
        })
        getListOfIssues()
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Track issues state'
            }
        }
    }
    const openIssues = issuesList?.filter(
        (item) => item.issueState === 'Open' && item?.author.id === auth?.currentUser?.uid
    )
    const resolvedIssues = issuesList?.filter(
        (item) => item.issueState === 'Resolved' && item?.author.id === auth?.currentUser?.uid
    )
    const closedIssues = issuesList?.filter(
        (item) => item.issueState === 'Closed' && item?.author.id === auth?.currentUser?.uid
    )
    const doneIssues = issuesList?.filter(
        (item) => item.resolution === 'Done' && item?.author.id === auth?.currentUser?.uid
    )

    const data = {
        labels: ['Open', 'Resolved', 'Closed', 'Done'],
        datasets: [
            {
                label: 'Issue state',
                data: [openIssues?.length, resolvedIssues?.length, closedIssues?.length, doneIssues?.length],
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgba(0, 94, 31, 0.897)'
            }
        ]
    }

    return (
        <StyledHome>
            <section style={{ display: 'flex' }}>
                <article style={{ width: '30%' }}>
                    <Line options={options} data={data} />
                </article>
            </section>

            <h1>{params?.userId ? 'My Issues' : 'Team Issues'}</h1>
            <StyledHomeList component={Paper}>
                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="left">Description</TableCell>
                            <TableCell align="center">Priority</TableCell>
                            <TableCell align="center">Issue State</TableCell>
                            <TableCell align="center">Issue type</TableCell>
                            <TableCell align="center">Resolution</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ISSUES_LIST?.filter((item) => item.issueState !== 'Backlog')?.map((issue) => {
                            const { title, description, priority, issueState, issueType, resolution, id } = issue
                            return (
                                <Fragment key={id}>
                                    <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                            {title}
                                        </TableCell>
                                        <TableCell align="left">{description}</TableCell>
                                        <TableCell align="right">
                                            <DropdownButton
                                                options={[...ISSUE_PRIORITY]}
                                                selected={priority}
                                                onUpdateSelection={(selectedOption) =>
                                                    updateIssue(id, { priority: selectedOption })
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton
                                                options={[...ISSUE_STATE]}
                                                selected={issueState}
                                                onUpdateSelection={(selectedOption) =>
                                                    updateIssue(id, { issueState: selectedOption })
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton
                                                options={[...ISSUE_TYPE]}
                                                selected={issueType}
                                                onUpdateSelection={(selectedOption) =>
                                                    updateIssue(id, { issueType: selectedOption })
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton
                                                options={[...ISSUE_RESOLUTION]}
                                                selected={resolution}
                                                onUpdateSelection={(selectedOption) =>
                                                    updateIssue(id, { resolution: selectedOption })
                                                }
                                            />
                                        </TableCell>

                                        {
                                            <TableCell align="right">
                                                {isAuth && auth.currentUser.uid === issue.author.id ? (
                                                    <OptionsDropdown>
                                                        <MenuItem
                                                            onClick={() => deleteIssue(id)}
                                                            style={{ justifyContent: 'space-between' }}
                                                        >
                                                            Delete <DeleteForeverIcon />{' '}
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => editIssue(id)}
                                                            style={{ justifyContent: 'space-between' }}
                                                        >
                                                            Edit <EditIcon />{' '}
                                                        </MenuItem>
                                                    </OptionsDropdown>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                        }
                                    </TableRow>
                                </Fragment>
                            )
                        })}
                    </TableBody>
                </Table>
            </StyledHomeList>

            {ISSUES_LIST?.filter((item) => item.issueState === 'Backlog').length > 0 && (
                <>
                    <h1>{'Backlog'}</h1>
                    <StyledHomeList component={Paper}>
                        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Title</TableCell>
                                    <TableCell align="left">Description</TableCell>
                                    <TableCell align="center">Priority</TableCell>
                                    <TableCell align="center">Issue State</TableCell>
                                    <TableCell align="center">Issue type</TableCell>
                                    <TableCell align="center">Resolution</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ISSUES_LIST?.sort((a, b) => a.dateCreated < b.dateCreated)
                                    .filter((item) => item.issueState === 'Backlog')
                                    .map((issue) => {
                                        const { title, description, priority, issueState, issueType, resolution, id } =
                                            issue
                                        return (
                                            <Fragment key={id}>
                                                <TableRow
                                                    key={id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{ fontWeight: 'bold' }}
                                                    >
                                                        {title}
                                                    </TableCell>
                                                    <TableCell align="left">{description}</TableCell>
                                                    <TableCell align="right">
                                                        <DropdownButton
                                                            options={[...ISSUE_PRIORITY]}
                                                            selected={priority}
                                                            onUpdateSelection={(selectedOption) =>
                                                                updateIssue(id, { priority: selectedOption })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <DropdownButton
                                                            options={[...ISSUE_STATE]}
                                                            selected={issueState}
                                                            onUpdateSelection={(selectedOption) =>
                                                                updateIssue(id, { issueState: selectedOption })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <DropdownButton
                                                            options={[...ISSUE_TYPE]}
                                                            selected={issueType}
                                                            onUpdateSelection={(selectedOption) =>
                                                                updateIssue(id, { issueType: selectedOption })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <DropdownButton
                                                            options={[...ISSUE_RESOLUTION]}
                                                            selected={resolution}
                                                            onUpdateSelection={(selectedOption) =>
                                                                updateIssue(id, { resolution: selectedOption })
                                                            }
                                                        />
                                                    </TableCell>

                                                    {
                                                        <TableCell align="right">
                                                            {isAuth && auth.currentUser.uid === issue.author.id ? (
                                                                <OptionsDropdown>
                                                                    <MenuItem
                                                                        onClick={() => deleteIssue(id)}
                                                                        style={{ justifyContent: 'space-between' }}
                                                                    >
                                                                        Delete <DeleteForeverIcon />{' '}
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        onClick={() => editIssue(id)}
                                                                        style={{ justifyContent: 'space-between' }}
                                                                    >
                                                                        Edit <EditIcon />{' '}
                                                                    </MenuItem>
                                                                </OptionsDropdown>
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </TableCell>
                                                    }
                                                </TableRow>
                                            </Fragment>
                                        )
                                    })}
                            </TableBody>
                        </Table>
                    </StyledHomeList>
                </>
            )}
        </StyledHome>
    )
}

export default Home

import React, { useEffect, Fragment, useContext } from 'react'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from './../../firebase-config'
import { StyledHome } from './index.style'
import { format } from 'date-fns'
import { useNavigate, useParams } from 'react-router-dom'
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
import IssuesTable from './../../components/IssuesTable'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
const OPTIONS = {
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

const Home = ({ isAuth }) => {
    const navigate = useNavigate()
    const params = useParams()
    const { issuesList, getListOfIssues } = useContext(IssuesCollectionContext) || []
    const { notificationState, setNotificationState } = useContext(NotificationContext)
    const ISSUES_LIST = params?.userId
        ? issuesList && issuesList?.filter((issue) => issue?.author.id === auth?.currentUser?.uid)
        : []

    useEffect(() => {
        if (!isAuth) {
            navigate('/')
            return
        }
        if (!issuesList || issuesList?.length === 0) {
            getListOfIssues()
        }
    }, [isAuth, navigate, issuesList, getListOfIssues])

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
    const fixedIssues = issuesList?.filter(
        (item) => item.resolution === 'Fixed' && item?.author.id === auth?.currentUser?.uid
    )

    const getData = () => ({
        labels: ['Open', 'Resolved', 'Closed', 'Done', 'Fixed'],
        datasets: [
            {
                label: 'Issue state',
                data: [
                    openIssues?.length,
                    resolvedIssues?.length,
                    closedIssues?.length,
                    doneIssues?.length,
                    fixedIssues?.length
                ],
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgba(0, 94, 31, 0.897)'
            }
        ]
    })

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
        const updatedKey = Object.entries(update).map(([key, value]) => `value updated to: ${value}`)

        setNotificationState({
            ...notificationState,
            isOpen: true,
            type: 'success',
            description: `${updatedKey}`
        })
        getListOfIssues()
    }

    const SHOW_GRAPH =
        openIssues?.length > 0 ||
        resolvedIssues?.length > 0 ||
        closedIssues?.length > 0 ||
        doneIssues?.length > 0 ||
        fixedIssues?.length > 0

    const BACKLOG_ISSUES = ISSUES_LIST?.sort((a, b) => a.dateCreated < b.dateCreated).filter(
        (item) => item.issueState === 'Backlog'
    )

    const MAIN_ISSUES = ISSUES_LIST?.sort((a, b) => a.dateCreated < b.dateCreated).filter(
        (item) => item.issueState !== 'Backlog'
    )

    return (
        <StyledHome>
            {SHOW_GRAPH && (
                <section style={{ display: 'flex' }}>
                    <article style={{ width: '30%' }}>
                        <Line options={OPTIONS} data={getData()} />
                    </article>
                </section>
            )}

            <IssuesTable
                headings={['Title', 'Description', 'Priority', 'Issue State', 'Issue type', 'Resolution', 'Actions']}
                issuesList={MAIN_ISSUES}
                title={'Issues Table'}
                onUpdateIssue={updateIssue}
                onDeleteIssue={deleteIssue}
                onEditIssue={editIssue}
                isAuth={isAuth}
            />

            {BACKLOG_ISSUES.length > 0 && (
                <>
                    <IssuesTable
                        headings={[
                            'Title',
                            'Description',
                            'Priority',
                            'Issue State',
                            'Issue type',
                            'Resolution',
                            'Actions'
                        ]}
                        issuesList={BACKLOG_ISSUES}
                        title={'Backlog'}
                        onUpdateIssue={updateIssue}
                        onDeleteIssue={deleteIssue}
                        onEditIssue={editIssue}
                        isAuth={isAuth}
                    />
                    {/* <h1>{'Backlog'}</h1>
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
                */}
                </>
            )}
        </StyledHome>
    )
}

export default Home

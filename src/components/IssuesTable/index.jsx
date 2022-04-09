import React, { Fragment } from 'react'
import { format } from 'date-fns'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import MenuItem from '@mui/material/MenuItem'
import OptionsDropdown from '../OptionsDropdown'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { StyledHomeList } from './index.style'
import DropdownButton from './../DropdownButton'
import { ISSUE_TYPE, ISSUE_PRIORITY, ISSUE_STATE, ISSUE_RESOLUTION } from './../../App.data'
import { auth } from './../../firebase-config'

const IssuesTable = ({ headings, issuesList, title, onUpdateIssue, onDeleteIssue, onEditIssue, isAuth }) => {
    return (
        <>
            <h1>{title}</h1>
            <StyledHomeList component={Paper}>
                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            {headings.map((heading, idx) => (
                                <TableCell key={`heading-key-${idx}`} align="left">
                                    {heading}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issuesList?.map((issue) => {
                            const { title, description, priority, issueState, issueType, resolution, id } = issue
                            return (
                                <Fragment key={id}>
                                    <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            style={{ fontWeight: 'bold', minWidth: 211 }}
                                        >
                                            {title}
                                        </TableCell>
                                        <TableCell align="left" style={{ minWidth: 578 }}>
                                            {description}
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton
                                                options={[...ISSUE_PRIORITY]}
                                                selected={priority}
                                                onUpdateSelection={(selectedOption) =>
                                                    onUpdateIssue(id, { priority: selectedOption })
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton
                                                options={[...ISSUE_STATE]}
                                                selected={issueState}
                                                onUpdateSelection={(selectedOption) =>
                                                    onUpdateIssue(id, { issueState: selectedOption })
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton
                                                options={[...ISSUE_TYPE]}
                                                selected={issueType}
                                                onUpdateSelection={(selectedOption) =>
                                                    onUpdateIssue(id, { issueType: selectedOption })
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <DropdownButton
                                                options={[...ISSUE_RESOLUTION]}
                                                selected={resolution}
                                                onUpdateSelection={(selectedOption) =>
                                                    onUpdateIssue(id, { resolution: selectedOption })
                                                }
                                            />
                                        </TableCell>

                                        {
                                            <TableCell align="right">
                                                {isAuth && auth.currentUser.uid === issue.author.id ? (
                                                    <OptionsDropdown>
                                                        <MenuItem
                                                            onClick={() => onDeleteIssue(id)}
                                                            style={{ justifyContent: 'space-between' }}
                                                        >
                                                            Delete <DeleteForeverIcon />{' '}
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => onEditIssue(id)}
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
    )
}

export default IssuesTable

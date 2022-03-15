import styled from 'styled-components'
import TableContainer from '@mui/material/TableContainer'

export const StyledHome = styled.article`
    padding: 1rem;
    margin-top: 100px;
    @media screen and (min-width: 768px) {
        padding: 0 40px;
    }
    @media screen and (min-width: 1280px) {
        padding: 0 100px;
    }
`

export const StyledHomeList = styled(TableContainer)`
    margin-bottom: 100px;
`

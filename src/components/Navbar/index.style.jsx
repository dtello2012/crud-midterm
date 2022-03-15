import styled from 'styled-components'
import AppBar from '@mui/material/AppBar'

export const StyledNavbar = styled(AppBar)`
    > div {
        > div {
            img {
                margin-right: 16px;
            }
            > div {
                button {
                    a {
                        text-decoration: none;
                        color: #fff;
                    }
                }
            }
        }
    }
`

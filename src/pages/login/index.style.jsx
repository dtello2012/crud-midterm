import styled from 'styled-components'
import Paper from '@mui/material/Paper';
import bg from './../../images/balboa-park.jpg'

export const StyledLoginWrap = styled.section`
    width: 100%;
    min-height: 100vh;
    padding: 0 16px;
    display: flex;

    
    > article {
        
        width: 100%;
        margin: 0 auto;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        &:nth-child(1) {
            display: none;
        }
        > h1 {
            font-size: 32px;
            margin: 0 0 16px;
        }
    }

    @media screen and (min-width: 768px) {
        padding: 0;
        > article {
            &:nth-child(1) {
                display: block;
                background-image: url(${bg});
                background-position: center center;
                background-repeat: no-repeat;
                background-size: cover;
                position: relative;
                &:after {
                    display: block;
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.4);
                    background: radial-gradient(circle, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.7) 100%);
                }
    
            }
            &:nth-child(2) {
                padding: 0 32px;
            }
        }
    }

    @media screen and (min-width: 1024px) {
        > article {
            &:nth-child(1) {
                min-width: 60%;
            }
        }
    }

    @media screen and (min-width: 1200px) {
        > article {
            &:nth-child(1) {
                min-width: 70%;
            }
        }
    }
`

export const StyledInputWrap = styled.article`
    margin-bottom: 24px;
    > div {
        width: 100%;
    }
`

export const StyledButtonWrap = styled.article`
    > button {
        width: 100%;
        padding: 16px 10px;
    }
`

export const StyledButtonGroupWrap = styled.article`
    margin-bottom: 24px;
    display: flex;
    > button {
        width: 50%;
        &:nth-child(1) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        &:nth-child(2) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
`

export const StyledIconWrap = styled(Paper)`
    display: flex;
    width: 40px;
    height: 40px;
    margin: 30px auto;
    text-align: center;
    border-radius: 50% !important;
    align-items: center;
    justify-content: center;
    background-color: #1976d2 !important;
    > svg {
        path {
            fill: #fff;
        }
    }
`
import styled from 'styled-components'

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

export const StyledHomeList = styled.table`
    /* display: flex; */
    /* padding: 0; */
     > li {
         display: block;
         padding: 1rem;
         
         &:nth-child(1) {
             flex: 1 1 300px;
         }

         &:nth-child(2) {
             flex: 1 1 400px;
         }
         &:nth-child(3) {
             flex: 1 1 100px;
             justify-content: center;
            align-items: center;
         }
         &:nth-child(4) {
             flex: 1 1 100px;
             justify-content: center;
            align-items: center;
         }
         &:nth-child(5) {
             flex: 1 1 100px;
             justify-content: center;
            align-items: center;
         }
         
     }

     &.header {
         background: #ccc;
         >li {
            justify-content: center;
            align-items: center;
            padding: 1rem;
            &:nth-child(3) {
             /* flex: 1 1 50px; */
             justify-content: center;
         }
         }
     }
`
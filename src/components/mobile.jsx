import react from "react";
import styled from "styled-components"



const Simulator=()=>{
    return <Mobile>
            <Camera/>
            <Screen/>
        </Mobile>

}

const Mobile = styled.div`
height: 550px;
background:#022B3A;
width:275px;
position:absolute;
left:80vw;
top:20vh;
border-radius: 15px;
display:flex;
justify-content: center;
align-items: center;
flex-direction: column;
z-index:10
`
const Screen = styled.div`
height:85%;
width:95%;
background-color: white;
border-radius: 5px;
`
const Camera=styled.div`
height: 10px;
width:10px;
background-color: #60656F;
border-radius: 50%;
position: relative;
bottom:20px

`;

export default Simulator;
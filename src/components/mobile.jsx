import styled from "styled-components"
import "./mobile.scss";

const data = [
    {
        msg:"hey hello how are you?",
        admin:true
    },
    {
        msg:"i am fine , what about you?",
        admin:false
    },
    {
        msg:"ok",
        admin:true
    }
]

const Simulator=(props)=>{
    return <div className="mobile">

                <div className="camera"/>
                <div className="screen">
                    {data.map(d=>
                       ( d.admin?  <div className="message-admin">{d.msg}</div> : <div className="message">{d.msg}</div>)

                    )}
                </div>
            </div>
        

}



export default Simulator;
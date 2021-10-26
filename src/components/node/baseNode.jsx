import React from "react";
import Icon from "@ant-design/icons/lib/components/Icon";
import { Popover, Menu, Input, Card } from "antd";
import "./base.scss";
import ReactIcon from "../../assets/icon/logo192.png";
import PlusIcon from "../../assets/icon/plus.png"
import { useState } from "react";
import ReactFlow, { Handle } from 'react-flow-renderer';
import SideBar from "./../sidebar";





const Circle = (props) => {
    const [visible, setVisible] = useState(false);
    const handleVisible=()=>{
        setVisible(!visible);
    }

    const content = (
    <div>
        <Menu onClick={(data)=>{
            setVisible(false);
            props.data.onChange(data,props.data.data);}}
             mode="inline" >
            <Menu.Item key="timer">Wait</Menu.Item>
            <Menu.Item key="reply">Received message</Menu.Item>
            <Menu.Item key="send">Send a message</Menu.Item>
            <Menu.Item key="createLead">Create a lead in CRM</Menu.Item>
            <Menu.Item key="assign">Assign to agent</Menu.Item>
            <Menu.Item key="updateUser">Update contact data</Menu.Item>
            <Menu.Item key="tagUser">Tag user</Menu.Item>
        </Menu>
    </div>
)   

    const renderName=()=>{
        const type=props.data.data.name
        return <h3 style={{fontWeight:"bold", marginTop:20}}>{type}</h3>
    }
    const renderValue=()=>{
        return <div style={{backgroundColor:"white",padding:5,display:"inline-block"}}>
            <h5>{props.data.data.content.value}</h5>
        </div>

    }

    return (
        <div style={{cursor:"default"}}>
            <Popover content={content} visible={visible} placement="rightTop" >
            <Handle type="target" position="top" style={{ borderRadius: 0 }} />
                <div 
               
                style={{height:75,whiteSpace:"nowrap",
                width:75,borderRadius:"50%", backgroundColor:"grey", borderWidth:2 , justifyContent:"center", alignItems:"center",flexDirection:"column", display:"flex"}}>
                    <img src={props.data.data.icon} height="50" width="50"  onDoubleClick={()=>props.data.showDrawer(props.data)} />
                    <div style={{top:40,position:"absolute", marginTop:20 , textAlign:"center"}}>

                        {renderName()}
                        <div>

                        {renderValue()}
                        </div>
                        <img src={PlusIcon} height="25" width="25" style={{marginTop:10}} onClick={handleVisible}/>
                    </div>
                </div>
            <Handle type="source" position="bottom" style={{ borderRadius: 0 }} />
            </Popover>

        </div>
    );
}


export const BaseNode=(props)=>{
    return(
        <>
            <Handle type="target" position="top" />
            <div className="base" onDoubleClick={props.openMenu}>
                <img src={props.icon}/>
                <div className="content">
                    <h3 className="name"> {props.name} </h3>
                    <div className="value">{props.value}</div>
                    <div>

                    {props?.custom.map(c=>c())}
                    </div>
                </div>
            </div>
            <Handle type="source" position="bottom" />
        </>
        
    )
}


export default Circle;
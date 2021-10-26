import React from 'react';
import {Menu} from "antd";
import SubMenu from 'antd/lib/menu/SubMenu';
export default function SelectNode(props) {
    return (
        <div>
             <Menu onClick={(data)=>{
            // setVisible(false);
            props.onChange(props.data,props.templates[data.key]);}}
             mode="inline" >
                 <SubMenu key="bot" title="Bigradar Bot">
                    <Menu.Item key="text">Text Bot Message</Menu.Item>
                    <Menu.Item key="form">Collect Data</Menu.Item>
                    <Menu.Item key="choice">Select Option</Menu.Item>
                 </SubMenu>
                <Menu.Item key="createLead">Create a lead in CRM</Menu.Item>
                <Menu.Item key="assign">Assign to agent</Menu.Item>
                <Menu.Item key="updateUser">Update contact data</Menu.Item>
                <Menu.Item key="tagUser">Tag user</Menu.Item>
        </Menu>
        </div>
    )
}

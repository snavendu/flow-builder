import React from "react";
import { Popover, Menu, Input, Card } from "antd";
import ReactFlow, { Handle } from 'react-flow-renderer';

const content = (
    <div>
        <Menu>

            {/* <Menu.SubMenu key="SubMenu"  title="Navigation Three - Submenu"> */}
            <Menu.ItemGroup title="Item 1">
                <Menu.Item key="setting:1">Option 1</Menu.Item>
                <Menu.Item key="setting:2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Item 2">
                <Menu.Item key="setting:3">Option 3</Menu.Item>
                <Menu.Item key="setting:4">Option 4</Menu.Item>
            </Menu.ItemGroup>
            {/* </Menu.SubMenu> */}
        </Menu>
    </div>
)

const CustomMenu = (props) => {
    return (
        <div>
            <Popover content={content} trigger="contextMenu" placement="rightTop">
            <Handle type="target" position="top" style={{ borderRadius: 0 }} />
                <div>
                    <Card title="Reply Message" style={{ width:250}}>
                        <Input.TextArea  placeholder="textarea with clear icon" allowClear />
                    </Card>

                </div>
            <Handle type="source" position="bottom" style={{ borderRadius: 0 }} />

            </Popover>

        </div>
    );
};

export default CustomMenu;
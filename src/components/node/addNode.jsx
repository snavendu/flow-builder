import { Button } from 'antd'
import React from 'react'
import {PlusOutlined} from "@ant-design/icons"
import { Handle } from 'react-flow-renderer'

export default function AddNode(props) {
    console.log(props,"props")
    return (
        <>
            <Handle type="target" position="top" style={{ borderRadius: 0 }} />
            
            <Button type="dashed" onDoubleClick={props.onCheck} style={{height:50,width:50,borderRadius:"50%"}}>
                <PlusOutlined/>
            </Button>

            <Handle type="source" position="bottom" style={{ borderRadius: 0 }} />
        </>
    )
}

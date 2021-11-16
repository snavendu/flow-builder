import { DeleteTwoTone, MinusCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Badge } from 'antd'
import React, { useState, useEffect } from 'react'

export default function SelectIntent(props) {
    const [isAdd, setAdd] = useState(false);
    console.log(props.intents,"data")
    useEffect(() => {
       
    }, [props])
    
    const addTags=(event)=>{
		if (event.target.value !== "") {
            console.log(event.target.value,"valu");
            props.onAdd(event.target.value);
            setAdd(false);
        }

    }
 
    return (
        <div>
         {props.intents?.map(i=>
           
                <Badge  count={<MinusCircleFilled onClick={()=>props.onDelete(i)} style={{color:"red"}}/>}>
                    <Button type={props.selected==i?"primary":"default"} size="large" style={{marginLeft:20}} onClick={()=>props.onSelect(i)}>{i}</Button>
                </Badge>
            
         )}
         {isAdd?<Input 
            onKeyUp={event => event.key === "Enter" ? addTags(event) : null}
            style={{width:150,marginLeft:20}} size="large" placeholder="Add Intent" autoFocus/>:<Button style={{marginLeft:20}} shape="round" icon={<PlusOutlined/>} onClick={()=>setAdd(true)} />}
        </div>
    )
}

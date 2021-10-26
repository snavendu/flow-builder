import { Popover } from 'antd'
import React, { useState } from 'react'
import { BaseNode } from './baseNode';
import SelectNode from './menu';
import Choice from "./../../assets/icon/choice.png";
import Text from "./../../assets/icon/comment.png";
import Form from "./../../assets/icon/contact-form.png"
import PlusIcon from "./../../assets/icon/plus.png"
import _ from 'lodash';
import AddNode from './addNode';
export const defaultBotNodes={
    form:{
        icon:Form,
        content:{
          question:"Add Message",
          type:"form",
          labels:[]
        },
        name:"Collect Data"
    },
    choice:{
        icon:Choice,
        content:{
          question:"Add Message",
          type:"choice",
          option:[]
        },
        name:"Select Choices"
    },
    text:{
        icon:Text,
        content:{
          question:"Add Message",
          type:"text"
        },
        name:"Text Bot Message"
    }
}

export default function BotNodes(props) {
    const [visible, setVisible] = useState(false);
    const { data, onChange, openMenu,id} = props.data;
    console.log("id",id)
    console.log(data,"data")
    const renderMenu=(element)=>(
         <Popover  content={(<SelectNode onChange={(data,template)=>{setVisible(false);onChange(data,template)}} data={props.data} templates={_.cloneDeep(defaultBotNodes)}/>)} visible={visible} placement="right">
            {element}
        </Popover> 
        );
    const renderText=()=>{

    }
    const renderCollect=()=>{

    }
    const renderOption=()=>{

    }
    const renderContent=()=>{

    }

    if(data.content==undefined){
        return renderMenu(<AddNode onCheck={()=>{console.log("hey");setVisible(!visible)}}/>)
    }
    return (

            <BaseNode 
                key={id}
                icon={data?.icon}
                name={data?.name}
                value={data?.content?.question}
                openMenu={()=>openMenu(data)}
                newHandler={()=>setVisible(true)}
                custom={data?.content?.type=="choice"?[]:[()=>renderMenu(<img src={PlusIcon} onClick={()=>setVisible(!visible)}/> )]}
            />
    )
}

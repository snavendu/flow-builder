import { Input, Form, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components"
import "./mobile.scss";



const Simulator=(props)=>{
    const [value, setvalue] = useState("")
    const [messages, setmessages] = useState([]);
    const [current, setCurrent] = useState("");

    useEffect(() => {
      const firstMessage = props.botLinks.length==0?props.botMessage[0]:props.botMessage.find(b=>props.botLinks.find(l=>l.target!=b.id)!=undefined);
      console.log("first",firstMessage);
      if(!!!firstMessage){
          return;
      }
      setCurrent(firstMessage?.id);
      console.log(firstMessage)
      const newData = [...messages];
      newData.push({id:firstMessage?.id, msg:firstMessage?.question,admin:true,type:firstMessage.type,option:firstMessage?.option,labels:firstMessage?.labels})
      setmessages(newData)
    }, [props])
    

    useEffect(() => {
        const latest = messages[messages.length-1]
        if(latest?.admin==false){
            // setTimeout(() => {
            //     const link = props.botLinks.find(l=>l.source==current);
            //     const nextMessage = props.botMessage.find(b=>b.id==link?.target);
            //     if(!!!nextMessage){
            //         return;
            //     }
            //     const newData = [...messages];
            //     newData.push({msg:nextMessage?.question,admin:true,type:nextMessage?.type ,option: nextMessage?.option,labels:nextMessage?.labels})
            //     setmessages(newData)
                
            // },1000);
        }
       
    }, [messages])

    const handleChange=(e)=>{
        e.preventDefault();
        console.log(e.target.value,"data input");
        setvalue(e.target.value);
    }


    const optionHandler=(msg,o)=>{
        const newMessages = [...messages];
        newMessages.map(n=>{
            if(n.id==msg.id){
                n.option=[]
            };
            setTimeout(() => {
                newMessages.push({msg:o.text,admin:false})
                setmessages(newMessages);
                renderNext(o.id)
            },1000);
        })

    }

    const renderNext=(id)=>{
        if(!!!id){
            return;
        }
        const nextMessage = props.botMessage.find(b=>b.id==id);
        const newMessage = {id:nextMessage?.id, msg:nextMessage?.question,admin:true,type:nextMessage?.type ,option: nextMessage?.option,labels:nextMessage?.labels}
        setTimeout(() => {
            setmessages(msg=>{
                const newMessages = [...msg];
                newMessages.push(newMessage);
                return newMessages;
            })
        },1000);
    }

    const formHandler=(msg,data)=>{
        const newMessages = [...messages];

        newMessages.map(n=>{
            if(n.id==msg.id){
                n.labels=[]
            };
            setTimeout(() => {
                const key = Object.keys(data)[0]
                newMessages.push({msg:`${key} : ${data[key]}`,admin:false})
                setmessages(newMessages);
                const next = props.botLinks.find(l=>l.source==msg.id)?.target;
                console.log(next,"next",props.botLinks)
                renderNext(next);
            },1000);
        })

    }

    const renderMessage=(msg)=>{
        console.log(msg,"hello")
        switch (msg.type) {
            case "choice":
                return ( 
                    <div className="options">
                        {msg?.option.map(o=>(  <div className="option" onClick={()=>optionHandler(msg,o)}> {o.text}</div> ))}
                    </div>
                );
                
            case "form":
                return msg.labels.map(l=>(
                    <div className="message-admin">
                        <Form key={msg.id} onFinish={(data)=>formHandler(msg,data)} layout={"vertical"}>
                            <Form.Item name={l} key={msg.id} label={`${l} :`} style={{marginBottom:10}}>
                                 <Input style={{margin:0}} placeholder={`Please Enter ${l}`}/>
                            </Form.Item>
                                <Button type={"primary"} htmlType="submit">Submit</Button>
                        </Form>
                        
                    </div>
                ));

            default:
                break;
        }
    }

    const handleKey=(e)=>{
        if(e.key=="Enter"){
            console.log("i was called")
            const msgs = [...messages];
            msgs.push({msg:value,admin:false,type:"text"})
            setmessages(msgs);
            setvalue("")


        }

    }

    return <div className="mobile">

                <div className="camera"/>
                <div className="screen">
                    {messages.map(d=>
                       ( d.admin?  
                       <>
                       <div className="message-admin">{d.msg}</div>
                       {renderMessage(d)}
                       </> :
                        <div className="message">{d.msg}</div>)

                    )}

                    <div className="input">

                    <Input placeholder="Type something.... " value={value} onChange={handleChange}  onKeyDown={handleKey} />
                    </div>
                </div>
            </div>
        

}



export default Simulator;
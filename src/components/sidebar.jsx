import react, {useEffect, useState} from "react";
import { Drawer, Form, InputNumber, Select, Button, Input, Tag, Row ,Col} from "antd";
import Icon ,{DeleteOutlined,MinusCircleOutlined} from "@ant-design/icons";
import SelectNode from "./node/menu";

const Sidebar = (props) => {
  
  
    return <Drawer title={props.node?.data?.name}
        width={600}
        placement="right"
        onClose={() => props.setVisible(false)}
        visible={props.visible}
        getContainer={false}
    >   
         <RenderForm node={props?.node} type={props.node?.data?.content.type} onSubmit={(data)=>{props.handleSubmit(props.node,data);}} />
    </Drawer>

}

const AddOption=(props)=>{
    const [option, setOption] = useState(props.option||[]);
    
    const handleAdd=()=>{
        const old= [...option];
        old.push("");
        setOption(old)
    }
    const handleDelete=(index)=>{
        const newOption=option.filter((o,i)=>index!=i);
        setOption(newOption)
    }

    return (<div>
        {
            option?.map((o,i)=>
            {
                return <Row justify="space-between">
                    <Col span={20}>
                        <Form.Item name={!!!o?.id?`new-option-${i}`:`${o.id}`}>

                     <Input key={o?.id} autofocus={true} style={{display:"inline", marginBottom:10}} defaultValue={!!!o?.text?o:o.text}/> 
                        </Form.Item>
                    </Col>
                    <Col offset={2}span={2}>
                    <MinusCircleOutlined onClick={()=>handleDelete(i)} style={{color:"red"}}/>
                    </Col>
                </Row>
                    
            }

            )   
        }
        <div style={{display:"flex"}}>

        <Button block onClick={handleAdd} style={{borderStyle:"dashed",display:"inline",fontSize:16}}>{props.type==option?`Add Option`:`Add Label`}</Button>
        </div>
    </div>)

}





const RenderForm = ({ type, onSubmit, node }) => {
    if(!!!node){return null}
    const {content,id}=node.data;
    switch (type) {
        case "form": return (
            <Form key={id} onFinish={onSubmit}>
                <Form.Item label="Question" name="question">
                    <Input placeholder="Add your Question" defaultValue={content.question}/>
                </Form.Item>
                <Form.Item>
                 <AddOption type="form" option={content.labels}/>
                </Form.Item>
                <Button htmlType="submit" type="primary">Save</Button>
            </Form>
            )

        case "text": return (
            <Form key={id} onFinish={onSubmit}>
                <Form.Item label="Question" name="question" >
                    <Input placeholder="Add your Question" defaultValue={content.question}/>
                </Form.Item>
                <Button htmlType="submit"type="primary">Save</Button>
            </Form>
        )
        case "choice": return (
            <Form key={id} onFinish={onSubmit} layout="vertical">
                <Form.Item label="Question" name="question" >
                    <Input placeholder="Add your Question" defaultValue={content.question}/>
                </Form.Item>
                <Form.Item label="Add Option" >
                    <AddOption type="option" option={content.option}/>
                </Form.Item>
                <Form.Item>

                <Button htmlType="submit" type="primary">Save</Button>
                </Form.Item>
            </Form>
        )
        default: return null
    }

};



export default Sidebar;
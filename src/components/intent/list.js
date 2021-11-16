import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Tooltip , Form, Input} from 'antd';
import axios from 'axios';
import React, { useState , useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router';
import "./list.scss"

export const BASE_URL="http://localhost:8080/api/nlp"


export default function List() {
 const [intents, setintents] = useState([]);

 const fetchIntents=async()=>{
     const {data} = await axios.get(`${BASE_URL}/intents`);
     setintents(data)

 }
    useEffect(() => {
        fetchIntents();
    }, []);

    const navigate= useNavigate();
    const path  = useLocation().pathname;
    const [visible, setvisible] = useState(false);

    const renderData = (label,value)=>{
        return <Tooltip color="cyan" title={label}>
            <div>{value}</div>
        </Tooltip>

    }
    const handleSelect=(data)=>{
        navigate(`${path}/builder/${data.id}`)
    }

    const handleCreateNew=async(values)=>{
        setvisible(false);
        const {data} = await axios.post(`http://localhost:8080/api/nlp/intents`,{name:values.library,description:values.description});
        console.log(data);

        navigate(`${path}/builder/${data._id}`)
    }
    return (
        <div style={{padding:20,display:"flex",flexDirection:"row"}}>
            <div className="card">
                <PlusCircleOutlined style={{ fontSize:50}} onClick={()=>setvisible(!visible)}/>
            </div>
            {intents?.map(i=>
             <Card 
             onClick={()=>handleSelect(i)}
             style={{height:200,width:200, marginRight:10,borderWidth:2, borderColor:"black"}}
             actions={Object.keys(i.stats).map(key=>renderData(key,i.stats[key]))}
             >
                 <Card.Meta title={i.name}
                     description={i.description}
                     style={{height:100}}
                 />
             </Card>
                )}
           <CreateModal visible={visible} setvisible={(b)=>setvisible(b)} handleFinish={handleCreateNew}/>
           
            
        </div>
    )
}


const CreateModal = (props)=>{
      
        const handleCancel = () => {
        //   setIsModalVisible(false);
        props.setvisible(false);
        };
      
        return (
          <>
           
            <Modal onCancel={handleCancel}
            title="Create New Entity Library" visible={props.visible} footer={null}>
              <Form layout="vertical" onFinish={props.handleFinish}>
                  <Form.Item name="library" label={"Library Name"}>
                    <Input  placeholder="Name of library"/>
                  </Form.Item>
                  <Form.Item name="description" label={"Library Description"}>
                    <Input placeholder="Description about library"/>
                  </Form.Item>
                  <Button htmlType="submit" type="primary">Save</Button>
              </Form>
            </Modal>
          </>
        );
      
}



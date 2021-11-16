import { Button, Collapse ,Alert,Space} from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { BASE_URL } from './list'

import "./list.scss"
import SelectIntent from './selectIntent'
import TagsInput from './selectTagInput'


export default function IntentBuilder() {
    const { id } = useParams()
    
    const [data, setdata] = useState({});
    const [intent, setintent] = useState();
    const [active, setActive] = useState("intent")
    const [status, setstatus] = useState(null);

    const fetchIntent = async () => {
        console.log(id,"yeh mila");
        const { data } = await axios.get(`${BASE_URL}/intents/${id}`);
        let formattedData = {};
        data.data.map(d => Object.assign(formattedData, { [`${d.intent}`]: { utterances: d.utterances, answers: d.answers } }));
        console.log(formattedData, data)
        setintent(data.data[0]?.intent)
        setdata(formattedData);

    }
    useEffect(() => {
        fetchIntent();
    }, [])

    const handleIntent = (ints) => {
        console.log(intent)
        setintent(ints);
        console.log(ints)
        setActive("question");
    }
    useEffect(() => {

    }, [intent])

    const handleCollapse = (key) => {
        setActive(key[1])

    }

    const renderExtra = () => {
        //if there is intent selected then show it 

        // if there is some changes then tell them to save changes
        return (
            <div className="extra">
                {<Button >{`{ intent : ${intent} }`}</Button>}
            </div>
        )

    }

    const handleChange = (key, tags) => {
        const newData = { ...data };
        newData[intent][key] = tags;
        console.log(newData);
        setdata(newData)
        setstatus("unsaved");

    }

    const handleSave=async()=>{
        const formattedData = Object.keys(data).map(k=>({intent:k,utterances:data[k].utterances,answers:data[k].answers}));
        console.log(formattedData);
        await axios.put(`${BASE_URL}/intents/${id}`,{data:formattedData});
        setstatus("untrained")

    }
    const handleTrain=async()=>{
        await axios.post(`${BASE_URL}/train/${id}`);
    }
    

    const renderAlert = () => {
        if(status==null){
            return null;
        }
        return status == "unsaved" ?
            <Alert
                message="You have unsaved changes,when you are done with your changes, please press save button to save the changes"
                type="warning"
                action={
                    <Space>
                        <Button onClick={handleSave} size="large" type="primary">
                            Save Changes
                        </Button>
                    </Space>
                }
            />:
            <Alert
            message="We just got some changes in your intent library, would you like to train it"
            type="success"
            action={
                <Space>
                    <Button size="large" type="primary" onClick={handleTrain}>
                        Train
                    </Button>
                </Space>
            }
        />
        
    }

    const handleDeleteIntent=(intent)=>{
        const newdata = {...data};
        delete newdata[intent];
        setdata(newdata);
        setstatus("unsaved");

    }

    const handleAddIntent=(intent)=>{
        if(Object.keys(data).find(k=>k==intent)){
            return;
        }
        const newdata = {...data,[intent]:{}};
        setdata(newdata)
        setstatus("unsaved");

    }


    if(!!!data){
        return null
    }
    return (
        <>
           
        <div style={{position:"sticky"}}>
                {renderAlert()}
        </div>
        <Collapse activeKey={[active]} onChange={handleCollapse}>
            <Collapse.Panel header={"Intents"} key="intent">
                <div className="horizontal" >
                        <SelectIntent intents={Object.keys(data)} selected={intent}
                            onSelect={handleIntent}
                            onDelete={handleDeleteIntent}
                            onAdd={handleAddIntent}
                        />
                </div>
            </Collapse.Panel >
            <Collapse.Panel header="Questions" key="question" extra={renderExtra()}>
                <TagsInput keys="utterances" tags={data[intent]?.utterances||[]} onChange={handleChange} />
            </Collapse.Panel>
            <Collapse.Panel header="Answers" key="answers" extra={renderExtra()}>
                <TagsInput keys="answers" tags={data[intent]?.answers||[]} onChange={handleChange} />
            </Collapse.Panel>
        </Collapse>
        </>
    )
}

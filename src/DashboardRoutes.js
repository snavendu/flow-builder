import { Tabs } from "antd";
import { initial } from "lodash";
import React from "react";
import { Route, Routes, useLocation,useNavigate } from "react-router-dom";
import BotFlow from "./BotFlow";
import IntentBuilder from "./components/intent/intentBuilder";
import List from "./components/intent/list";
import IntentDesigner from "./intentDesigner";
 

function Panes(props){
    const location = useLocation()
    const navigate = useNavigate()
    const callback=(key)=>{
        console.log(location);
        navigate(`/${key}`)
    }

    return <div>

        <Tabs defaultActiveKey="botFlow" onChange={callback}>
            <Tabs.TabPane tab="Flow Builder" key="">
                <DashboardRoutes/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Intent Builder" key="intentList">
                 <DashboardRoutes/>
            </Tabs.TabPane>
            
        </Tabs>
       
    </div>
};

function DashboardRoutes(props){
    return  <Routes>
        <Route path="/" element={<BotFlow/>}/>
        <Route  path="/intentList" element={<IntentDesigner/>}/>
        <Route path="/intentList/builder/:id" element={<IntentBuilder/>}/>

    </Routes> 
}



export default Panes;
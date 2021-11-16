import React from 'react';
import { Route, Routes, useLocation,useNavigate } from "react-router-dom";
import IntentBuilder from './components/intent/intentBuilder';
import List from './components/intent/list';


export default function IntentDesigner() {
    const path = useLocation().pathname;
    console.log(path,"pathname")
    return (
        <Routes>
            <Route path={"/"} element={<List/>}/>
        </Routes>
    )
}

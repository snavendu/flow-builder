import './App.css';
import ReactFlow, {  removeElements,Background} from 'react-flow-renderer';
import { Drawer, Switch } from "antd";
import { useState, useEffect } from 'react';
import Simulator from './components/mobile';
import SideBar from './components/sidebar';
import BotNodes, { defaultBotNodes } from './components/node/botNodes';
import _, { forEach } from 'lodash';
import AddNode from './components/node/addNode';




function checkLink(linkData,newLink){
  const duplicate = linkData.find(l=>l.source==newLink.source);

  if(!!!duplicate){
    //update link
    return {links:[...linkData,newLink],duplicate:false}

  }else{
    const uniqueLink= linkData.filter(l=>l.source!==newLink.source);
    const nE2 = {id:`e${newLink.target}-${duplicate.target}`,source:newLink.target,target:duplicate.target,animated: true, 
    style: { stroke: '#f6ab6c'}}
    return {links:[...uniqueLink,newLink,nE2],duplicate:true}
  }

}



const nodeTypes = {
  special: BotNodes,
  add:AddNode
};

function App() {
  const [elements, setElements] = useState([]);
  const [visible,setVisible] = useState(false);
  const [selected,setSelected] =useState({});
  const [simulating,setSimulating] = useState(false);
  const [botMessage, setBotMessage] = useState([]);
  const [BotLinks, setBotLinks] = useState([]);

  const handleVisible=(data)=>{
    setVisible(!visible);
    setSelected(data);
}

  useEffect(() => {
    console.log(elements);
  }, [elements])

  const handleChange = (data,template) => {
    setElements((els)=>{
        const nodeData = els.find(d=>d.id==data.data.id);
        // const max= Math.max(els.map(e=>parseInt(e.id)));
        let oldNode= [...els.filter(e=>!!!e.source)];
        const newId=`${oldNode.length+1}`
        const position={x:nodeData.position.x,y:nodeData.position.y+200};
        const newNode={id:`${newId}`,type:"special",  data:{ onChange:handleChange, openMenu:handleVisible,data:{id:`${newId}`,...template}},position:position};
        const oldLink=els.filter(e=>!!!e.type);
        const newLink={id:`e${nodeData.id}-${newId}`, animated: true, 
        style: { stroke: '#f6ab6c'}, source:`${nodeData.id}`, target:newId}
      
        const {links,duplicate}=checkLink(oldLink,newLink);

        if(duplicate){
            oldNode = oldNode.map(o=>{
              if(o.position.y<=nodeData.position.y){
                return o;
              }else{
                const newO={...o}
                const newPos={x:o.position.x,y:o.position.y+200}
                newO.position=newPos
                return newO;
              }
            })
        }

        setVisible(true);
        setSelected(newNode)

        return [...links,...oldNode,newNode];})
  }

  useEffect(() => {



    const Elements = [
      {
        id: '1',
        type: "special",
        // you can also pass a React component as a label
        data: { onChange: handleAdd, openMenu:handleVisible, data:{id:`1`,parentId:`1`}},
        position: { x: 100, y: 125 },
      }
  
    ];
    setElements(Elements,[]);
    
 
  },[]);


 const handleDrag=(event,el)=>{
   const elementsCopy = [...elements];
   elementsCopy.map(e=>e.id==el.id?e.position=el.position:null)
   setElements(elementsCopy)

}

const handleSimulate=(check)=>{
    setSimulating(check);
    // refactor elements into bot message and bot links

}
const handleAdd=(data,template)=>{

  setElements(els=>{
    const elements = [...els];
    const add = elements.find(e=>e.id==data.data.id);
    const addData={...template,id:add.id,parentId:add.data.data.parentId};
    add.data.data=addData
    add.data.onChange=handleChange
    setVisible(true);
    setSelected(add)
    return[...elements]
    
  })


}
const handleSubmit=(n,data)=>{
  setVisible(false);
  const els =_.cloneDeep(elements)
  const index = els.findIndex(e=>e.id==n.data.id);
  els[index].data.data.content.question=data.question;

  if(n.data?.content.type=="choice"){
    const keys = Object.keys(data).filter(k=>k.includes("option"));
    if(keys.length>0){
      
      keys.forEach((k,i)=>{
        
        if(els.find(e=>e.id==`c${n.data.id}-${i}`)){
          return;
        }
        const id=`c${n.data.id}-${i}`;
        const parent =els[index];
        const xpos= i%2==0?parent.position.x+(i)*150:parent.position.x-(i+1)*150;
        const pos={x:xpos,y:parent.position.y+200}
        const newElement={id,position:pos, type:"special", data: {
          onChange:handleAdd,
          openMenu:parent.data.openMenu,
         data:{id,parentId:n.data.id}
        },}
        const newLink = {id:`e${n.data.id}-${i}`,source:`${n.data.id}`, target:`c${n.data.id}-${i}`,label:data[k],animated: true, 
        style: { stroke: '#f6ab6c'}}
        els[index].data.data.content.option.push({id,text:data[k]});
        els.push(newElement);
        els.push(newLink);
      });


    }
  }


  setElements(els)
}
  
  const onElementsRemove = (elementsToRemove) =>setElements((els) => {
    console.log("remove",elementsToRemove)
    const rEl = elementsToRemove[0];
    const parentId = rEl.data.data?.parentId;
    if(parentId?.length>0){
      const element = _.cloneDeep(removeElements(elementsToRemove, els));
      const parent = element.filter(e=>e.id==parentId)[0]; 
      parent.data.data.content.option = parent.data.data.content.option.filter(o=>o.id!=rEl.id)
      console.log(parent,"paret")
      return [parent,...element];

    }
    return removeElements(elementsToRemove, els);
  });
  
  return (
    <div style={{ height: "100vh",background:"#F1F3F9"}}>
      <SimulatorSlider setCheck={(check)=>setSimulating(check)} checked={simulating}/>
      {simulating&&<GreyScreen/>}
      <ReactFlow elements={elements} nodeTypes={nodeTypes} snapToGrid={true} defaultZoom={.6}
      onNodeDragStop={handleDrag}
      onElementsRemove={onElementsRemove}
      >
        <Background variant={"dots"} size={1} gap={48}/>
      {simulating&&<Simulator/>}
      </ReactFlow>

      <SideBar  visible={visible} setVisible={setVisible} handleSubmit={handleSubmit} node={elements?.filter(e=>e.id==selected.id)[0]?.data} />
    </div>
  );
}

const SimulatorSlider=(props)=>{
  const activeColor=props.checked?"#3ab795":'#01A7C2'
  return <div style={{ top:"5vh",position:"absolute",left:"45vw",zIndex:10}}>
    <Switch  onChange={props.setCheck} style={{color:activeColor,background:activeColor}} checkedChildren={<h3 style={{color:"white"}}>Simulator</h3>}
     unCheckedChildren={<h3 style={{color:"white"}}>Flow Editor</h3>}/>
  </div>
}

const GreyScreen=()=>{
  return <div style={{height:"100vh",width:"100vw",background:"black",opacity:0.4,position:"absolute",zIndex:5}}>
    
  </div>
}

export default App;

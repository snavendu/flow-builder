import './App.css';
import ReactFlow, { removeElements, Background } from 'react-flow-renderer';
import { Button, Drawer, Switch } from "antd";
import { useState, useEffect } from 'react';
import Simulator from './components/mobile';
import SideBar from './components/sidebar';
import BotNodes, { defaultBotNodes } from './components/node/botNodes';
import _, { forEach } from 'lodash';
import AddNode from './components/node/addNode';
import shortID from "short-unique-id";


const uuid = new shortID({length:4})

function checkLink(linkData, newLink) {
  const duplicate = linkData.find(l => l.source == newLink.source);

  if (!!!duplicate) {
    //update link
    return { links: [...linkData, newLink], duplicate: false }

  } else {
    const uniqueLink = linkData.filter(l => l.source !== newLink.source);
    const nE2 = {
      id: uuid(), source: newLink.target, target: duplicate.target, animated: true,
      style: { stroke: '#f6ab6c' }
    }
    return { links: [...uniqueLink, newLink, nE2], duplicate: true }
  }

}



const nodeTypes = {
  special: BotNodes,
  add: AddNode
};

function App() {
  const [elements, setElements] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState({});
  const [simulating, setSimulating] = useState(false);
  const [botMessage, setBotMessage] = useState([]);
  const [botLinks, setBotLinks] = useState([]);

  const handleVisible = (data) => {
    setVisible(!visible);
    setSelected(data);
  }

  useEffect(() => {
  }, [elements])

  const handleChange = (data, template) => {
    setElements((els) => {
      const nodeData = els.find(d => d.id == data.data.id);
      // const max= Math.max(els.map(e=>parseInt(e.id)));
      let oldNode = [...els.filter(e => !!!e.source)];
      const newId = uuid();
      const position = { x: nodeData.position.x, y: nodeData.position.y + 200 };
      const newNode = { id: `${newId}`, type: "special", data: { onChange: handleChange, openMenu: handleVisible, data: { id: `${newId}`, ...template } }, position: position };
      const oldLink = els.filter(e => !!!e.type);
      const newLink = {
        id: uuid(), animated: true,
        style: { stroke: '#f6ab6c' }, source: `${nodeData.id}`, target: newId
      }

      const { links, duplicate } = checkLink(oldLink, newLink);

      if (duplicate) {
        oldNode = oldNode.map(o => {
          if (o.position.y <= nodeData.position.y) {
            return o;
          } else {
            const newO = { ...o }
            const newPos = { x: o.position.x, y: o.position.y + 200 }
            newO.position = newPos
            return newO;
          }
        })
      }

      setVisible(true);
      setSelected(newNode)

      return [...links, ...oldNode, newNode];
    })
  }

  useEffect(() => {
    const id = uuid();
    const Elements = [
      {
        id,
        type: "special",
        // you can also pass a React component as a label
        data: { onChange: handleAdd, openMenu: handleVisible, data: { id, parentId: id } },
        position: { x: 100, y: 125 },
      }

    ];
    setElements(Elements, []);


  }, []);


  const handleDrag = (event, el) => {
    const elementsCopy = [...elements];
    elementsCopy.map(e => e.id == el.id ? e.position = el.position : null)
    setElements(elementsCopy)

  }

  const handleSimulate = (check) => {
    console.log("i ama in")
    // refactor elements into bot message and bot links
    const element = [...elements];
    const links = element.filter(e=>!!!e.type);
    const nodes = element.filter(e=>!!!e.source);
    console.log(links,nodes,"elements data")
    const botMessage = createBotMessage(nodes);
    const botLinks = createBotLinks(links);
    console.log(botMessage,botLinks,"main simulated data")
    setBotMessage(botMessage);
    setBotLinks(botLinks);
    setSimulating(check);



  }

  const createBotMessage=(flowMessages)=>{

    const bridge = flowMessages.map(f=>{
      const content = f.data.data.content;
      return {id:f.id,...content};
    })
    return bridge;
  }

  const createBotLinks=(flowLinks)=>{

    const bridge = flowLinks.map(f=>({_id:f.id, source:f.source, target:f.target}))

    return bridge;

  }


  const handleAdd = (data, template) => {

    setElements(els => {
      const elements = [...els];
      const add = elements.find(e => e.id == data.data.id);
      const addData = { ...template, id: add.id, parentId: add.data.data.parentId };
      add.data.data = addData
      add.data.onChange = handleChange
      setVisible(true);
      setSelected(add)
      return [...elements]

    })


  }
  const handleSubmit = (n, data) => {
    setVisible(false);
    const els = _.cloneDeep(elements)
    const index = els.findIndex(e => e.id == n.data.id);
    els[index].data.data.content.question = data.question;

    if(n.data?.content.type == "form"){
      const keys = Object.keys(data).filter(k => k.includes("option"));
      keys.forEach((k, i) => {
        els[index].data.data.content.labels.push(data[k]);

      })

    }

    if (n.data?.content.type == "choice") {
      const keys = Object.keys(data).filter(k => k.includes("option"));
      if (keys.length > 0) {

        keys.forEach((k, i) => {

          if (els.find(e => e.id == `c${n.data.id}-${i}`)) {
            return;
          }
          const id = uuid();
          const parent = els[index];
          const xpos = i % 2 == 0 ? parent.position.x + (i) * 150 : parent.position.x - (i + 1) * 150;
          const pos = { x: xpos, y: parent.position.y + 250 }
          const newElement = {
            id, position: pos, type: "special", data: {
              onChange: handleAdd,
              openMenu: parent.data.openMenu,
              data: { id, parentId: n.data.id }
            },
          }

          const newLink = {
            id: uuid(), source: `${n.data.id}`, target: id, label: data[k], animated: true,
            style: { stroke: '#f6ab6c' },
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 4,
            labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.7 },
          }
          els[index].data.data.content.option.push({ id, text: data[k] });
          els.push(newElement);
          els.push(newLink);
        });


      }
    }


    setElements(els)
  }

  const onElementsRemove = (elementsToRemove) => setElements((els) => {
    const rEl = elementsToRemove[0];
    const parentId = rEl.data.data?.parentId;
    if (parentId?.length > 0) {
      const element = _.cloneDeep(removeElements(elementsToRemove, els));
      const parent = element.filter(e => e.id == parentId)[0];
      parent.data.data.content.option = parent.data.data.content.option.filter(o => o.id != rEl.id)
      return [parent, ...element];

    }
    return removeElements(elementsToRemove, els);
  });

  return (
    <div style={{ height: "100vh", background: "#F1F3F9" }}>
      <SimulatorSlider setCheck={handleSimulate} checked={simulating} />
      {simulating && <GreyScreen />}
      <ReactFlow elements={elements} nodeTypes={nodeTypes} snapToGrid={true} defaultZoom={.6}
        onNodeDragStop={handleDrag}
        onElementsRemove={onElementsRemove}
      >
        <Background variant={"dots"} size={1} gap={48} />
        {simulating && <Simulator botMessage={botMessage} botLinks={botLinks} />}
      </ReactFlow>

      <SideBar visible={visible} setVisible={setVisible} handleSubmit={handleSubmit} node={elements?.filter(e => e.id == selected.id)[0]?.data} />
    </div>
  );
}

const SimulatorSlider = (props) => {
  const activeColor = props.checked ? "#3ab795" : '#01A7C2'
  return <div style={{ top: "5vh", position: "absolute", left: "45vw", zIndex: 10 }}>
    <Switch onChange={props.setCheck} style={{ color: activeColor, background: activeColor }} checkedChildren={<h3 style={{ color: "white" }}>Simulator</h3>}
      unCheckedChildren={<h3 style={{ color: "white" }}>Flow Editor</h3>} />
  </div>
}

const GreyScreen = () => {
  return <div style={{ height: "100vh", width: "100vw", background: "black", opacity: 0.4, position: "absolute", zIndex: 5 }}>

  </div>
}

export default App;

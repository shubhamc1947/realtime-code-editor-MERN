import React, { useState, useEffect } from 'react';
import './CodeEditor.scss';
import CodeMirror from '@uiw/react-codemirror';

//tooltip

import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'


// languages
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { php } from '@codemirror/lang-php';
// themes
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { solarizedLight } from '@uiw/codemirror-theme-solarized';
import { githubLight } from '@uiw/codemirror-theme-github';
import { material } from '@uiw/codemirror-theme-material';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { nord } from '@uiw/codemirror-theme-nord';
import { darcula } from '@uiw/codemirror-theme-darcula';
import { eclipse } from '@uiw/codemirror-theme-eclipse';
import ACTIONS from '../../Actions';
import { toast } from 'react-toastify';

const themes = {
  okaidia: { theme: okaidia, mode: 'dark' },
  dracula: { theme: dracula, mode: 'dark' },
  material: { theme: material, mode: 'dark' },
  monokai: { theme: monokai, mode: 'dark' },
  nord: { theme: nord, mode: 'dark' },
  darcula: { theme: darcula, mode: 'dark' },
  githubLight: { theme: githubLight, mode: 'light' },
  solarizedLight: { theme: solarizedLight, mode: 'light' },
  eclipse: { theme: eclipse, mode: 'light' },
};

const languages = {
  javascript: javascript,
  cpp: cpp,
  java: java,
  python: python,
  rust: rust,
  php: php,
};

const CodeEditor = ({ socketRef, roomId, onCodeChange }) => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      heading: 'Coding heading one',
      code: "function (){console.log('hello')}",
      lang: 'javascript',
    },
  ]);
  const [isActiveId, setIsActiveId] = useState(1);
  const [theme, setTheme] = useState('dracula');

  useEffect(() => {
    const handleCodeChange = (msg) => {
      if (Array.isArray(msg)) {
        setTabs(msg);
      } else {
        console.error('Received non-array message:', msg);
      }
    };

    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      };
    }
  }, [socketRef.current]);

  const handleChange = (e) => {
    console.warn("hello handle change")
    const { name, value } = e.target;
    setTabs((prevTabs) =>{
      const codingText=prevTabs.map((tab) =>
        tab.id === isActiveId ? { ...tab, [name]: value } : tab
      )
      const updatedTab = tabs.find((tab) => tab.id === isActiveId);
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {roomId,codingText});
      onCodeChange(codingText);
      return codingText;
    });
  };

  const handleTextValue = (value) => {
    setTabs((prevTabs) => {
      const codingText = prevTabs.map((tab) =>
        tab.id === isActiveId ? { ...tab, code: value } : tab
      );
      // Emit the updated tabs array to the socket
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {roomId,codingText});
      onCodeChange(codingText);
      return codingText;
    });
  };
  

  const addTab = () => {
    const newId = tabs.length > 0 ? tabs[tabs.length - 1].id + 1 : 1;
    const newTab = {
      id: newId,
      heading: `Coding heading ${newId}`,
      code: '',
      lang: 'javascript',
    };
    setTabs((prevTabs)=>{
      const codingText=[...prevTabs, newTab];
      setIsActiveId(newId);
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {roomId,codingText});

      return codingText;
    })
  };

  const removeTab = (id) => {
    // console.log(id);
    
    setTabs((prev)=>{
      const codingText = tabs.filter((tab) => tab.id !== id);  
      if (codingText.length === 0) {
        setIsActiveId(null);
      } else if (id === isActiveId) {
        setIsActiveId(codingText[0].id);
      }
  
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {roomId,codingText});
      onCodeChange(codingText);
      return codingText;
    });

    
  };

  const downloadFile = () => {
    const activeTab = tabs.find((tab) => tab.id === isActiveId);
    const blob = new Blob([activeTab.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File Download Successfully");
  };

  // console.log(tabs)
  const activeTab = Array.isArray(tabs) ? tabs.find((tab) => tab.id === isActiveId) : null;

  return (
    <div className="codeeditor">
      <div className="header">
        <div className="heading">
            {/* <label htmlFor="codeheading">Code Header</label>  */}
            <input type="text" id="codeheading" name="heading" value={activeTab?.heading} onChange={handleChange} />
        </div>
        <div className="effects">
          <div className="themewrap">
            <select onChange={(e) => setTheme(e.target.value)} value={theme}>
              {Object.keys(themes).map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)} ({themes[themeKey].mode.charAt(0).toUpperCase() + themes[themeKey].mode.slice(1)})
                </option>
              ))}
            </select>
          </div>
          <div className="langwrap">
            <select name="lang" onChange={handleChange} value={activeTab?.lang}>
              {Object.keys(languages).map((langKey) => (
                <option key={langKey} value={langKey}>
                  {langKey.charAt(0).toUpperCase() + langKey.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button onClick={downloadFile} data-tooltip-place="bottom-end" data-tooltip-id="downloadbtn" data-tooltip-content="Download Code" ><i className="fa-solid fa-download"></i></button>
          <Tooltip style={{ backgroundColor: "white", color: "#333" }} id="downloadbtn" />
        </div>
      </div>
      <div className="codetab">
        <div className="codetabwrap">
          <div className="tabnav">
            {Array.isArray(tabs) && tabs.map((tab,i) => (
              <div key={tab.id} className={tab.id === isActiveId ? "tab active" : "tab"}>
                <button onClick={() => setIsActiveId(tab.id)}>
                  Tab {i+1}
                </button>
                <button onClick={() => removeTab(tab.id)} className="close-btn"><i className="fa-solid fa-xmark"></i></button>
              </div>
            ))}
            <button onClick={addTab} className='addbtn' ><i className="fa-solid fa-plus"></i></button>
          </div>
          {activeTab && (
            <div className="tabinfo active">
              <CodeMirror
                value={activeTab.code}
                theme={themes[theme].theme}
                extensions={[languages[activeTab.lang] && languages[activeTab.lang]()]}
                onChange={(value) => handleTextValue(value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

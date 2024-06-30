// src/components/CodeEditor/CodeEditor.js

import React, { useState, useEffect } from 'react';
import './CodeEditor.scss';
import CodeMirror from '@uiw/react-codemirror';
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
  const [text, setText] = useState('');
  const [theme, setTheme] = useState('dracula');
  const [language, setLanguage] = useState('javascript');
  
  useEffect(() => {
    const handleCodeChange = (msg) => {
      // console.log(msg);
      setText(msg);
    };

    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      };
    }
  }, [socketRef.current]);

  const handleTextValue = (value) => {
    // console.log(value)
    setText(value);
    onCodeChange(value);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, value);
  };

  const downloadFile = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.txt'; // Specify the file name here
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File Download Successfully")
  };
  return (
    <div className="codeeditor">
      <div className="header">
        <div className="heading"><input type="text" name="" id="" placeholder='Code Bay' /></div>
        <div className="effects">
          <div className="themewrap">
            <select onChange={(e) => setTheme(e.target.value)} value={theme}>
              {Object.keys(themes).map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)} (
                  {themes[themeKey].mode.charAt(0).toUpperCase() +
                    themes[themeKey].mode.slice(1)}
                  )
                </option>
              ))}
            </select>
          </div>
          <div className="langwrap">
            <select onChange={(e) => setLanguage(e.target.value)} value={language}>
              {Object.keys(languages).map((langKey) => (
                <option key={langKey} value={langKey}>
                  {langKey.charAt(0).toUpperCase() + langKey.slice(1)}
                </option>
              ))}
            </select>
          </div>
        <button onClick={downloadFile}>Download Code</button>
        </div>
      </div>

      <CodeMirror
        value={text}
        theme={themes[theme].theme}
        height="200px"
        extensions={[languages[language] && languages[language]()]}
        onChange={(value, viewUpdate) => handleTextValue(value)}
      />
    </div>
  );
};

export default CodeEditor;

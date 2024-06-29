import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
//language
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { php } from '@codemirror/lang-php';
//theme 
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { solarizedLight } from '@uiw/codemirror-theme-solarized';
import { githubLight } from '@uiw/codemirror-theme-github';
import { material } from '@uiw/codemirror-theme-material';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { nord } from '@uiw/codemirror-theme-nord';
import { darcula } from '@uiw/codemirror-theme-darcula';
import { eclipse } from '@uiw/codemirror-theme-eclipse';

const themes = {
  okaidia: { theme: okaidia, mode: 'dark' },
  dracula: { theme: dracula, mode: 'dark' },
  solarizedLight: { theme: solarizedLight, mode: 'light' },
  githubLight: { theme: githubLight, mode: 'light' },
  material: { theme: material, mode: 'dark' },
  monokai: { theme: monokai, mode: 'dark' },
  nord: { theme: nord, mode: 'dark' },
  darcula: { theme: darcula, mode: 'dark' },
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

export default function Editor() {
  const [theme, setTheme] = useState('dracula');
  const [language, setLanguage] = useState('javascript');

  return (
    <div>
      <CodeMirror
        value="console.log('hello world!');"
        height="200px"
        theme={themes[theme].theme}
        extensions={[languages[language]({ jsx: true })]}
      />
      <br /><br /><br /><br /><br /><br />
      <select onChange={(e) => setTheme(e.target.value)} value={theme}>
        {Object.keys(themes).map((themeKey) => (
          <option key={themeKey} value={themeKey}>
            {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)} ({themes[themeKey].mode.charAt(0).toUpperCase() + themes[themeKey].mode.slice(1)})
          </option>
        ))}
      </select>
      <br /><br />
      <select onChange={(e) => setLanguage(e.target.value)} value={language}>
        {Object.keys(languages).map((langKey) => (
          <option key={langKey} value={langKey}>
            {langKey.charAt(0).toUpperCase() + langKey.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

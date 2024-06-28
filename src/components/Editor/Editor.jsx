import React from 'react'
import CodeMirror from 'codemirror';
const Editor = () => {

    var cm = new CodeMirror.fromTextArea(document.getElementById("editor"), {lineNumbers: true})
  return (
    <div>
        <h1>Hello Editor</h1>
        <textarea id={editor} />
    </div>
  )
}

export default Editor
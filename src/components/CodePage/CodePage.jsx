import React, { useState, useEffect } from "react";
import "./codepage.scss";
import ACTIONS from "../../Actions";

const CodePage = ({ socketRef, roomId }) => {
  const [text, setText] = useState("");
  
  useEffect(() => {
    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE, (msg) => {
        setText(msg);
      });
    }
  }, [socketRef.current]);

  const handleTextValue = (e) => {
    setText(e.target.value);
    // console.log(e.target.value)
    socketRef.current.emit(ACTIONS.CODE_CHANGE, e.target.value);
  };
  return (
    <div className="codepage">
      <div className="header">
        <div className="heading">Header Heading</div>
        <div className="effects">
          <div className="themewrap"></div>
          <div className="langwrap"></div>
        </div>
      </div>
      <textarea
        style={{ width: "100%", height: "50vh", padding: "1rem" }}
        value={text}
        onChange={handleTextValue}
      />
    </div>
  );
};

export default CodePage;

import React, { useState, useEffect } from "react";
import "./codepage.scss";
import ACTIONS from "../../Actions";

const CodePage = ({ socketRef, roomId, onCodeChange }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const handleCodeChange = (msg) => {
      setText(msg);
      console.log(msg);
    };

    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      };
    }
  }, [socketRef.current]);

  const handleTextValue = (e) => {
    const newText = e.target.value;
    setText(newText);
    onCodeChange(newText);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, newText);
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

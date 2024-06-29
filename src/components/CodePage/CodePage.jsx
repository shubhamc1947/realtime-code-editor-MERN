import React, { useState, useEffect } from "react";
import "./codepage.scss";
import ACTIONS from "../../Actions";

const CodePage = ({ socketRef, roomId }) => {
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
      />
    </div>
  );
};

export default CodePage;

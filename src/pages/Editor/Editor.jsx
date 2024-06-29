import "./editor.scss";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ClientLogo } from "../../components/ClientLogo/ClientLogo";

import CodePage from "../../components/CodePage/CodePage";

import { initSocket } from "../../socket";
import ACTIONS from "../../Actions";
import { toast } from "react-hot-toast";
import { scopeCompletionSource } from "@codemirror/lang-javascript";
const Editor = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);

  const { roomId } = useParams();

  const reactNavigator = useNavigate();

  const location = useLocation();

  const [clientList, setClientList] = useState([]);

  // console.log(JSON.stringify(clientList) + " client list");
  // [{"socketId":"saC86VW_iK77IVLSAAAT","username":"adsfss"}] formate of this
  // console.log(location.state.username);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      // Error handling
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }
      //Error handling done here

      // join creating event
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId,userSocketMap }) => {
          // console.log(JSON.stringify(userSocketMap))
          // jo user join hua usko notification nhi bhejna hai
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }

          setClientList(clients);
        }
      );

      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId,username }) => {
            toast.success(`${username} Got Disconnected.`);
            setClientList(prev=>{
              return prev.filter(curr=>curr.socketId!=socketId);
            })
        }
      );


    };
    init();
    return () => {
      //alll the on events we need to close it in returning fun
      socketRef.current.off(ACTIONS.DISCONNECTED)
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.disconnect();
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className="editor">
      <div className="leftside">
        <div className="lefttop">
          <h3>Logo here</h3>
          <h5>{location.state?.username}</h5>
          <h6>Room {roomId?roomId:""}</h6>
          <hr />
          <div className="clientList">
            {clientList &&
              clientList.map((list) => (
                <ClientLogo key={list.socketId} username={list.username} />
              ))}
          </div>
        </div>
        <div className="leftbottom">
          <button onClick={copyRoomId}>Copy Room ID</button>
          <button onClick={leaveRoom}>Leave Room</button>

        </div>
      </div>
      <div className="rightside">
        
        <CodePage socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }} />
      </div>
    </div>
  );
};

export default Editor;

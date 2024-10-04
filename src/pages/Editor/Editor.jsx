import "./editor.scss";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams, Navigate } from "react-router-dom";
import { ClientLogo } from "../../components/ClientLogo/ClientLogo";
import CodePage from "../../components/CodePage/CodePage";
import { initSocket } from "../../socket";
import ACTIONS from "../../Actions";
import { toast } from "react-hot-toast";

const Editor = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(""); // Initialize with an empty string
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const location = useLocation();
  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      const handleErrors = (e) => {
        // console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      };

      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId, userSocketMap }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }

        setClientList(clients);

        if (codeRef.current) {
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} got disconnected.`);
        setClientList((prev) => prev.filter((client) => client.socketId !== socketId));
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.disconnect();
      }
    };
  }, [roomId, location.state?.username, reactNavigator]);

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
          <h3>Logo heresss</h3>
          <h5>{location.state?.username}</h5>
          <h6>Room {roomId || ""}</h6>
          <hr />
          <div className="clientList">
            {clientList.map((client) => (
              <ClientLogo key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <div className="leftbottom">
          <button onClick={copyRoomId}>Copy Room ID</button>
          <button onClick={leaveRoom}>Leave Room</button>
        </div>
      </div>
      <div className="rightside">
        <CodePage
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default Editor;

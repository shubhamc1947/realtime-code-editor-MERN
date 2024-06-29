import "./editor.scss";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ClientLogo } from "../../components/ClientLogo/ClientLogo";

import CodePage from "../../components/CodePage/CodePage";

import { initSocket } from "../../socket";
import ACTIONS from "../../Actions";
import { toast } from "react-hot-toast";
const Editor = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);

  const { roomid } = useParams();

  const reactNavigator = useNavigate();

  const location = useLocation();

  const [clientList, setClientList] = useState([]);

  console.log(JSON.stringify(clientList) + " client list");
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
        roomid,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId,userSocketMap }) => {
          console.log(JSON.stringify(userSocketMap))
          // jo user join hua usko notification nhi bhejna hai
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }

          setClientList(clients);
        }
      );
    };
    init();
    return () => {
      //alll the on events we need to close it in returning fun
      socketRef.current.off(ACTIONS.JOINED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomid);
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
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure nostrum
        dolorum ducimus quae labore accusamus ullam iste necessitatibus, enim
        est vero sapiente autem nisi libero ex? Omnis asperiores placeat fuga
        provident magnam dolores Wha tis going on I don't know that abcd what is
        hapducimus nisi obcaecati, officiis, quae earum veniam facere et rem.
        Velit, aperiam. Quis dignissimos distinctio ex, eos nemo eaque minus
        debitis repudiandae saepe odit voluptatum iusto vel consectetur eligendi
        optio sequi maxime. Doloremque accusantium sequi totam ratione ea atque
        facere error id incidunt, quasi facilis similique rem architecto
        delectus! Assumenda modi fuga, commodi delectus animi fugit explicabo
        odit dolore tenetur, sed non cum. Cumque molestiae corrupti accusamus!
        Nesciunt asperiores sequi corporis quaerat laborum ullam recusandae,
        reiciendis neque, earum debitis unde doloribus beatae! Inventore
        molestiae accusantium sunt illum sit reiciendis quas?
        {/* <CodePage socketRef={socketRef}
                    roomId={roomid}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }} /> */}
      </div>
    </div>
  );
};

export default Editor;

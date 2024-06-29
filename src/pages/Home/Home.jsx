  import React,{useState} from 'react'
  import {v4 as id} from 'uuid';
  import toast from 'react-hot-toast';
  import { useNavigate } from 'react-router-dom';
  import './home.scss'
import { compileString } from 'sass';
  const Home = () => {
    
    const navigate=useNavigate();
    const [roomid, setRoomid] = useState("")
    const [username, setUsername] = useState("")


    const joinRoom = (e) => {
      console.log("join rroomm")
      e.preventDefault();
      if (roomid==="" || username==="") {
          toast.error('ROOM ID & username is required');
          return;
      }

      // Redirect
      navigate(`/editor/${roomid}`, {
          state: {
              username,
          },
      });
  };

    function createNewRoom(){
      const newRoomId=id();
      setRoomid(newRoomId);
      toast.success('Created a new room');
    }


    return (
      <div className='home'>
        <form autoComplete='off'>

          <div className='inputgroup'>
            <label htmlFor="roomid">Room Id</label>
            <input type="text"  name="roomid" id="roomid" value={roomid} onChange={e=>setRoomid(e.target.value)} />
          </div>
          <div className='inputgroup'>
            <label htmlFor="username">User Name</label>
            <input type="text"  name="username" id="username"  value={username} onChange={e=>setUsername(e.target.value)} />
          </div>
          <div className='inputgroup'>
            <input type="submit" onClick={joinRoom} value="Enter Room" />
          </div>
          <div className='inputgroup'>
            <p>Enter in <span className='newroomlink' onClick={createNewRoom}>New Room</span> </p>
          </div>
        </form>
      </div>
    )
  }

  export default Home
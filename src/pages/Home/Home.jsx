// src/pages/Home/Home.js
import { Link,useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Home.scss";

import { ToastContainer, toast } from 'react-toastify';
const Home = () => {
  // const [joke, setjoke] = useState("Hello uncle");
  // async function dadJokesApi() {
  //   const data = await fetch("https://icanhazdadjoke.com/slack");
  //   const fetching = data.json();
  //   // const joke = fetching.then((data) => setjoke(data.attachments[0].text));
  //   // console.log(joke)
  //   // setjoke(joke);
  // }

  // useEffect(() => {
  //   dadJokesApi();
  // }, []);

  const location = useLocation();
  console.log(location)
  useEffect(() => {
    if (location.state?.message) {
      toast.error(location.state.message);
      location.state.message="";
    }
  }, [location.state]);


  return (
    <>
      {/* home section */}
      <div className="home">
        <div className="container">
          <div className="textcont">
            <h1>Where Code Meets Collaboration.</h1>
            <h2 style={{ color: "red" }}>
              {/* {joke == "" ? <p>Loading...</p> : joke} */}
            </h2>
            <h2>
              Solve, Teach, and Interview: The Online Code Editor for Every
              Occasion...
            </h2>
            <h3>
              <Link to={"/createRoom"} className="sharebtn">Create New Room</Link>
            </h3>
            {/* <h3>
              <Link to={"/test"}>Tab</Link>
            </h3> */}
          </div>
        </div>
      </div>

      <div className="videocont">
          {/* demo section */}
        <video  autoPlay loop  muted playsInline>
          <source src="./demo.mp4" type="video/mp4" />
        </video>
      </div>


      {/* About Section */}
      <div className="about">
          <h1>Collaborative Coding ...</h1>
        <div className="container">
          <div className="feature">
            <h1>Team Up</h1>
            <p>
              Open a shared editor, write or paste code, and collaborate with
              friends and colleagues in real-time.
            </p>
            <Link to={"/createRoom"} className="sharebtn">Code Together</Link>
          </div>
          <div className="feature">
            <h1>Evaluate Talent</h1>
            <p>
              Assign coding tasks and observe candidates' skills in real-time,
              whether in-person or remote.
            </p>
            <Link to={"/createRoom"} className="sharebtn">Conduct an Interview</Link>
          </div>
          <div className="feature">
            <h1>Share Knowledge</h1>
            <p>
              Share your code with students and peers, and guide them through
              the learning process. Top universities rely on us every day.
            </p>
            <Link to={"/createRoom"} className="sharebtn">Teach to learn</Link>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="container">
          <div className="links">
            <a href="https://github.com/shubhamc1947" target="_blank"><i className="fa-brands fa-github"></i></a>
            <a href="https://www.linkedin.com/in/shubhamchat03/" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
            <a href="https://twitter.com/shubham_1947" target="_blank"><i className="fa-brands fa-square-x-twitter"></i></a>
          </div>
          <h4>Created By Shubham with ❤</h4>
        </div>
      </div>
    </>
  );
};

export default Home;

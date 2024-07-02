// src/pages/Home/Home.js
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Home.scss";

const Home = () => {
  const [joke, setjoke] = useState("");
  async function dadJokesApi() {
    const data = await fetch("https://icanhazdadjoke.com/slack");
    const fetching = data.json();
    const joke = fetching.then((data) => setjoke(data.attachments[0].text));
    // console.log(joke)
    // setjoke(joke);
  }

  useEffect(() => {
    dadJokesApi();
  }, []);

  return (
    <div className="home">
      <h1>Welcome to the Real-Time Code Editor</h1>
      <h2 style={{ color: "red" }}>
        {joke == "" ? <p>Loading...</p> : joke}
      </h2>
      <h3>
        <Link to={"/createRoom"}>Create New Room</Link>
      </h3>
      <h3>
        <Link to={"/test"}>Tab</Link>
      </h3>
    </div>
  );
};

export default Home;

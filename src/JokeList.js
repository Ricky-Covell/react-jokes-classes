import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({ numOfJokes }) => {
  const [jokes, setJokes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  /* retrieve jokes from API */

  useEffect(() => {
    const getJokes = async () => {
      let jokeArr = [...jokes]
      let seenJokes = new Set()
      try {
        while (jokeArr.length < numOfJokes) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...jokeObj } = res.data;

          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
          } else {
            console.error("duplicate found!");
          }
        }
        setJokes(j);
        setIsLoading(false)
      } catch (err) {
        console.error(err);
      }
    }

    if (jokes.length === 0) getJokes()
  }, [jokes, numOfJokes])

  /* empty joke list then call getJokes */

  const generateNewJokes = () => {
    setJokes([])
    setIsLoading(true)
  }

  /* change vote for this id by delta (+1 or -1) */

  const vote = (id, delta) => {
    setJokes(jokesArr => {
      jokesArr.map(j => (
        j.id === id ? {...j, votes: j.votes + delta} : j
      ))
    })
  }

  /* render: either loading spinner or list of sorted jokes. */

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes)

  return (
    <div className="JokeList">
      <button 
        className="JokeList-getmore" 
        onClick={generateNewJokes}
      >
        Get New Jokes
      </button>

      {sortedJokes.map(({joke, id, votes}) => (
        <Joke text={joke} key={id} id={id} votes={votes} vote={vote} />
      ))}
    </div>
  )
}

export default JokeList
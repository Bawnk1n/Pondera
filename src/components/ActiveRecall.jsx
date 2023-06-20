import { useState, useEffect } from "react";
import Card from "./Card";

//Things that are being passed down into here

// cardWindowDeck={cardWindowDeck}
// setViewportMode={changeViewportMode}
// flip={flip}
// flipCard={flipCard}
// viewportMode={viewportMode}
// setDeckScore={setDeckScore}

// JUST figuring out how to stop the onClick for the Card, and to have it flip on Submit.

export function ActiveRecallWindow(props) {
  //needed to send down into card to make it so card cant be flipped by clicking
  const [isARMode, setIsARMode] = useState(false);
  //needed so deck cant be switched mid-practice
  const [recallDeck, setRecallDeck] = useState({
    name: "",
    cards: [],
    practiceModeScore: 0,
    activeRecallScore: 0,
  });
  //index is for incrementing the shown card
  const [index, setIndex] = useState(0);
  //to keep track of users input into the text box
  const [guess, setGuess] = useState("");
  //to keep track of getting the answer right or wrong
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [passScore, setPassScore] = useState(0);
  const [failScore, setFailScore] = useState(0);
  //keeps track of if game is over
  const [isGameOver, setIsGameOver] = useState(false);
  //for final score
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    if (recallDeck.activeRecallScore < finalScore) {
      setRecallDeck((old) => ({
        ...old,
        activeRecallScore: finalScore,
      }));
    }
  }, [finalScore]);

  useEffect(() => {
    if (finalScore > 0) {
      props.setDeckScore(recallDeck);
    }
  }, [recallDeck]);

  //for start button
  function start() {
    props.setFlip();
    setRecallDeck(props.cardWindowDeck);
    setIsARMode(true);
  }

  //for updating guess based on user input
  function updateGuess(e) {
    setGuess(e.target.value);
  }

  //handles guess submit
  function handleSubmit(e) {
    e.preventDefault();
    if (!recallDeck.cards[index].back) {
      next();
    } else if (
      guess.toLowerCase() === recallDeck.cards[index].back.toLowerCase()
    ) {
      setIsCorrect(true);
      setPassScore((old) => old + 1);
    } else {
      setIsIncorrect(true);
      setFailScore((old) => old + 1);
    }
    props.flipCard();
  }

  //next button functionality
  function next() {
    setIsIncorrect(false);
    setIsCorrect(false);
    setGuess("");
    if (index < recallDeck.cards.length - 1) {
      setIndex((old) => old + 1);
    } else {
      setIsGameOver(true);
      setFinalScore(Math.round((passScore / recallDeck.cards.length) * 100));
      //   gameOver();
    }
    props.flipCard();
  }

  return (
    <div>
      <h2>Active Recall</h2>
      {!isARMode && <p>Selected Deck: {props.cardWindowDeck.name}</p>}
      {(props.cardWindowDeck.cards.length > 0 && (
        <button onClick={start} className="btn--red">
          Start 'Active Recall'
        </button>
      )) || <p>Choose a deck from the sidebar</p>}
      {isCorrect && <h4>Correct!</h4>}
      {isIncorrect && <h4>Incorrect!</h4>}
      {passScore > 0 && <p>Score: {passScore}</p>}
      {finalScore > 0 && <p>Final score: {finalScore}</p>}
      {isARMode && !isGameOver && (
        <Card
          card={recallDeck.cards[index]}
          flip={props.flip}
          flipCard={props.flipCard}
          recallMode={isARMode}
          viewportMode={props.viewportMode}
        />
      )}
      {!isIncorrect && !isCorrect && !isGameOver && isARMode && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="guess"
            value={guess}
            onChange={updateGuess}
          ></input>
          <button type="submit">submit</button>
        </form>
      )}

      {(isCorrect || isIncorrect) && (
        <button onClick={next} className="btn--red">
          Next
        </button>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import Card from "./Card";

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
  //for saving final score purposes
  const [deckFolder, setDeckFolder] = useState("");
  //index is for incrementing the shown card
  const [index, setIndex] = useState(0);
  //to keep track of users input into the text box
  const [guess, setGuess] = useState("");
  //to keep track of getting the answer right or wrong
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [passScore, setPassScore] = useState(0);
  //keeps track of if game is over
  const [isGameOver, setIsGameOver] = useState(false);
  //for final score
  const [finalScore, setFinalScore] = useState(0);
  //for making the Next button clickable by pressing enter.
  const buttonRef = useRef();
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isButtonVisible]);
  //for making the text input focused after clicking Next
  const inputRef = useRef();
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isIncorrect, isCorrect]);

  useEffect(() => {
    if (
      !recallDeck.activeRecallScore ||
      recallDeck.activeRecallScore < finalScore
    ) {
      setRecallDeck((old) => ({
        ...old,
        activeRecallScore: finalScore,
      }));
    }
  }, [finalScore]);

  useEffect(() => {
    if (finalScore > 0) {
      props.setDeckScore(recallDeck, deckFolder);
      props.addToCardWindow(recallDeck);
    }
  }, [recallDeck]);

  //for start button
  function start() {
    props.setFlip();
    setIndex(0);
    setRecallDeck(props.cardWindowDeck);
    setDeckFolder(props.currentFolder);
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
      guess.toLowerCase().trimEnd() ===
      recallDeck.cards[index].back.toLowerCase()
    ) {
      setIsCorrect(true);
      setPassScore((old) => old + 1);
    } else {
      setIsIncorrect(true);
    }
    setIsButtonVisible(true);
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
    setIsButtonVisible(false);
  }

  //functionality for retry button at the end of the game
  function retry() {
    setIndex(0);
    setIsGameOver(false);
    setPassScore(0);
    setFinalScore(0);
    props.setFlip();
  }

  //----------------------------------------RETURN STARTS HERE------------------------------------------------------

  return (
    <div className="active-recall-page">
      <h2 className="active-recall-header">Active Recall</h2>
      {!isARMode && (
        <p>
          (you lose the ability to flip the card, you must type in the contents
          of the back exactly to obtain points!)
        </p>
      )}
      {recallDeck.cards.length === 0 ? (
        <>
          <p className="active-recall-p">
            Selected Deck: <b>{props.cardWindowDeck.name}</b>
          </p>
          <p className="active-recall-p">
            Top Score: <b>{props.cardWindowDeck.activeRecallScore}%</b>
          </p>
        </>
      ) : (
        <>
          <p className="active-recall-p">
            Selected Deck: <b>{recallDeck.name}</b>
          </p>
          <p className="active-recall-p">
            Top Score: <b>{recallDeck.activeRecallScore}%</b>
          </p>
        </>
      )}

      {props.cardWindowDeck.cards.length > 0 && !isARMode && (
        <button onClick={start} className="btn--red">
          Start
        </button>
      )}
      {props.cardWindowDeck.cards.length === 0 && (
        <p>Choose a deck from the sidebar</p>
      )}
      {isCorrect && <h4>Correct!</h4>}
      {isIncorrect && <h4>Incorrect!</h4>}
      {passScore > 0 && (
        <p>
          Score:{" "}
          <b>
            {passScore} / {recallDeck.cards.length}
          </b>
        </p>
      )}
      {isARMode && <p>Remaining: {recallDeck.cards.length - 1 - index}</p>}
      {finalScore > 0 && (
        <>
          <p>
            Final score: <b>{finalScore}%</b>
          </p>
          <div className="side-by-side-btns">
            <button onClick={retry} className="btn--red">
              Retry
            </button>
            <button
              className="btn--red"
              onClick={() => {
                props.setViewportMode("View");
                props.showHideStats();
                props.resetStats();
              }}
            >
              Exit
            </button>
          </div>
        </>
      )}
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
            ref={inputRef}
            autoCorrect="on"
            className="text-input"
          ></input>
          <button type="submit" className="btn--red">
            submit
          </button>
        </form>
      )}

      {isButtonVisible && (
        <button
          onClick={next}
          className="btn--red"
          type="submit"
          ref={buttonRef}
        >
          Next
        </button>
      )}
    </div>
  );
}

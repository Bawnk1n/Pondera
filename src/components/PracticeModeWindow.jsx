import { useEffect, useState } from "react";
import Card from "./Card";

export function PracticeModeWindow(props) {
  const [showButtons, setShowButtons] = useState(false);
  const [index, setIndex] = useState(0);
  const [passScore, setPassScore] = useState(0);
  const [failScore, setFailScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [practiceModeDeck, setPracticeModeDeck] = useState({
    name: "",
    cards: [],
    score: 0,
  });

  useEffect(() => {
    if (props.deck.score < finalScore) {
      props.setDeckScore(finalScore);
    }
  }, [finalScore]);

  function pass() {
    if (index < props.deck.cards.length - 1) {
      setIndex((old) => old + 1);
      setPassScore((old) => old + 1);
    } else {
      setFinalScore(
        Math.round(((passScore + 1) / props.deck.cards.length) * 100)
      ); //had to add 1 to passScore here because it wasnt updating fast enough using setPassScore()
    }
  }

  // How to get score to the main file?

  function fail() {
    if (index < props.deck.cards.length - 1) {
      setIndex((old) => old + 1);
      setFailScore((old) => old + 1);
    } else {
      setFinalScore(Math.round((passScore / props.deck.cards.length) * 100)); //left passScore the same here because thats how it would be if you clicked fail button last
      props.deck.score < finalScore ? (props.deck.score = finalScore) : null;
    }
  }

  function endPracticeMode() {
    props.setViewportMode("View");
  }

  return (
    <div id="practice-mode-window">
      <button
        name="end-practice"
        className="btn--red bigger"
        onClick={endPracticeMode}
      >
        End Practice Mode
      </button>
      <h5>Top Score: {props.deck.score}</h5>
      {finalScore ? null : (
        <div id="new-card-onclick" onClick={() => setShowButtons(true)}>
          <Card
            card={props.deck.cards[index]}
            flip={props.flip}
            flipCard={props.flipCard}
            practiceMode={props.practiceMode}
            viewportMode={props.viewportMode}
          />
        </div>
      )}

      {showButtons ? (
        <div id="btn--pass-fail">
          <button
            id="pass"
            class="btn--small"
            onClick={() => {
              pass();
              setShowButtons(false);
              props.flipCard();
            }}
          >
            Pass
          </button>
          <button
            id="fail"
            class="btn--small"
            onClick={() => {
              fail();
              setShowButtons(false);
              props.flipCard();
            }}
          >
            Fail
          </button>
        </div>
      ) : null}

      {finalScore ? (
        <h6>Final Score: {finalScore}</h6>
      ) : (
        <h6>
          Passed: {passScore} <br></br>Failed: {failScore}
        </h6>
      )}
    </div>
  );
}

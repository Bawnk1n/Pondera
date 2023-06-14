import { useState } from "react";
import Card from "./Card";

export function PracticeModeWindow(props) {
  const [showButtons, setShowButtons] = useState(false);
  const [index, setIndex] = useState(0);
  const [passScore, setPassScore] = useState(0);
  const [failScore, setFailScore] = useState(0);

  function pass() {
    if (index < props.deck.length) {
      setIndex((old) => old + 1);
      setPassScore((old) => old + 1);
    } else {
      props.changePracticeMode();
    }
  }

  function fail() {
    if (index < props.deck.length) {
      setIndex((old) => old + 1);
      setFailScore((old) => old + 1);
    } else {
      props.changePracticeMode();
    }
  }

  return (
    <div id="practice-mode-window">
      <div id="new-card-onclick" onClick={() => setShowButtons(true)}>
        <Card
          card={props.deck[index]}
          flip={props.flip}
          flipCard={props.flipCard}
          practiceMode={props.practiceMode}
        />
      </div>

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
      <h6>
        Passed: {passScore} <br></br>Failed: {failScore}
      </h6>
    </div>
  );
}

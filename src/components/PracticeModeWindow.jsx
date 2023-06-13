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

  //just figuring out how to get the card to flip back to the front when the pass/fail buttons are clicked

  return (
    <div id="practice-mode-window">
      <div id="new-card-onclick" onClick={() => setShowButtons(true)}>
        <Card card={props.deck[index]} />
      </div>

      <button id="pass" onClick={pass}>
        Pass
      </button>
      <button id="fail">Fail</button>
    </div>
  );
}

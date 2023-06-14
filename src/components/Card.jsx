import { useState } from "react";

export default function Card(props) {
  // Needed to make localFlip because I moved the flip var to app.jsx so I could do things with it in practice mode,
  // but it fucked things up here and was flipping ALL cards in the card window when ONE was clicked

  const [localFlip, setLocalFlip] = useState(false);

  function localSwitch() {
    localFlip ? setLocalFlip(false) : setLocalFlip(true);
  }

  return (
    <div
      class="card"
      onClick={
        props.practiceMode
          ? props.flip === false
            ? props.flipCard
            : null
          : localSwitch
      }
      style={
        props.practiceMode
          ? { backgroundColor: props.flip ? "#b4c0c9" : "" }
          : { backgroundColor: localFlip ? "#b4c0c9" : "" }
      }
    >
      <p>
        {props.practiceMode
          ? props.flip
            ? props.card.back
            : props.card.front
          : localFlip
          ? props.card.back
          : props.card.front}
      </p>
    </div>
  );
}

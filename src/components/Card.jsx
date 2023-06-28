import { useState, useEffect } from "react";

export default function Card(props) {
  // Needed to make localFlip because I moved the flip var to app.jsx so I could do things with it in practice mode,
  // but it fucked things up here and was flipping ALL cards in the card window when ONE was clicked

  const [localFlip, setLocalFlip] = useState(false);

  function localSwitch() {
    if (props.viewportMode != "Active Recall") {
      localFlip ? setLocalFlip(false) : setLocalFlip(true);
    }
  }

  useEffect(() => {
    setLocalFlip(false);
  }, [props.cardWindowDeck]);

  return (
    <div
      className="card"
      //this ternary facilitates only being able to flip the card once in Practice Mode
      onClick={
        props.viewportMode === "Practice"
          ? props.flip === false
            ? props.flipCard
            : null
          : localSwitch
      }
      style={
        props.viewportMode === "Practice"
          ? { backgroundColor: props.flip ? "#b4c0c9" : "" }
          : { backgroundColor: localFlip ? "#b4c0c9" : "" }
      }
    >
      <p>
        {props.viewportMode === "Practice" ||
        props.viewportMode === "Active Recall"
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

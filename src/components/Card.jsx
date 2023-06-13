import { useState } from "react";

export default function Card(props) {
  const [flip, setFlip] = useState(false);

  function flipCard() {
    flip === false ? setFlip(true) : setFlip(false);
  }

  return (
    <div
      class="card"
      onClick={flipCard}
      style={{ backgroundColor: flip ? "#b4c0c9" : "" }}
    >
      <p>{flip ? props.card.back : props.card.front}</p>
    </div>
  );
}

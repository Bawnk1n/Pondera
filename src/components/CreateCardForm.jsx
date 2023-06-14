import { useState, useRef } from "react";

export default function CreateCardForm(props) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const frontRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    props.saveCard(front, back);
    setFront("");
    setBack("");
    frontRef.current.focus();
  }

  return (
    <div id="create-a-card">
      <h2>Create A New Card</h2>
      <form id="form--create-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="front">Front</label>
          <input
            type="text"
            autoComplete="off"
            name="front"
            id="front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            ref={frontRef}
            tabIndex="1"
          />
        </div>
        <button type="submit" tabIndex="3" class="btn--small">
          Create
        </button>
        <div className="form-group">
          <label for="back">Back</label>
          <input
            type="text"
            autoComplete="off"
            name="back"
            id="back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            tabIndex="2"
          />
        </div>
      </form>
    </div>
  );
}

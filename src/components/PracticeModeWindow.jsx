import { useEffect, useState } from "react";
import Card from "./Card";

export function PracticeModeWindow(props) {
  //used to render buttons dynamically
  const [showButtons, setShowButtons] = useState(false);
  //used to increment which card is being shows
  const [index, setIndex] = useState(0);
  //used to calculate score at the end
  const [passScore, setPassScore] = useState(0);
  const [failScore, setFailScore] = useState(0);
  //the score at the end
  const [finalScore, setFinalScore] = useState(0);
  //load props.cardWindowDeck into here to avoid being able to change the deck mid practice
  const [practiceModeDeck, setPracticeModeDeck] = useState({
    name: "",
    cards: [],
    score: 0,
  });
  //used to send down into <Card /> to adjust its 'flip' property
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  //used to change the Score of the practice deck after the game concludes
  useEffect(() => {
    if (practiceModeDeck.score < finalScore) {
      props.setDeckScore(finalScore);
    }
  }, [finalScore]);

  // functionality for pass button, increments score
  function pass() {
    if (index < practiceModeDeck.cards.length - 1) {
      setIndex((old) => old + 1);
      setPassScore((old) => old + 1);
    } else {
      setFinalScore(
        Math.round(((passScore + 1) / practiceModeDeck.cards.length) * 100)
      ); //had to add 1 to passScore here because it wasnt updating fast enough using setPassScore()
    }
  }

  // functionality for fail button
  function fail() {
    if (index < practiceModeDeck.cards.length - 1) {
      setIndex((old) => old + 1);
      setFailScore((old) => old + 1);
    } else {
      setFinalScore(
        Math.round((passScore / practiceModeDeck.cards.length) * 100)
      ); //left passScore the same here because thats how it would be if you clicked fail button last
      practiceModeDeck.score < finalScore
        ? (practiceModeDeck.score = finalScore)
        : null;
    }
  }

  // loads cardWindowDeck into practiceModeDeck to avoid being able to change the deck mid practice, sets isPracticeMode to true to pass down to <Card />
  function startPracticeMode() {
    setPracticeModeDeck(props.cardWindowDeck);
    setIsPracticeMode(true);
  }

  // ends practice mode, changes viewport back to "View"
  function endPracticeMode() {
    props.setViewportMode("View");
    setIsPracticeMode(false);
  }

  return (
    <div id="practice-mode-window">
      {/* end practice mode button */}
      <button
        name="end-practice"
        className="btn--red bigger"
        onClick={endPracticeMode}
      >
        End Practice Mode
      </button>

      {/* shows the last deck you clicked on from the sidebar */}
      <h5>Deck selected: {props.cardWindowDeck.name}</h5>

      {/* start practice mode */}
      <button onClick={startPracticeMode}>Start Practice Mode</button>

      {/* shows top score of deck selected from sidebar, should update this to practiceModeDeck score when isPracticeMode */}
      <h5>Top Score: {props.cardWindowDeck.score}</h5>

      {/* until the game is over, it shows one card at a time, incremented by pass/fail buttons */}
      {finalScore ? null : (
        <div id="new-card-onclick" onClick={() => setShowButtons(true)}>
          {practiceModeDeck.cards.length > 0 && (
            <Card
              card={practiceModeDeck.cards[index]}
              flip={props.flip}
              flipCard={props.flipCard}
              practiceMode={isPracticeMode}
              viewportMode={props.viewportMode}
            />
          )}
        </div>
      )}

      {/* pass fail buttons */}
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

      {/* if game is over, shows final score, else shows passed and failed variables */}
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

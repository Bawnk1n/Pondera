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
    practiceModeScore: 0,
    activeRecallScore: 0,
  });
  //to make sure we save the points to the right deck
  const [deckFolder, setDeckFolder] = useState("");
  //used to send down into <Card /> to adjust its 'flip' property
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  //used to change the Score of the practice deck after the game concludes
  useEffect(() => {
    if (practiceModeDeck.practiceModeScore < finalScore) {
      setPracticeModeDeck((old) => ({
        ...old,
        practiceModeScore: finalScore,
      }));
    }
  }, [finalScore]);

  useEffect(() => {
    if (finalScore > 0) {
      props.setDeckScore(practiceModeDeck, deckFolder);
      props.changeCardWindowDeck(practiceModeDeck);
    }
  }, [practiceModeDeck]);

  // functionality for pass button, increments score
  function pass() {
    if (index < practiceModeDeck.cards.length - 1) {
      setIndex((old) => old + 1);
      setPassScore((old) => old + 1);
    } else {
      setPassScore((old) => old + 1);
      setFinalScore(
        Math.round(((passScore + 1) / practiceModeDeck.cards.length) * 100)
      ); //had to add 1 to passScore here because it wasnt updating fast enough using setPassScore()
      setIsPracticeMode(false);
    }
  }

  // functionality for fail button
  function fail() {
    if (index < practiceModeDeck.cards.length - 1) {
      setIndex((old) => old + 1);
    } else {
      setFinalScore(
        Math.round((passScore / practiceModeDeck.cards.length) * 100)
      ); //left passScore the same here because thats how it would be if you clicked fail button last
      practiceModeDeck.practiceModeScore < finalScore
        ? (practiceModeDeck.practiceModeScore = finalScore)
        : null;
      setIsPracticeMode(false);
    }
  }

  // loads cardWindowDeck into practiceModeDeck to avoid being able to change the deck mid practice, sets isPracticeMode to true to pass down to <Card />
  function startPracticeMode() {
    setPracticeModeDeck(props.cardWindowDeck);
    setDeckFolder(props.currentFolder);
    setIsPracticeMode(true);
    props.setFlip(false);
  }

  // ends practice mode, changes viewport back to "View"
  function endPracticeMode() {
    if (practiceModeDeck.cards.length > 0) {
      props.changeCardWindowDeck(practiceModeDeck);
    }

    props.setViewportMode("View");
    props.resetStats();
    setIsPracticeMode(false);
  }

  function retry() {
    setIsPracticeMode(true);
    setIndex(0);
    setPassScore(0);
    setFinalScore(0);
    setPracticeModeDeck(props.cardWindowDeck);
  }

  return (
    <div id="practice-mode-window">
      {/* shows the last deck you clicked on from the sidebar */}
      {!isPracticeMode &&
        (props.cardWindowDeck.name ? (
          <h5>Deck selected: {props.cardWindowDeck.name}</h5>
        ) : (
          <h5>Select a deck</h5>
        ))}

      {/* shows top score of deck selected from sidebar, should update this to practiceModeDeck score when isPracticeMode */}
      {props.cardWindowDeck.cards.length > 0 && (
        <h5>
          Top Score: {props.cardWindowDeck.practiceModeScore}%<br></br>...
        </h5>
      )}

      {isPracticeMode && !finalScore ? (
        <h6>
          Current Score: {passScore} / {practiceModeDeck.cards.length} <br></br>
          <br></br>
          Remaining: {practiceModeDeck.cards.length - index}
        </h6>
      ) : null}

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
      {showButtons && isPracticeMode ? (
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
      ) : isPracticeMode ? (
        <h6>Whats on the other side?</h6>
      ) : null}

      {/* if game is over, shows final score, else shows passed and failed variables */}
      {finalScore ? <h6>Final Score: {finalScore}%</h6> : null}
      {finalScore ? (
        <h6>
          {passScore} / {practiceModeDeck.cards.length}
        </h6>
      ) : null}

      <div className="side-by-side-btns">
        {finalScore > 0 && (
          <button onClick={retry} className="btn--red">
            Retry
          </button>
        )}
        {/* end practice mode button */}
        <button
          name="end-practice"
          className="btn--red bigger"
          onClick={endPracticeMode}
        >
          Exit
        </button>
        {/* start practice mode */}
        {!isPracticeMode && !finalScore && (
          <button onClick={startPracticeMode} className="btn--red">
            Start
          </button>
        )}
      </div>
    </div>
  );
}

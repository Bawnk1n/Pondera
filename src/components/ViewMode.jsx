import { CardWindow } from "./CardWindow";
import { BigRedButton } from "./BigRedButton";
import CreateCardForm from "./CreateCardForm";
import { useState, useEffect } from "react";

export function ViewMode(props) {
  const [stayHidden, setStayHidden] = useState(false);

  useEffect(() => {
    let deckStats = document.getElementById("deck-stats");
    if (deckStats && !stayHidden) {
      deckStats.classList.add("visible");
      props.setShowStats(true);
    }
  }, [props.cardWindowDeck]);

  return (
    <>
      {props.cardWindowDeck.name ? (
        <h6>
          Selected Deck: <b>{props.cardWindowDeck.name}</b>
        </h6>
      ) : (
        <h6>Select a deck to view its contents</h6>
      )}
      {props.cardWindowDeck.cards.length > 0 && (
        <div id="deck-stats">
          <p>Deck Stats:</p>
          <p>
            Practice Mode Score:{" "}
            <b>{props.cardWindowDeck.practiceModeScore}%</b>
            <br></br> Active Recall Score:{" "}
            <b>{props.cardWindowDeck.activeRecallScore}%</b>
          </p>
        </div>
      )}
      {props.cardWindowDeck.cards.length > 0 && (
        <BigRedButton
          mainFunction={() => {
            props.showHideStats(),
              props.showStats ? setStayHidden(true) : setStayHidden(false);
          }}
          innerText={props.showStats ? "Hide stats" : "Show stats"}
        />
      )}
      <CardWindow
        cardWindowDeck={props.cardWindowDeck}
        folders={props.folders}
      />
      {/* CREATE A CARD FORM */}
      {/* DISAPPEAR WHEN NOT IN VIEW MODE */}
      {props.viewportMode != "View" ? null : (
        <CreateCardForm saveCard={props.saveCard} />
      )}
    </>
  );
}

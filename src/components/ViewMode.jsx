import { CardWindow } from "./CardWindow";
import { BigRedButton } from "./BigRedButton";
import CreateCardForm from "./CreateCardForm";
import { useState, useEffect, useRef } from "react";
import { MediumRedButton } from "./MediumRedButton";
import { MeButtons } from "./MeButtons";

export function ViewMode(props) {
  const [stayHidden, setStayHidden] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const uploadRef = useRef();

  useEffect(() => {
    let deckStats = document.getElementById("deck-stats");
    if (deckStats && !stayHidden) {
      deckStats.classList.add("visible");
      props.setShowStats(true);
    }
  }, [props.cardWindowDeck]);

  function changeEditMode() {
    editMode ? setEditMode(false) : setEditMode(true);
  }

  function downloadDeck() {
    let jsonDeck = JSON.stringify(props.cardWindowDeck);
    let blob = new Blob([jsonDeck], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = props.cardWindowDeck.name + ".json";
    a.click();
  }

  function onUploadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        props.setCardWindowDeck(data);
        props.setCardAdded(true);
        console.log("upload successful", data);
        uploadRef.current.value = "";
      } catch (error) {
        console.log("error parsing file", error);
      }
    };
    reader.onerror = (event) => {
      console.error("file could not be read", event);
    };
    reader.readAsText(file);
  }

  return (
    <>
      {props.cardWindowDeck.name ? (
        <>
          <h6>
            Selected Deck: <b>{props.cardWindowDeck.name}</b>
          </h6>
        </>
      ) : (
        <>
          <h6>Select a deck to view its contents</h6>
        </>
      )}
      <div className="side-by-side-btns">
        <h6 className="space">Upload Deck: </h6>
        <input type="file" onChange={onUploadFile} ref={uploadRef} />
      </div>
      {props.cardWindowDeck.cards.length > 0 && (
        <BigRedButton
          mainFunction={() => {
            props.showHideStats(),
              props.showStats ? setStayHidden(true) : setStayHidden(false);
          }}
          innerText={props.showStats ? "Hide stats" : "Show stats"}
        />
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
        <div className="side-by-side-btns">
          <BigRedButton
            mainFunction={changeEditMode}
            innerText={editMode ? "Exit Edit Mode" : "Edit Mode"}
          />
          <BigRedButton
            mainFunction={downloadDeck}
            innerText={"Download Deck"}
          />
        </div>
      )}
      <MeButtons
        clearWindow={props.clearWindow}
        saveNewDeck={() => props.saveNewDeck(props.cardWindowDeck)}
        updateDeckFunction={props.updateDeckFunction}
        cardWindowDeck={props.cardWindowDeck}
        cardAdded={props.cardAdded}
        viewportMode={props.viewportMode}
        updateDeck={props.updateDeck}
      />
      <CardWindow
        cardWindowDeck={props.cardWindowDeck}
        folders={props.folders}
        editMode={editMode}
        setFolders={props.setFolders}
        setCardWindowDeck={props.setCardWindowDeck}
        setUpdateDeck={props.setUpdateDeck}
        setCardAdded={props.setCardAdded}
      />
      {/* CREATE A CARD FORM */}
      {/* DISAPPEAR WHEN NOT IN VIEW MODE */}
      {props.viewportMode != "View" ? null : (
        <CreateCardForm saveCard={props.saveCard} />
      )}
    </>
  );
}

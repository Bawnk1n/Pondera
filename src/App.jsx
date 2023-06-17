import { useState, useEffect } from "react";
import CreateCardForm from "./components/CreateCardForm";
import Card from "./components/Card";
import "./App.css";
import DeckThumbnail from "./components/DeckThumbnail";
import { PracticeModeWindow } from "./components/PracticeModeWindow";
import { CardWindow } from "./components/CardWindow";
import { presetDecks } from "./assets/Decks";
import { GenerateDecks } from "./components/GenerateDecks";

// TODO make 3 modes of practice.. 'Practice', 'Recall', 'Expand'. Practice is simple flipping, with a pass/fail button
//    after flipping each card (one at a time in window), Recall is you have to type out the answer, Expand will use chatGPT
//    api to take the word on the back and write a sentence with it. the user has to guess the rough gist of what the sentence
//    means, and the AI will pass/fail them and provide more info on the word and context
// TODO make decks persistent... MongoDB?
// TODO make more preset decks
// TODO make a select dropdown list at the top of the preset decks window, which will change what populates the window..
//    IE Cooking and Food, Household etc..
// TODO Add a prompt to save current cards in cardWindowDeck when clicking on a deck from the left side
// TODO change 'delete decks' to something that allows you to delete specific decks instead of all of them

function App() {
  const [decks, setDecks] = useState(() => {
    let myDecks = localStorage.getItem("myDecks");
    return myDecks ? JSON.parse(myDecks) : [];
  });
  const [cardWindowDeck, setCardWindowDeck] = useState({
    name: "",
    cards: [],
    score: 0,
  });

  const [updateDeck, setUpdateDeck] = useState(false);
  const [practiceModeDeck, setPracticeModeDeck] = useState();
  const [practiceMode, setPracticeMode] = useState(false);
  const [flip, setFlip] = useState(false);
  const [cardAdded, setCardAdded] = useState(false);
  const [viewportMode, setViewportMode] = useState("View");
  const [folders, setFolders] = useState([
    {
      name: "",
      decks: [],
    },
  ]);
  const [isSavingFolder, setIsSavingFolder] = useState(false); //for rendering the div responsible for saving a folder
  const [isCreateNewFolder, setIsCreateNewFolder] = useState(false); //for saving new folder window
  const [isAddToExisting, setIsAddToExisting] = useState(false); //for saving new folder window
  const [rightSelectedFolder, setRightSelectedFolder] = useState(""); //for selecting which decks to show in right window
  const [isChoosingAFolder, setIsChoosingAFolder] = useState(false);
  const [selectedFolderToSave, setSelectedFolderToSave] = useState("");

  useEffect(() => {
    localStorage.setItem("myDecks", JSON.stringify(decks));
  }, [decks]);

  function flipCard() {
    flip === false ? setFlip(true) : setFlip(false);
  }

  function setDeckScore(score) {
    setCardWindowDeck((old) => {
      return { ...old, score: score };
    });
  }

  function saveNewCard(cardFront, cardBack) {
    setCardWindowDeck((old) => {
      return {
        ...old,
        cards: [...old.cards, { front: cardFront, back: cardBack }],
      };
    });
    setCardAdded(true);
  }

  function saveNewDeck(deck) {
    if (deck.cards.length === 0) {
      alert("No cards to save");
      return;
    }
    if (deck.name === "") {
      let name = prompt("Name your new deck", "New Deck");
      if (!name) {
        return;
      }
      deck.name = name;
    }
    setDecks({
      name: deck.name,
      cards: deck.cards,
      score: 0,
    });

    if (folders[0].decks.length === 0) {
      let name = prompt("Create a new folder", "New Folder");
      setFolders([
        {
          name: name,
          decks: [deck],
        },
      ]);
    } else {
      setIsSavingFolder(true);
    }
    setCardWindowDeck({
      name: "",
      cards: [],
      score: 0,
    });
    setCardAdded(false);
  }
  //for button that shows up only when creating new folder when some already exist
  function createNewFolderForButton() {
    let name = prompt("Name your new folder", "New Folder");
    setFolders((old) => [...old, { name: name, decks: [decks] }]);
    setIsSavingFolder(false);
  }

  function addToExistingFolderForButton() {
    setIsChoosingAFolder(true);
  }

  function handleSubmitToNewFolder() {
    setFolders((old) => {
      return old.map((folder) => {
        if (folder.name === selectedFolderToSave) {
          return { ...folder, decks: [...folder.decks, decks] };
        } else {
          return folder;
        }
      });
    });
    setDecks({
      name: "",
      cards: [],
      score: 0,
    });
    setIsSavingFolder(false);
  }

  function handleChangeSelectedFolderToSave(e) {
    setSelectedFolderToSave(e.target.value);
  }

  function addToCardWindow(deck) {
    if (cardAdded) {
      let response = confirm(
        "Continuing will clear the current cards without saving, continue?"
      );
      if (response) {
        clearWindow();
        setCardWindowDeck(deck);
        setCardAdded(false);
      } else {
        return;
      }
    } else {
      setCardWindowDeck(deck);
      setUpdateDeck(true);
    }
  }

  function updateDeckFunction() {
    let name = prompt("Name your new deck", cardWindowDeck.name);
    if (!name) {
      return;
    }
    cardWindowDeck.name = name;
    setDecks(cardWindowDeck);
    if (folders[0].decks.length === 0) {
      let name = prompt("Create a new folder", "New Folder");
      setFolders([
        {
          name: name,
          decks: [cardWindowDeck],
        },
      ]);
    } else {
      setIsSavingFolder(true);
    }
    setCardWindowDeck({
      name: "",
      cards: [],
      score: 0,
    });
    setCardAdded(false);
  }

  function clearWindow() {
    setCardWindowDeck({
      name: "",
      cards: [],
      score: 0,
    });
    setUpdateDeck(false);
    setCardAdded(false);
  }

  function changeViewportMode(mode) {
    setViewportMode(mode);
  }

  function handleChangeRightSelectedFolder(e) {
    console.log(e.target.value);
    setRightSelectedFolder(e.target.value);
  }

  //----------------------------------------------RETURN STARTS HERE--------------------------------------------------

  return (
    <div id="app">
      {/* HEADERS */}
      <h1>Pondera</h1>
      <h5>Flash-Card-App</h5>
      {/* CREATE A CARD FORM */}
      {/* DISAPPEAR WHEN IN PRACTICE MODE */}
      {viewportMode != "View" ? null : (
        <CreateCardForm saveCard={saveNewCard} />
      )}

      {/* SAVING A NEW FOLDER WINDOW RENDERS ONLY WHEN SAVING A NEW FOLDER */}
      {isSavingFolder && (
        <div id="saving-folder-window">
          <h4>Create a new folder or add to an existing folder?</h4>
          <button onClick={createNewFolderForButton}>Create New Folder</button>
          <button onClick={addToExistingFolderForButton}>
            Add To Existing
          </button>
          {isChoosingAFolder && (
            <>
              <select
                onChange={handleChangeSelectedFolderToSave}
                value={selectedFolderToSave}
              >
                <option value="">Choose a folder</option>
                {folders.map((folder) => {
                  return (
                    <option key={folder.name} value={folder.name}>
                      {folder.name}
                    </option>
                  );
                })}
              </select>
              <button onClick={handleSubmitToNewFolder}>Save</button>
            </>
          )}
        </div>
      )}

      {/* IF THERE IS CARDS IN THE WINDOW, SHOW THE PRACTICE MODE BUTTON */}
      <div className="side-by-side-btns">
        {cardWindowDeck.cards.length > 0 &&
        viewportMode != "Practice" &&
        viewportMode != "Generate" ? (
          <button
            name="btn--practice-mode"
            onClick={() => setViewportMode("Practice")}
            className="btn--red"
          >
            Enter Practice Mode
          </button>
        ) : null}
        {viewportMode != "Generate" ? (
          <button
            name="viewport--generate"
            className="btn--red"
            onClick={() => setViewportMode("Generate")}
          >
            Generate Decks
          </button>
        ) : null}
        {viewportMode != "View" ? (
          <button
            name="viewport--view"
            className="btn--red"
            onClick={() => setViewportMode("View")}
          >
            Main Viewport
          </button>
        ) : null}
      </div>
      {/* SWITCH STATEMENT RESPONSIBLE FOR MAIN VIEWPORT */}
      {(() => {
        switch (viewportMode) {
          case "View":
            return (
              <CardWindow
                cardWindowDeck={cardWindowDeck}
                flip={flip}
                flipCard={flipCard}
              />
            );
            break;
          case "Practice":
            return (
              <PracticeModeWindow
                deck={cardWindowDeck}
                setViewportMode={changeViewportMode}
                flip={flip}
                flipCard={flipCard}
                practiceMode={practiceMode}
                viewportMode={viewportMode}
                setDeckScore={setDeckScore}
              />
            );
            break;
          case "Generate":
            return <GenerateDecks saveNewDeck={saveNewDeck} />;
            break;
          default:
            return null;
        }
      })()}
      {/* IF YOU CHOOSE A DECK FROM THE SIDEBAR, BTN WILL CHANGE TO 'UPDATE DECK', OTHERWISE IT WILL BE 'SAVE DECK' */}
      {/* BUTTONS SHOW WHEN IN VIEW MODE */}
      {viewportMode === "View" ? (
        <div id="me-buttons">
          {updateDeck ? (
            <button onClick={updateDeckFunction} class="btn--save-deck">
              Update Deck
            </button>
          ) : (
            <button
              onClick={() => saveNewDeck(cardWindowDeck)}
              class="btn--save-deck"
            >
              Save Deck
            </button>
          )}
          {/* CLEAR WINDOW BTN ALWAYS SHOWN */}
          <button onClick={clearWindow} class="btn--save-deck">
            Clear Window
          </button>
        </div>
      ) : null}

      {/* RIGHT DECK SELECT CONTAINER FOR USER CREATED DECKS */}
      <div id="deck-select-container">
        <p>Your Decks</p>
        <select
          onChange={handleChangeRightSelectedFolder}
          value={rightSelectedFolder}
        >
          <option value="">Select</option>
          {folders.map((folder) => {
            return (
              <option value={folder.name} key={folder.name}>
                {folder.name}
              </option>
            );
          })}
        </select>
        <p>{rightSelectedFolder}</p>
        {folders.map((folder) => {
          if (folder.name === rightSelectedFolder) {
            return folder.decks.map((deck) => (
              <DeckThumbnail deck={deck} addToCardWindow={addToCardWindow} />
            ));
          }
        })}
        {/* DELETE DECKS BUTTON IF DECKS EXIST */}
        {decks.length > 0 ? (
          <button onClick={() => setDecks([])}>Delete Decks</button>
        ) : null}
      </div>
      {/* LEFT DECK SELECT CONTAINER FOR PRESET DECKS */}
      <div id="left-deck-select-container">
        <p>Preset Decks</p>
        <select name="categories">
          {presetDecks.map((category) => {
            return <option name={category.name}>{category.name}</option>;
          })}
        </select>
        {presetDecks.map((categories) => {
          return categories.decks.map((deck) => (
            <DeckThumbnail deck={deck} addToCardWindow={addToCardWindow} />
          ));
        })}
      </div>
    </div>
  );
}

export default App;

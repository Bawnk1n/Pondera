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
// TODO need to fix practice mode so the deck cant be switched in the middle of practice mode... make a practiceModeDeck in practiceMode component?

function App() {
  //used for loading a deck into folders
  const [decks, setDecks] = useState({ name: "", cards: [], score: 0 });
  //used for displaying cards in the card viewport
  const [cardWindowDeck, setCardWindowDeck] = useState({
    name: "",
    cards: [],
    score: 0,
  });
  //used for changing Save Deck button to Update Deck
  const [updateDeck, setUpdateDeck] = useState(false);
  //UNFINISHED going to be used to ensure deck cant be changed in the middle of Practice Mode
  const [practiceModeDeck, setPracticeModeDeck] = useState();
  //DEPRECATED was once used to change to practice mode before ViewportMode was created
  const [practiceMode, setPracticeMode] = useState(false);
  //used to change the flip in Practice Mode, needed a different var than one in Card component to make it so card could only be flipped once in practice mode
  const [flip, setFlip] = useState(false);
  // Is used when adding a new deck to the viewport, if there is unsaved cards currently in the viewport, the user will get a popup
  const [cardAdded, setCardAdded] = useState(false);
  //used to change between "View", "Practice", and "Generate" modes
  const [viewportMode, setViewportMode] = useState("View");

  //used to save folders of decks which can be viewed and selected from via the right sidebar
  const [folders, setFolders] = useState(() => {
    let myFolders = localStorage.getItem("myFolders");
    return myFolders ? JSON.parse(myFolders) : [{ name: "", decks: [] }];
  });
  //for rendering the div responsible for saving a folder
  const [isSavingFolder, setIsSavingFolder] = useState(false);
  //for saving new folder window //DEPRECATED ?
  const [isCreateNewFolder, setIsCreateNewFolder] = useState(false);
  //for saving new folder window //DEPRECATED ?
  const [isAddToExisting, setIsAddToExisting] = useState(false);
  //for selecting which decks to show in right window
  const [rightSelectedFolder, setRightSelectedFolder] = useState("");
  // DOUBLE CHECK THIS, MIGHT BE ABLE TO DELETE THIS OR THE ONE ABOVE
  const [selectedFolderToSave, setSelectedFolderToSave] = useState("");
  //used to render Select element with all current folders when saving a new deck
  const [isChoosingAFolder, setIsChoosingAFolder] = useState(false);

  //used to save users folders and decks to remain persistent through browser refreshes.
  useEffect(() => {
    localStorage.setItem("myFolders", JSON.stringify(folders));
  }, [folders]);

  //used in Practice Mode to make sure card can only be flipped once
  function flipCard() {
    flip === false ? setFlip(true) : setFlip(false);
  }

  //used in Practice Mode to update the 'score' property in a deck after Practice Mode is completed and score is calculated
  function setDeckScore(score) {
    setCardWindowDeck((old) => {
      return { ...old, score: score };
    });
  }

  //used in Create button in the "View" mode to add a user created card to the viewport
  function saveNewCard(cardFront, cardBack) {
    setCardWindowDeck((old) => {
      return {
        ...old,
        cards: [...old.cards, { front: cardFront, back: cardBack }],
      };
    });
    setCardAdded(true);
  }

  //used on Save Deck button, loads a deck into '[decks, setDecks]', then loads that deck into a folder and resets the deck to a blank slate
  function saveNewDeck(deck) {
    // check if there is actually any cards to save
    if (deck.cards.length === 0) {
      alert("No cards to save");
      return;
    }

    // name the new deck
    let name = prompt("Name your new deck", "New Deck");
    if (!name) {
      return;
    }
    deck.name = name;

    // I think i  need this so that deck can be scoped outside of this function and be used in the buttons that are rendered when choosing a folder to save to
    setDecks({
      name: deck.name,
      cards: deck.cards,
      score: 0,
    });

    // create a new folder if none exist
    if (folders[0].decks.length === 0) {
      let name = prompt("Create a new folder", "New Folder");
      setFolders([
        {
          name: name,
          decks: [deck],
        },
      ]);
      //changes right sidebar to show the decks in the newly created folder
      setRightSelectedFolder(name);
    } else {
      //renders a window in the middle of the screen with buttons responsible for picking a folder and saving to it
      setIsSavingFolder(true);
    }
    // reset cardWindowDeck
    setCardWindowDeck({
      name: "",
      cards: [],
      score: 0,
    });
    //if user had added custom cards to viewport this var is designed to warn them they will delete them
    setCardAdded(false);
  }

  //for button that shows up only when creating new folder when some already exist
  function createNewFolderForButton() {
    let name = prompt("Name your new folder", "New Folder");
    setFolders((old) => [...old, { name: name, decks: [decks] }]);
    //might need to delete this or something if it causes problems, just trying to get this down into Generate
    setSelectedFolderToSave(name);
    //changes right sidebar to show the decks in the newly created folder
    setRightSelectedFolder(name);
    //unrenders div in the middle of the screen
    setIsSavingFolder(false);
  }

  //renders a SELECT element with all existing folders... might be able to make this work better -- CHECK BACK HERE
  function addToExistingFolderForButton() {
    setIsChoosingAFolder(true);
  }

  //submit button for saving a new folder
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
    // reset decks
    setDecks({
      name: "",
      cards: [],
      score: 0,
    });
    //unrenders div
    setIsSavingFolder(false);
  }

  // the onChange of the Select element when saving a deck into an existing folder
  function handleChangeSelectedFolderToSave(e) {
    setSelectedFolderToSave(e.target.value);
  }

  // used for the decks in either sidebar to load them into the viewport
  function addToCardWindow(deck) {
    if (cardAdded) {
      //if there is unsaved cards currently in the viewport, give the user a warning
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
      setViewportMode("View");
      setCardWindowDeck(deck);
      //changes Save Deck button to Update Deck
      setUpdateDeck(true);
    }
  }

  //functionality for Update Deck button
  function updateDeckFunction() {
    // name deck... again? is this truly necessary?
    let name = prompt("Name your new deck", cardWindowDeck.name);
    if (!name) {
      return;
    }
    cardWindowDeck.name = name;
    //if folders is empty, make a new folder
    if (folders[0].decks.length === 0) {
      let name = prompt("Create a new folder", "New Folder");
      setFolders([
        {
          name: name,
          decks: [cardWindowDeck],
        },
      ]);
    } else {
      //load current deck into [decks, setDecks] in case it needs to be scoped out of this function
      setDecks(cardWindowDeck);
      //if folders exist, render the div which has the buttons responsible for creating or saving to an existing folder
      setIsSavingFolder(true);
    }
    //reset viewport to blank
    setCardWindowDeck({
      name: "",
      cards: [],
      score: 0,
    });
    //if user added any cards this would be true and cause a warning down the line
    setCardAdded(false);
  }

  //Clear Window button removes all cards from viewport, changes button back to Save Deck if it was set to Update Deck
  function clearWindow() {
    setCardWindowDeck({
      name: "",
      cards: [],
      score: 0,
    });
    setUpdateDeck(false);
    setCardAdded(false);
  }

  // change between viewports.. current options are "View" (main), "Practice Mode", and "Generate"
  function changeViewportMode(mode) {
    setViewportMode(mode);
  }

  // I BELIEVE this is for choosing which folder to render on the right sidebar
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
      {/* DISAPPEAR WHEN NOT IN VIEW MODE */}
      {viewportMode != "View" ? null : (
        <CreateCardForm saveCard={saveNewCard} />
      )}

      {/* SAVING A NEW FOLDER WINDOW RENDERS ONLY WHEN SAVING A NEW FOLDER */}
      {isSavingFolder && (
        <div id="saving-folder-window">
          <h4>Create a new folder or add to an existing folder?</h4>
          <button onClick={createNewFolderForButton} className="btn--red">
            Create New Folder
          </button>
          <button onClick={addToExistingFolderForButton} className="btn--red">
            Add To Existing
          </button>
          {/* RENDERS ONLY AFTER CLICKING 'ADD TO EXISTING' BUTTON */}
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
              <button onClick={handleSubmitToNewFolder} className="btn--red">
                Save
              </button>
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
        {viewportMode === "View" ? (
          <button
            name="viewport--generate"
            className="btn--red"
            onClick={() => setViewportMode("Generate")}
          >
            Generate Decks
          </button>
        ) : null}
        {viewportMode != "View" && viewportMode != "Practice" ? (
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
            return (
              <GenerateDecks
                saveNewDeck={saveNewDeck}
                folders={folders}
                selectedFolder={rightSelectedFolder}
              />
            );
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
        {/* DROPDOWN TO SELECT FOLDER */}
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
        {folders.map((folder) => {
          if (folder.name === rightSelectedFolder) {
            return folder.decks.map((deck) => (
              <DeckThumbnail deck={deck} addToCardWindow={addToCardWindow} />
            ));
          }
        })}
        {/* DELETE DECKS BUTTON IF DECKS EXIST */}
        {folders[0].decks.length > 0 ? (
          <button onClick={() => setFolders([{ name: "", decks: [] }])}>
            Delete All Folders
          </button>
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

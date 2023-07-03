import { useState, useEffect } from "react";
import "./App.css";
import { PracticeModeWindow } from "./components/PracticeModeWindow";
import { GenerateDecks } from "./components/GenerateDecks";
import { ActiveRecallWindow } from "./components/ActiveRecall";
import { BigRedButton } from "./components/BigRedButton";

import { SaveToFolderPopup } from "./components/SaveToFolderPopup";
import { ViewMode } from "./components/ViewMode";
import { RightDeckSelectWindow } from "./components/RightDeckSelectWindow";
import { LeftDeckSelectWindow } from "./components/LeftDeckSelectWindow";

// TODO Add a prompt to save current cards in cardWindowDeck when clicking on a deck from the left side
// TODO Add Swap function to App.jsx which switches card fronts with backs
// TODO make edit and delete buttons for cards
// TODO refactor CSS page
// TODO change Generate Form to have a Select input AND text input for Language and Topic, changeable by a radio buttons?

function App() {
  //used for loading a deck into folders
  const [decks, setDecks] = useState({
    name: "",
    cards: [],
    practiceModeScore: 0,
    activeRecallScore: 0,
  });

  //used for displaying cards in the card viewport
  const [cardWindowDeck, setCardWindowDeck] = useState({
    name: "",
    cards: [],
    practiceModeScore: 0,
    activeRecallScore: 0,
  });

  //for showing deck stats, need this in this component because it gets passed down into multiple components
  const [showStats, setShowStats] = useState(false);

  //functionality for showing and hiding the deck stats
  function showHideStats() {
    //showStats ? setShowStats(false) : setShowStats(true);
    let deckStats = document.getElementById("deck-stats");
    deckStats.classList.contains("visible")
      ? (deckStats.classList.remove("visible"), setShowStats(false))
      : (deckStats.classList.add("visible"), setShowStats(true));
  }

  //used for changing Save Deck button to Update Deck
  const [updateDeck, setUpdateDeck] = useState(false);

  //used to change the flip in Practice Mode, needed a different var than one in Card component to make it so card could only be flipped once in practice mode
  const [flip, setFlip] = useState(false);

  // Is used when adding a new deck to the viewport, if there is unsaved cards currently in the viewport, the user will get a popup
  const [cardAdded, setCardAdded] = useState(false);

  //used to change between "View", "Practice", and "Generate" modes
  const [viewportMode, setViewportMode] = useState("Generate");

  //used to save folders of decks which can be viewed and selected from via the right sidebar
  const [folders, setFolders] = useState(() => {
    let myFolders = localStorage.getItem("myFolders");
    return myFolders ? JSON.parse(myFolders) : [{ name: "", decks: [] }];
  });

  //for rendering the div responsible for saving a folder
  const [isSavingFolder, setIsSavingFolder] = useState(false);

  //for selecting which decks to show in right window, automatically selects first folder if folders exist
  const [rightSelectedFolder, setRightSelectedFolder] = useState(
    folders[0].decks.length > 0 ? folders[0].name : ""
  );

  //used to save users folders and decks to remain persistent through browser refreshes.
  useEffect(() => {
    localStorage.setItem("myFolders", JSON.stringify(folders));
  }, [folders]);

  //used in Practice Mode to make sure card can only be flipped once
  function flipCard() {
    flip === false ? setFlip(true) : setFlip(false);
  }

  //sending this down into Active Recall so it starts on the right side each time.
  function setFlipFunction() {
    setFlip(false);
  }

  //used in Practice Mode to update the 'score' property in a deck after Practice Mode is completed and score is calculated
  function setDeckScore(updatedDeck, folderName) {
    setFolders((oldFolders) => {
      return oldFolders.map((folder) => {
        if (folder.name === folderName) {
          let newDecks = folder.decks.map((deck) => {
            if (deck.name === updatedDeck.name) {
              return {
                ...deck,
                practiceModeScore: updatedDeck.practiceModeScore,
              };
            } else {
              return deck;
            }
          });
          return { ...folder, decks: newDecks };
        } else {
          return folder;
        }
      });
    });
  }

  //developer tool for resetting all the scores in all the decks in all the folders
  function resetDeckScores() {
    setFolders((oldFolders) => {
      return oldFolders.map((folder) => {
        let newDecks = folder.decks.map((deck) => {
          return { ...deck, practiceModeScore: 0, activeRecallScore: 0 };
        });
        return { ...folder, decks: newDecks };
      });
    });
  }

  //for setting the score AFTER active recall mode completes
  function setActiveRecallScore(updatedDeck, deckFolder) {
    setFolders((oldFolders) => {
      return oldFolders.map((folder) => {
        if (folder.name === deckFolder) {
          let newDecks = folder.decks.map((deck) => {
            if (deck.name === updatedDeck.name) {
              return {
                ...deck,
                activeRecallScore: updatedDeck.activeRecallScore,
              };
            } else {
              return deck;
            }
          });
          return { ...folder, decks: newDecks };
        } else {
          return folder;
        }
      });
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
      practiceModeScore: 0,
      activeRecallScore: 0,
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
      practiceModeScore: 0,
      activeRecallScore: 0,
    });
    //if user had added custom cards to viewport this var is designed to warn them they will delete them
    setCardAdded(false);
  }

  //Used to update the cardWindowDeck after EDITING the front or back in the Card component
  useEffect(() => {
    if (cardWindowDeck.cards.length > 0) {
      setCardWindowDeck((old) => {
        let updatedDeck = null;
        folders.forEach((folder) => {
          folder.decks.forEach((deck) => {
            if (
              deck.name === old.name &&
              deck.practiceModeScore === old.practiceModeScore &&
              deck.activeRecallScore === old.activeRecallScore
            ) {
              updatedDeck = deck;
            }
          });
        });
        return updatedDeck ? updatedDeck : old;
      });
    }
  }, [folders]);

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
      viewportMode === "Generate" ? setViewportMode("View") : null;
      clearWindow();
      setCardWindowDeck(deck);
      //changes Save Deck button to Update Deck
      setUpdateDeck(true);
    }
  }

  //for facilitating the css transition effects on the cards in View mode
  const [isCardsViewable, setIsCardsViewable] = useState(false);
  useEffect(() => {
    let viewport = document.getElementById("card-window-transition");
    if (viewport) {
      viewport.classList.remove("visible");
      setIsCardsViewable(false);
    }
  }, [viewportMode, cardWindowDeck]);

  //for facilitating the css transition effects on the cards in the main card window
  useEffect(() => {
    let viewport = document.getElementById("card-window-transition");
    if (viewport) {
      viewport.classList.add("visible");
      setIsCardsViewable(true);
    }
  }, [isCardsViewable]);

  //functionality for Update Deck button
  function updateDeckFunction() {
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
      setFolders((oldFolders) => {
        return oldFolders.map((folder) => {
          if (folder.name === rightSelectedFolder) {
            return {
              ...folder,
              decks: folder.decks.map((deck) => {
                if (deck.name === cardWindowDeck.name) {
                  return {
                    ...deck,
                    cards: cardWindowDeck.cards,
                  };
                } else {
                  return deck;
                }
              }),
            };
          } else {
            return folder;
          }
        });
      });
    }
    //reset viewport to blank
    setCardWindowDeck({
      name: "",
      cards: [],
      practiceModeScore: 0,
      activeRecallScore: 0,
    });
    //doing this to update the pages in the useEffect
    setRightSelectedFolder(rightSelectedFolder);
    //if user added any cards this would be true and cause a warning down the line
    setCardAdded(false);
  }

  //Clear Window button removes all cards from viewport, changes button back to Save Deck if it was set to Update Deck
  function clearWindow() {
    if (cardAdded) {
      let response = confirm("continue without saving?");
      if (!response) {
        return;
      }
    }
    setCardWindowDeck({
      name: "",
      cards: [],
      practiceModeScore: 0,
      activeRecallScore: 0,
    });
    setUpdateDeck(false);
    setCardAdded(false);
  }

  // change between viewports.. current options are "View" (main), "Practice Mode", and "Generate"
  function changeViewportMode(mode) {
    setViewportMode(mode);
  }

  // for choosing which folder to render on the right sidebar.. passed down into multiple components
  function handleChangeRightSelectedFolder(e) {
    setRightSelectedFolder(e.target.value);
  }

  // for passing down into components so to set the show stats button correctly when exiting
  function resetStats() {
    setShowStats(false);
  }

  //----------------------------------------------RETURN STARTS HERE--------------------------------------------------

  return (
    <div id="app">
      {/* HEADERS */}
      <h1 id="header-text">Ponderosa</h1>
      <h5>Flash-Card-App</h5>

      {/* DEVELOPER BUTTON FOR RESETTING ALL SCORES */}
      {/* <button onClick={resetDeckScores}>Developer</button> */}
      {/* <div>
        <button onClick={() => setFolders([{ name: "", decks: [] }])}>
          Developer Reset Folders
        </button>
      </div> */}
      {/* test */}

      {/* SAVING A NEW FOLDER WINDOW RENDERS ONLY WHEN SAVING A NEW FOLDER */}
      {isSavingFolder && (
        <SaveToFolderPopup
          setFolders={setFolders}
          setDecks={setDecks}
          setIsSavingFolder={setIsSavingFolder}
          setRightSelectedFolder={setRightSelectedFolder}
          folders={folders}
          rightSelectedFolder={rightSelectedFolder}
          decks={decks}
        />
      )}

      <div id="header-btns" className="side-by-side-btns">
        {/* SHOW Generate, Practice Mode BUTTONS IN VIEW MODE */}
        {viewportMode === "View" ? (
          <>
            <BigRedButton
              mainFunction={() => setViewportMode("Generate")}
              innerText={"Generate Decks"}
            />
            <BigRedButton
              mainFunction={() => setViewportMode("Practice")}
              innerText={"Practice Mode"}
            />
            <BigRedButton
              mainFunction={() => setViewportMode("Active Recall")}
              innerText={"Active Recall Mode"}
            />
          </>
        ) : null}

        {/* SHOW Main Viewport BUTTON WHEN IN GENERATE AND ACTIVE RECALL MODE */}
        {viewportMode != "View" && viewportMode != "Practice" ? (
          <BigRedButton
            mainFunction={() => {
              setViewportMode("View");
              setShowStats(false);
            }}
            innerText={"Main Viewport"}
          />
        ) : null}
      </div>

      {/* SWITCH STATEMENT RESPONSIBLE FOR MAIN VIEWPORT */}
      {(() => {
        switch (viewportMode) {
          case "View":
            return (
              <ViewMode
                setFolders={setFolders}
                cardWindowDeck={cardWindowDeck}
                showStats={showStats}
                viewportMode={viewportMode}
                saveCard={saveNewCard}
                showHideStats={showHideStats}
                setShowStats={setShowStats}
                folders={folders}
                setCardWindowDeck={setCardWindowDeck}
                setCardAdded={setCardAdded}
                clearWindow={clearWindow}
                saveNewDeck={saveNewDeck}
                updateDeckFunction={updateDeckFunction}
                cardAdded={cardAdded}
                updateDeck={updateDeck}
                setUpdateDeck={setUpdateDeck}
              />
            );
            break;
          case "Practice":
            return (
              <PracticeModeWindow
                cardWindowDeck={cardWindowDeck}
                setViewportMode={changeViewportMode}
                flip={flip}
                flipCard={flipCard}
                viewportMode={viewportMode}
                setDeckScore={setDeckScore}
                setFlip={setFlipFunction}
                currentFolder={rightSelectedFolder}
                changeCardWindowDeck={addToCardWindow}
                resetStats={resetStats}
                showHideStats={showHideStats}
              />
            );
            break;
          case "Active Recall":
            return (
              <ActiveRecallWindow
                cardWindowDeck={cardWindowDeck}
                setViewportMode={changeViewportMode}
                flip={flip}
                flipCard={flipCard}
                viewportMode={viewportMode}
                setDeckScore={setActiveRecallScore}
                setFlip={setFlipFunction}
                currentFolder={rightSelectedFolder}
                addToCardWindow={addToCardWindow}
                resetStats={resetStats}
                showHideStats={showHideStats}
              />
            );
            break;
          case "Generate":
            return (
              <GenerateDecks
                saveNewDeck={saveNewDeck}
                folders={folders}
                selectedFolder={rightSelectedFolder}
                setFolders={setFolders}
              />
            );
            break;
          default:
            return null;
        }
      })()}

      {/* RIGHT DECK SELECT CONTAINER FOR USER CREATED DECKS */}
      <RightDeckSelectWindow
        handleChangeRightSelectedFolder={handleChangeRightSelectedFolder}
        rightSelectedFolder={rightSelectedFolder}
        setRightSelectedFolder={setRightSelectedFolder}
        setCardWindowDeck={setCardWindowDeck}
        setUpdateDeck={setUpdateDeck}
        folders={folders}
        setFolders={setFolders}
        addToCardWindow={addToCardWindow}
        cardWindowDeck={cardWindowDeck}
      />

      {/* LEFT DECK SELECT CONTAINER FOR PRESET DECKS */}
      <LeftDeckSelectWindow addToCardWindow={addToCardWindow} />
    </div>
  );
}

export default App;

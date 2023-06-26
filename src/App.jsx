import { useState, useEffect } from "react";
import CreateCardForm from "./components/CreateCardForm";
import "./App.css";
import DeckThumbnail from "./components/DeckThumbnail";
import { PracticeModeWindow } from "./components/PracticeModeWindow";
import { CardWindow } from "./components/CardWindow";
import { presetFolders } from "./assets/Decks";
import { GenerateDecks } from "./components/GenerateDecks";
import { ActiveRecallWindow } from "./components/ActiveRecall";

// TODO Add a prompt to save current cards in cardWindowDeck when clicking on a deck from the left side
// TODO Add Swap function to App.jsx which switches card fronts with backs
// TODO MAKE BREAK POINTS / FUNCTIONALITY FOR WORKING ON ALL SCREENS

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
  const [leftSelectedFolder, setLeftSelectedFolder] = useState(
    presetFolders[0].name
  );
  // DOUBLE CHECK THIS, MIGHT BE ABLE TO DELETE THIS OR THE ONE ABOVE
  const [selectedFolderToSave, setSelectedFolderToSave] = useState("");
  //used to render Select element with all current folders when saving a new deck
  const [isChoosingAFolder, setIsChoosingAFolder] = useState(false);

  //page numbers for left and right sidebars
  const [leftPage, setLeftPage] = useState(1);
  const [rightPage, setRightPage] = useState(1);
  const [amountOfRightPages, setAmountOfRightPages] = useState(0);

  //for showing deck stats
  const [showStats, setShowStats] = useState(false);

  //used to save users folders and decks to remain persistent through browser refreshes.
  useEffect(() => {
    localStorage.setItem("myFolders", JSON.stringify(folders));
  }, [folders]);

  //for calculating the number of pages in the right deck select sidebar
  useEffect(() => {
    let selectedFolder = folders.find(
      (folder) => folder.name === rightSelectedFolder
    );
    if (selectedFolder) {
      let amountOfDecks = selectedFolder.decks.length;

      setAmountOfRightPages(Math.ceil(amountOfDecks / 5));
    } else {
      setAmountOfRightPages(0);
    }
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
      practiceModeScore: 0,
      activeRecallScore: 0,
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
      viewportMode === "Generate" ? setViewportMode("View") : null;
      clearWindow();

      setCardWindowDeck(deck);
      //changes Save Deck button to Update Deck
      setUpdateDeck(true);
    }
  }

  const [isCardsViewable, setIsCardsViewable] = useState(false);

  useEffect(() => {
    let viewport = document.getElementById("card-window-transition");
    if (viewport) {
      viewport.classList.remove("visible");
      setIsCardsViewable(false);
    }
  }, [viewportMode, cardWindowDeck]);

  useEffect(() => {
    let viewport = document.getElementById("card-window-transition");
    if (viewport) {
      viewport.classList.add("visible");
      setIsCardsViewable(true);
    }
  }, [isCardsViewable]);

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

  // I BELIEVE this is for choosing which folder to render on the right sidebar
  function handleChangeRightSelectedFolder(e) {
    setRightSelectedFolder(e.target.value);
  }

  //function for deleting the currently selected deck from the right sidebar
  function deleteDeck(deck) {
    if (deck.cards.length === 0) {
      alert("Select a deck to delete");
      return;
    }
    let response = confirm(
      `Are you sure you want to delete the following deck: ${deck.name}?`
    );
    if (!response) {
      return;
    } else {
      setFolders((oldFolders) =>
        oldFolders.map((folder) => ({
          ...folder,
          decks: folder.decks.filter(
            (current_deck) => current_deck.name != deck.name
          ),
        }))
      );
      setRightSelectedFolder(rightSelectedFolder);
      setCardWindowDeck({
        name: "",
        cards: [],
        practiceModeScore: 0,
        activeRecallScore: 0,
      });
      setUpdateDeck(false);
    }
  }

  //change the decks displayed in left viewport based on the Select element
  function handleChangeLeftSelectedFolder(e) {
    setLeftSelectedFolder(e.target.value);
  }

  //functionality for showing and hiding the deck stats
  function showHideStats() {
    //showStats ? setShowStats(false) : setShowStats(true);
    let deckStats = document.getElementById("deck-stats");
    deckStats.classList.contains("visible")
      ? (deckStats.classList.remove("visible"), setShowStats(false))
      : (deckStats.classList.add("visible"), setShowStats(true));
  }

  // for passing down into components so to set the show stats button correctly when exiting
  function resetStats() {
    setShowStats(false);
  }

  //----------------------------------------------RETURN STARTS HERE--------------------------------------------------

  return (
    <div id="app">
      {/* HEADERS */}
      <h1>Ponderosa</h1>
      <h5>Flash-Card-App</h5>

      {/* DEVELOPER BUTTON FOR RESETTING ALL SCORES */}
      {/* <button onClick={resetDeckScores}>Developer</button> */}

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

          {/* RENDERS Select ELEMENT ONLY AFTER CLICKING 'ADD TO EXISTING' BUTTON */}
          {isChoosingAFolder && (
            <>
              <select
                onChange={handleChangeSelectedFolderToSave}
                value={selectedFolderToSave}
                className="select--difficulty"
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

      <div id="header-btns" className="side-by-side-btns">
        {/* SHOW Generate, Practice Mode BUTTONS IN VIEW MODE */}
        {viewportMode === "View" ? (
          <>
            <button
              name="viewport--generate"
              className="btn--red"
              onClick={() => setViewportMode("Generate")}
            >
              Generate Decks
            </button>
            <button
              name="btn--practice-mode"
              onClick={() => setViewportMode("Practice")}
              className="btn--red"
            >
              Practice Mode
            </button>
            <button
              name="btn--active-recall-mode"
              onClick={() => setViewportMode("Active Recall")}
              className="btn--red"
            >
              Active Recall Mode
            </button>
          </>
        ) : null}

        {/* SHOW Main Viewport BUTTON WHEN IN GENERATE MODE */}
        {viewportMode != "View" && viewportMode != "Practice" ? (
          <button
            name="viewport--view"
            className="btn--red"
            onClick={() => {
              setViewportMode("View");
              setShowStats(false);
            }}
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
              <>
                {cardWindowDeck.name ? (
                  <h6>
                    Selected Deck: <b>{cardWindowDeck.name}</b>
                  </h6>
                ) : (
                  <h6>Select a deck to view its contents</h6>
                )}
                {cardWindowDeck.cards.length > 0 && (
                  <div id="deck-stats">
                    <p>Deck Stats:</p>
                    <p>
                      Practice Mode Score:{" "}
                      <b>{cardWindowDeck.practiceModeScore}%</b>
                      <br></br> Active Recall Score:{" "}
                      <b>{cardWindowDeck.activeRecallScore}%</b>
                    </p>
                  </div>
                )}
                {cardWindowDeck.cards.length > 0 && (
                  <button className="btn--red" onClick={showHideStats}>
                    {showStats ? "Hide stats" : "Show stats"}
                  </button>
                )}
                <CardWindow
                  cardWindowDeck={cardWindowDeck}
                  flip={flip}
                  flipCard={flipCard}
                />
                {/* CREATE A CARD FORM */}
                {/* DISAPPEAR WHEN NOT IN VIEW MODE */}
                {viewportMode != "View" ? null : (
                  <CreateCardForm saveCard={saveNewCard} />
                )}
              </>
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
              />
            );
            break;
          default:
            return null;
        }
      })()}

      {/* IF YOU CHOOSE A DECK FROM THE SIDEBAR, BTN WILL CHANGE TO 'UPDATE DECK', OTHERWISE IT WILL BE 'SAVE DECK' */}
      {/* BUTTONS SHOW WHEN IN VIEW MODE */}
      <div id="me-buttons">
        {viewportMode === "View" &&
        cardWindowDeck.cards.length > 0 &&
        cardAdded ? (
          <>
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
          </>
        ) : null}
        {/* CLEAR WINDOW BTN ALWAYS SHOWN */}
        {viewportMode === "View" && (
          <button onClick={clearWindow} class="btn--save-deck">
            Clear Window
          </button>
        )}
      </div>

      {/* RIGHT DECK SELECT CONTAINER FOR USER CREATED DECKS */}
      <div id="deck-select-container">
        <p className="deck-select-header">Your Decks</p>

        {/* DROPDOWN TO SELECT FOLDER */}
        <select
          onChange={handleChangeRightSelectedFolder}
          value={rightSelectedFolder}
          className="select--folder"
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

        {/* DISPLAY DECKS BASED ON SELECTED FOLDER */}
        {/* DISPLAY DECKS BASED ON PAGE NUMBER AS WELL */}
        {/* WILL PROBABLY GLITCH OUT IF THERE ARE MORE THAN 15 DECKS IN A FOLDER */}
        {folders.map((folder) => {
          let index = -1;
          if (folder.name === rightSelectedFolder) {
            return folder.decks.map((deck) => {
              index++;
              if (rightPage === 1) {
                if (index < 5) {
                  return (
                    <DeckThumbnail
                      deck={deck}
                      addToCardWindow={addToCardWindow}
                    />
                  );
                }
              } else if (rightPage === 2) {
                if (index > 4 && index < 10) {
                  return (
                    <DeckThumbnail
                      deck={deck}
                      addToCardWindow={addToCardWindow}
                    />
                  );
                }
              } else if (rightPage === 3) {
                if (index > 10 && index < 16) {
                  return (
                    <DeckThumbnail
                      deck={deck}
                      addToCardWindow={addToCardWindow}
                    />
                  );
                }
              }
            });
          }
        })}
        <p>
          page {rightPage} / {amountOfRightPages}
        </p>
        {rightPage > 1 && (
          <button
            className="btn--sm--type2 page-btn"
            onClick={() => setRightPage((old) => old - 1)}
          >
            Back
          </button>
        )}
        <div className="side-by-side-btns">
          {rightPage < amountOfRightPages && (
            <button
              className="btn--sm--type2 page-btn"
              onClick={() => setRightPage((old) => old + 1)}
            >
              Next
            </button>
          )}
        </div>

        {/* DELETE DECKS BUTTON IF DECKS EXIST */}
        {folders[0].decks.length > 0 ? (
          <button
            onClick={() => deleteDeck(cardWindowDeck)}
            className="btn--sm--type2"
          >
            Delete Deck
          </button>
        ) : null}
      </div>

      {/* LEFT DECK SELECT CONTAINER FOR PRESET DECKS */}
      <div id="left-deck-select-container">
        <p className="deck-select-header left">Preset Decks</p>
        <select
          name="categories"
          className="select--folder"
          onChange={handleChangeLeftSelectedFolder}
        >
          {presetFolders.map((folder) => {
            return (
              <option key={folder.name} name={folder.name}>
                {folder.name}
              </option>
            );
          })}
        </select>
        {/* PAGE ONE THUMBNAILS */}
        {leftPage === 1 &&
          presetFolders.map((folder) => {
            let index = 1;
            if (folder.name === leftSelectedFolder) {
              return folder.decks.map((decklist) => {
                return decklist.decks.map((deck) => {
                  if (index < 6) {
                    index++;
                    return (
                      <DeckThumbnail
                        deck={deck}
                        addToCardWindow={addToCardWindow}
                        key={deck.name}
                      />
                    );
                  }
                });
              });
            }
          })}
        {/* PAGE TWO THUMBNAILS */}
        {leftPage === 2 &&
          presetFolders.map((folder) => {
            let index = 1;
            if (folder.name === leftSelectedFolder) {
              return folder.decks.map((decklist) => {
                return decklist.decks.map((deck) => {
                  index++;
                  if (index > 6 && index < 12) {
                    return (
                      <DeckThumbnail
                        deck={deck}
                        addToCardWindow={addToCardWindow}
                      />
                    );
                  }
                });
              });
            }
          })}
        {
          <div className="side-by-side-buttons">
            {leftPage === 2 && (
              <button
                className="btn--sm--type2 page-btn"
                onClick={() => setLeftPage((old) => old - 1)}
              >
                Prev
              </button>
            )}
            {leftPage === 1 && (
              <button
                className="btn--sm--type2 page-btn"
                onClick={() => setLeftPage((old) => old + 1)}
              >
                Next
              </button>
            )}
          </div>
        }
      </div>
    </div>
  );
}

export default App;

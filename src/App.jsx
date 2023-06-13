import { useState } from "react";
import CreateCardForm from "./components/CreateCardForm";
import Card from "./components/Card";
import "./App.css";
import DeckThumbnail from "./components/DeckThumbnail";
import { PracticeModeWindow } from "./components/PracticeModeWindow";
import { CardWindow } from "./components/CardWindow";
import { presetDecks } from "./assets/Decks";

// TODO make 3 modes of practice.. 'Practice', 'Recall', 'Expand'. Practice is simple flipping, with a pass/fail button
//    after flipping each card (one at a time in window), Recall is you have to type out the answer, Expand will use chatGPT
//    api to take the word on the back and write a sentence with it. the user has to guess the rough gist of what the sentence
//    means, and the AI will pass/fail them and provide more info on the word and context
// TODO make decks persistent... MongoDB?
// TODO make more preset decks
// TODO make a select dropdown list at the top of the preset decks window, which will change what populates the window..
//    IE Cooking and Food, Household etc..

function App() {
  const [newDeck, setNewDeck] = useState([]);
  const [decks, setDecks] = useState([]);
  const [cardWindowDeck, setCardWindowDeck] = useState();
  const [windowDeckName, setWindowDeckName] = useState();
  const [updateDeck, setUpdateDeck] = useState(false);
  const [practiceModeDeck, setPracticeModeDeck] = useState();
  const [practiceMode, setPracticeMode] = useState(false);

  function saveNewCard(cardFront, cardBack) {
    setCardWindowDeck((old) => [...old, { front: cardFront, back: cardBack }]);
  }

  function saveNewDeck() {
    if (cardWindowDeck.length === 0) {
      alert("No cards to save");
      return;
    }

    let name = prompt("Name your new deck", "New Deck");
    setDecks((old) => [
      ...old,
      {
        name: name,
        cards: cardWindowDeck,
      },
    ]);
    setNewDeck([]);
  }

  function addToCardWindow(deck) {
    if (newDeck.length != 0) {
      let response = confirm(
        "Continuing will clear the current cards without saving, continue?"
      );
      if (response) {
        clearWindow();
        setCardWindowDeck(deck.cards);
      } else {
        return;
      }
    } else {
      setCardWindowDeck(deck.cards);
      setWindowDeckName(deck.name);
      setUpdateDeck(true);
    }
  }

  function updateDeckFunction() {
    let found = false;
    decks.forEach((deck) => {
      if (deck.name === windowDeckName) {
        deck.cards = [...cardWindowDeck, ...newDeck];
        setCardWindowDeck();
        setNewDeck([]);
        setUpdateDeck(false);
        found = true;
        return;
      }
    });
    //if deck name isnt in decks already.. (ie changing a preset deck)
    if (found === false) {
      let name = prompt("Set a new name", windowDeckName);
      setWindowDeckName(name);
      setDecks((old) => [
        ...old,
        {
          name: name,
          cards: cardWindowDeck,
        },
      ]);
    }
  }

  function clearWindow() {
    setNewDeck([]);
    setCardWindowDeck();
    setUpdateDeck(false);
  }

  function changePracticeMode() {
    practiceMode ? setPracticeMode(false) : setPracticeMode(true);
  }

  //RETURN STARTS HERE--------------------------------------------------------------------------

  return (
    <div id="app">
      {/* HEADERS */}
      <h1>Pondera</h1>
      <h5>Flash-Card-App</h5>
      {/* CREATE A CARD FORM */}
      <CreateCardForm saveCard={saveNewCard} />
      {/* IF THERE IS CARDS IN THE WINDOW, SHOW THE PRACTICE MODE BUTTON */}
      {cardWindowDeck ? (
        <button
          name="btn--practice-mode"
          onClick={() => setPracticeMode(true)}
          class="btn--red"
        >
          Practice Mode
        </button>
      ) : null}
      {/* IF YOU ARE IN PRACTICE MODE, SHOW PRACTICE MODE WINDOW, ELSE SHOW NORMAL WINDOW */}
      {practiceMode ? (
        <PracticeModeWindow
          deck={cardWindowDeck}
          changePracticeMode={changePracticeMode}
        />
      ) : (
        <CardWindow cardWindowDeck={cardWindowDeck} newDeck={newDeck} />
      )}
      {/* IF YOU CHOOSE A DECK FROM THE SIDEBAR, BTN WILL CHANGE TO 'UPDATE DECK', OTHERWISE IT WILL BE 'SAVE DECK' */}
      <div id="me-buttons">
        {updateDeck ? (
          <button onClick={updateDeckFunction} class="btn--save-deck">
            Update Deck
          </button>
        ) : (
          <button onClick={saveNewDeck} class="btn--save-deck">
            Save Deck
          </button>
        )}
        {/* CLEAR WINDOW BTN ALWAYS SHOWN */}
        <button onClick={clearWindow} class="btn--save-deck">
          Clear Window
        </button>
      </div>
      {/* RIGHT DECK SELECT CONTAINER FOR USER CREATED DECKS */}
      <div id="deck-select-container">
        <p>Your Decks</p>
        {decks.map((deck) => {
          return (
            <DeckThumbnail deck={deck} addToCardWindow={addToCardWindow} />
          );
        })}
      </div>
      {/* LEFT DECK SELECT CONTAINER FOR PRESET DECKS */}
      <div id="left-deck-select-container">
        <p>Preset Decks</p>
        {presetDecks.map((deck) => {
          return (
            <DeckThumbnail deck={deck} addToCardWindow={addToCardWindow} />
          );
        })}
      </div>
    </div>
  );
}

export default App;

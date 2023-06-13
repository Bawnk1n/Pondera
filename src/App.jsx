import { useState } from "react";
import CreateCardForm from "./components/CreateCardForm";
import Card from "./components/Card";
import "./App.css";
import DeckThumbnail from "./components/DeckThumbnail";
import { practiceModeWindow } from "./components/PracticeModeWindow";
import { presetDecks } from "./assets/Decks";

// DONE Get the cards from a saved deck into the card-window!!
// DONE Style saveNewDeck button!
// DONE Add functionality for updating existing decks or creating a new deck, depending on circumstance (in saveNewDeck)
// DONE make new button called Update Deck which renders in place of Save Deck when a deck is loaded from the sidebar
//add a bool that gets set to true when loading a deck from sidebar and false when clear window is clicked
//when bool is true Update Deck button is loaded, which takes the current viewport and adds the newDeck cards to the Deck
// DONE add preset decks to left side of screen
// DONE change color of back of cards

// TODO training mode: add button to bottom of viewport when a deck is selected from sidebar to start training mode
//    with one at a time shown, and a pass fail selection after check flip
// TODO make 3 modes of practice.. 'Practice', 'Recall', 'Expand'. Practice is simple flipping, with a pass/fail button
//    after flipping each card (one at a time in window), Recall is you have to type out the answer, Expand will use chatGPT
//    api to take the word on the back and write a sentence with it. the user has to guess the rough gist of what the sentence
//    means, and the AI will pass/fail them and provide more info on the word and context
// TODO make decks persistent... MongoDB?
// TODO maybe make a new button for when you select a preset deck like "Create New Version" which saves the preset deck to
//    users saved decks
// TODO make more preset decks
// TODO make a select dropdown list at the top of the preset decks window, which will change what populates the window..
//    IE Cooking and Food, Household etc..

//Training mode thought:: Make a whole new card-window, and make a button called "training mode" that sets the visibility
// of the original one to hidden.. or gets rid of it entirely? and shows the new one instead.. probably going to have to make
// a bool as well? maybe?

function App() {
  const [newDeck, setNewDeck] = useState([]);
  const [decks, setDecks] = useState([]);
  const [cardWindowDeck, setCardWindowDeck] = useState();
  const [windowDeckName, setWindowDeckName] = useState();
  const [updateDeck, setUpdateDeck] = useState(false);
  const [practiceModeDeck, setPracticeModeDeck] = useState();

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

  return (
    <div id="app">
      <h1>Pondera</h1>
      <h5>Flash-Card-App</h5>
      <CreateCardForm saveCard={saveNewCard} />
      <div id="card-window">
        {newDeck.map((card) => {
          return <Card card={card} />;
        })}
        {cardWindowDeck
          ? cardWindowDeck.map((card) => {
              return <Card card={card} />;
            })
          : null}
      </div>

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
        <button onClick={clearWindow} class="btn--save-deck">
          Clear Window
        </button>
      </div>

      <div id="deck-select-container">
        <p>Your Decks</p>
        {decks.map((deck) => {
          return (
            <DeckThumbnail deck={deck} addToCardWindow={addToCardWindow} />
          );
        })}
      </div>

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

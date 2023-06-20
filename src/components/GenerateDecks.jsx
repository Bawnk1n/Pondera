import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { createDeck } from "../api";
import { CardWindow } from "./CardWindow";
import { functionCall } from "../api";

//for filling in the Select element in the form
const languageOptions = [
  { value: "spanish", label: "Spanish" },
  { value: "mandarin", label: "Mandarin" },
  { value: "hindi", label: "Hindi" },
  { value: "french", label: "French" },
  { value: "arabic", label: "Arabic" },
  { value: "bengali", label: "Bengali" },
  { value: "russian", label: "Russian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "indonesian", label: "Indonesian" },
  { value: "urdu", label: "Urdu" },
  { value: "german", label: "German" },
  { value: "japanese", label: "Japanese" },
  { value: "swahili", label: "Swahili" },
  { value: "italian", label: "Italian" },
  { value: "turkish", label: "Turkish" },
];
//for filling in the Select element in the form
const subjectOptions = [
  { value: "food", label: "Food" },
  { value: "household_objects", label: "Household Objects" },
  { value: "directions", label: "Directions" },
  { value: "sports", label: "Sports" },
  { value: "weather", label: "Weather" },
  { value: "clothing", label: "Clothing" },
  { value: "animals", label: "Animals" },
  { value: "relationships", label: "Relationships" },
  { value: "education", label: "Education" },
  { value: "music", label: "Music" },
  { value: "travel", label: "Travel" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "art", label: "Art" },
  { value: "technology", label: "Technology" },
];

export function GenerateDecks(props) {
  //For setting the cards in the viewport.... Should I change this to cardWindowDeck from App.js via props???
  const [newDeck, setNewDeck] = useState({
    name: "",
    practiceModeScore: 0,
    activeRecallScore: 0,
    cards: [],
  });
  //The following 4 are all for the Form element
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjectOptions[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [selectedDialect, setSelectedDialect] = useState("");
  // adds some text that says 'Loading, please wait...' while handling API request
  const [isLoading, setIsLoading] = useState(false);
  // lets the user know there was an error with the API request
  const [isError, setIsError] = useState(false);

  // OpenAI API call
  async function generate(input) {
    try {
      setIsError(false);
      setIsLoading(true);
      const cards = await createDeck(input);
      setNewDeck((old) => ({
        ...old,
        cards: cards,
      }));
    } catch (error) {
      console.error("failed to create deck: ", error);
      setIsError(true);
    }
    setIsLoading(false);
  }

  // SAVE NEW DECK BUTTON
  function handleClick() {
    props.saveNewDeck(newDeck);
    setIsReadyToContinue(true);
    setNewDeck({
      name: "",
      practiceModeScore: 0,
      activeRecallScore: 0,
      cards: [],
    });
  }
  //used in Form element
  function handleLanguageChange(option) {
    setSelectedLanguage(option);
  }
  //used in Form element
  function handleSubjectChange(option) {
    setSelectedSubject(option);
  }
  //used in Form element
  function handleDifficultyChange(option) {
    setSelectedDifficulty(option.target.value);
  }
  //used in Form element
  function handleChangeDialect(event) {
    setSelectedDialect(event.target.value);
  }
  //used in Form element, creates a string and plugs it into the API call
  function handleSubmit(e) {
    e.preventDefault();
    setNewDeck({
      name: "",
      practiceModeScore: 0,
      activeRecallScore: 0,
      cards: [],
    });
    //chatGPT prompt
    generate(
      `Directions: Create an array of 20 new cards in the following format: [{"front": english_word, "back": ${
        selectedLanguage.value
      }_translation}, etc..]}. 
      INSTRUCTIONS: 1. The cards array are to be populated with ONLY 20 front/back pairs and the words should fall into the following categories: 
      Subject: ${selectedSubject.value},
      Level: ${selectedDifficulty} 
      Type: "Conversational",
      ${selectedDialect ? `Dialect: ` + selectedDialect : null}.
      2. If the language language uses non-alphabetic letters, put the phonetic instructions with the translation. `
    );
  }
  // a button for when there is a folder selected on the right sidebar, this will generate a new deck and instruct GPT to NOT repeat any of the cards already in the folder
  function handleContinue() {
    setNewDeck({
      name: "",
      practiceModeScore: 0,
      activeRecallScore: 0,
      cards: [],
    });
    let takenCardString = ``;
    //get into the folder that is currently selected via the form, reach into the 'cards' of each deck, and add them to takenCardsString
    props.folders.forEach((folder) => {
      if (folder.name === props.selectedFolder) {
        folder.decks.map((deck) => {
          deck.cards.forEach((card) => {
            takenCardString += `{front: ${card.front}, back: ${card.back}}, `;
          });
        });
      }
    });
    //API call, same as the one above but with added list of words already in the currently selected folder
    //chatGPT prompt
    generate(
      `The following cards have already been made: ${takenCardString}...
      Directions: Without using any of the cards just listed, create an array of 20 new cards in the following format: [{"front": english_word, "back": ${
        selectedLanguage.value
      }_translation}, etc..]}. 
      INSTRUCTIONS: 1. The cards array are to be populated with ONLY 20 front/back pairs and the words should fall into the following categories: 
      Subject: ${selectedSubject.value},
      Level: ${selectedDifficulty} 
      Type: "Conversational",
      ${selectedDialect ? `Dialect: ` + selectedDialect : null}.
      2. If the language language uses non-alphabetic letters, put the phonetic instructions with the translation. `
    );
  }

  function swapFrontsWithBacks() {
    let swappedCards = newDeck.cards.map((card) => {
      return { front: card.back, back: card.front };
    });
    setNewDeck((old) => ({
      ...old,
      cards: swappedCards,
    }));
  }

  return (
    <div className="card-viewport">
      {/* GENERATE DECK FORM */}
      <div className="form--prompt">
        <form onSubmit={handleSubmit} id="form--generate-info">
          {/* LANGUAGES SELECT ELEMENT // these also function as text input fields */}
          <CreatableSelect
            isClearable
            isSearchable
            options={languageOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleLanguageChange}
            value={selectedLanguage}
          />
          {/* SUBJECTS SELECT ELEMENT  // these also function as text input fields*/}
          <CreatableSelect
            isClearable
            isSearchable
            options={subjectOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleSubjectChange}
            value={selectedSubject}
          />
          {/* DIFFICULTY SELECT BOX */}
          <select onChange={handleDifficultyChange} value={selectedDifficulty}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {/* DIALECT TEXT INPUT FIELD (CAN BE LEFT BLANK) */}
          <input
            type="text"
            onChange={handleChangeDialect}
            placeholder="Dialect"
            value={selectedDialect}
          ></input>
          {/* SUBMIT */}
          <button className="btn--red" type="submit">
            Generate Deck
          </button>
        </form>
      </div>
      <div className="side-by-side-btns">
        {/* CONTINUE BUTTON APPEARS WHEN A FOLDER IS SELECTED ON THE RIGHT SIDEBAR */}
        {props.selectedFolder && (
          <button onClick={handleContinue} className="btn--red">
            Continue
          </button>
        )}
        {/* SAVE BUTTON APPEARS WHEN THERE IS CARDS IN THE VIEWPORT */}
        {newDeck.cards.length > 0 ? (
          <div className="side-by-side-btns">
            <button onClick={() => handleClick()} className="btn--red">
              Save Deck
            </button>
            {/* DISCARD BUTTON CLEARS THE VIEWPORT */}
            <button
              onClick={() =>
                setNewDeck({
                  name: "",
                  practiceModeScore: 0,
                  activeRecallScore: 0,
                  cards: [],
                })
              }
              className="btn--red"
            >
              Discard
            </button>
          </div>
        ) : null}
      </div>
      {/* TEXT APPEARS WHEN WAITING FOR API CALL RESPONSE */}
      {isLoading && <h3>Loading new deck...</h3>}
      {/* ERROR TEXT APPEARS IF SOMETHING GOES WRONG */}
      {isError && (
        <h3>Hmm.. Something went wrong! Stupid AI.... Please try again.</h3>
      )}
      {/* MAIN CARDS VIEWPORT */}
      <CardWindow
        cardWindowDeck={newDeck}
        flip={props.flip}
        flipCard={props.flipCard}
      />
      {/* SWAP BUTTON APPEARS WHEN THERE IS CARDS IN THE WINDOW */}
      {/* swap switches the front with the back of the cards */}
      {newDeck.cards.length > 0 && (
        <button className="btn--red" onClick={swapFrontsWithBacks}>
          Swap
        </button>
      )}
    </div>
  );
}

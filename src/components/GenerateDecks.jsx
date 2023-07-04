import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { createDeck } from "../api";
import { CardWindow } from "./CardWindow";
import { functionCall } from "../api";
import { BigRedButton } from "./BigRedButton";

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
  //for disabling the button after clicking it to avoide calling the api more than once
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
  //The following 4 are all for the Form element
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjectOptions[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [selectedDialect, setSelectedDialect] = useState("");
  //same but for new text inputs
  const [languageTextInput, setLanguageTextInput] = useState("");
  const [topicTextInput, setTopicTextInput] = useState("");
  // adds some text that says 'Loading, please wait...' while handling API request
  const [isLoading, setIsLoading] = useState(false);
  // lets the user know there was an error with the API request
  const [isError, setIsError] = useState(false);

  //for the Show Instructions button inner text
  const [showButton, setShowButton] = useState(false);

  // OpenAI API call
  async function generate(input) {
    try {
      setIsError(false);
      setIsLoading(true);
      setNewDeck({
        name: "New Deck",
        practiceModeScore: 0,
        activeRecallScore: 0,
        cards: await createDeck(input),
      });
    } catch (error) {
      console.error("failed to create deck: ", error);
      setIsError(true);
    }
    setIsLoading(false);
  }

  // SAVE NEW DECK BUTTON
  function handleClick() {
    props.saveNewDeck(newDeck);
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
    setButtonIsDisabled(true);
    setNewDeck({
      name: "",
      practiceModeScore: 0,
      activeRecallScore: 0,
      cards: [],
    });
    //chatGPT prompt
    generate(
      `Directions: Create an array of 20 new cards in the following format: [{"front": english_word, "back": ${
        languageTextInput ? languageTextInput : selectedLanguage.value
      }_translation}, etc..]}. 
      INSTRUCTIONS: 1. The cards array are to be populated with EXACTLY 20 front/back pairs and the words should fall into the following categories: 
      Subject: ${topicTextInput ? topicTextInput : selectedSubject.value},
      Level: ${selectedDifficulty},
      ${selectedDialect ? `Dialect: ` + selectedDialect : null}.
      2. IMPORTANT: If the translation contains NON-LATIN characters, YOU MUST put the phonetic instructions with the translation so the user can know how to pronounce the translation.
      Type: "Conversational".`
    ).finally(() => setButtonIsDisabled(false));
  }
  // a button for when there is a folder selected on the right sidebar, this will generate a new deck and instruct GPT to NOT repeat any of the cards already in the folder
  function handleContinue() {
    setButtonIsDisabled(true);
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
    takenCardString = takenCardString.slice(0, -2);
    // console.log(takenCardString);
    // console.log(newDeck.cards);
    //API call, same as the one above but with added list of words already in the currently selected folder
    //chatGPT prompt
    generate(
      `WITHOUT REPEATING ANY OF THE FOLLOWING CARDS: ${takenCardString}.
      Directions: Without repeated any of the card objects just listed, create an array of 20 new cards in the following format: [{"front": english_word, "back": ${
        languageTextInput ? languageTextInput : selectedLanguage.value
      }_translation}, etc..]}. 
      INSTRUCTIONS: 1. The cards array are to be populated with EXACTLY 20 front/back pairs and the words should fall into the following categories: 
      Subject: ${topicTextInput ? topicTextInput : selectedSubject.value},
      Level: ${selectedDifficulty} 
      Type: "Conversational",
      ${selectedDialect ? `Dialect: ` + selectedDialect : null}.
      2. IMPORTANT: If the translation contains NON-LATIN characters, YOU MUST put the phonetic instructions with the translation so the user can know how to pronounce the translation.`
    ).finally(() => setButtonIsDisabled(false));
  }

  //for when GPT puts the spanish on the front of the cards
  function swapFrontsWithBacks() {
    let swappedCards = newDeck.cards.map((card) => {
      return { front: card.back, back: card.front };
    });
    setNewDeck((old) => ({
      ...old,
      cards: swappedCards,
    }));
  }

  function handleChangeLanguageTextInput(e) {
    setLanguageTextInput(e.target.value);
  }
  function handleChangeTopicTextInput(e) {
    setTopicTextInput(e.target.value);
  }

  return (
    <div className="card-viewport">
      <button
        className="btn--red"
        onClick={() => {
          let instructions = document.getElementById("directions");
          instructions.classList.contains("visible")
            ? (instructions.classList.remove("visible"), setShowButton(false))
            : (instructions.classList.add("visible"), setShowButton(true));
        }}
      >
        {showButton ? "Hide Directions" : "Show Directions"}
      </button>
      <p id="directions">
        1. To begin, choose the language and topic you want to learn words in.
        You can choose something from the dropdown list, or you can type
        anything you want to generate a dynamic deck. <br></br>
        <br></br>
        2. Choose the level of difficulty you want the words to be, and
        optionally, type in a dialect you want the words to be in (useful for
        travellers). <br></br>
        <br></br>
        3. If this is your first deck in a certain topic, clicking 'Generate'
        will create for you a deck of 20 cards matching the info you put into
        the form. You can then click the Save Deck button, and create a new
        folder to save the deck in, which will subsequently show up on the right
        sidebar in the viewport. <br></br> <br></br>
        4. If this is not your first deck, a 'Continue' button will appear. This
        button will instruct the AI to not repeat any of the cards that are in
        your <b>currently selected</b> folder. To make best use of this feature,
        each folder should only hold decks pertaining to a single topic.
        <br></br>
        <br></br>
        <b>
          If there are errors in the generated deck or you dont like it for any
          reason, you may click 'generate' or 'continue' again to discard the
          current deck and generate a new one.
        </b>
      </p>

      {/* GENERATE DECK FORM */}
      <div className="form--prompt">
        <form onSubmit={handleSubmit} id="form--generate-info">
          {/* LANGUAGES SELECT ELEMENT // these also function as text input fields */}
          <div className="form-text">
            <p>I want to learn words in: </p>
            <div className="column">
              <select
                value={selectedLanguage.value}
                disabled={!!languageTextInput}
                onChange={handleLanguageChange}
                style={{ textAlign: "center" }}
                className="generate-form-select"
              >
                {languageOptions.map((option) => {
                  return (
                    <option
                      value={option.value}
                      key={option.value}
                      label={option.label}
                    ></option>
                  );
                })}
              </select>
              --
              <input
                type="text"
                value={languageTextInput}
                placeholder="choose your own"
                onChange={handleChangeLanguageTextInput}
                style={{ textAlign: "center" }}
                className="generate-form-select"
              ></input>
            </div>
          </div>
          {/* SUBJECTS SELECT ELEMENT  // these also function as text input fields*/}
          <div className="form-text">
            <p>Relating to: </p>
            {/* <CreatableSelect
              isClearable
              isSearchable
              options={subjectOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleSubjectChange}
              value={selectedSubject}
            /> */}
            <div className="column">
              <select
                value={selectedSubject.value}
                disabled={!!topicTextInput}
                onChange={handleSubjectChange}
                style={{ textAlign: "center" }}
                className="generate-form-select"
              >
                {subjectOptions.map((option) => {
                  return (
                    <option
                      value={option.value}
                      key={option.value}
                      label={option.label}
                    ></option>
                  );
                })}
              </select>
              --
              <input
                type="text"
                value={topicTextInput}
                placeholder="choose your own"
                onChange={handleChangeTopicTextInput}
                style={{ textAlign: "center" }}
                className="generate-form-select"
              ></input>
            </div>
          </div>
          {/* DIFFICULTY SELECT BOX */}
          <div className="form-text">
            <p>In the difficulty of: </p>
            <select
              onChange={handleDifficultyChange}
              value={selectedDifficulty}
              className="select--difficulty"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          {/* DIALECT TEXT INPUT FIELD (CAN BE LEFT BLANK) */}
          <div className="form-text">
            <p>In the dialect of: </p>
            <input
              type="text"
              onChange={handleChangeDialect}
              placeholder="Country or Region"
              value={selectedDialect}
              className="input--dialect"
            ></input>
          </div>
          {/* SUBMIT */}
          <div className="side-by-side-btns">
            <button
              className={`btn--red ${buttonIsDisabled ? "disabled" : ""}`}
              type="submit"
            >
              Generate Deck
            </button>
            {/* CONTINUE BUTTON APPEARS WHEN A FOLDER IS SELECTED ON THE RIGHT SIDEBAR */}
            {props.selectedFolder && (
              <button
                onClick={() => handleContinue()}
                className={`btn--red space continue-btn ${
                  buttonIsDisabled ? "disabled" : ""
                }`}
                disabled={buttonIsDisabled}
              >
                Continue
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="side-by-side-btns">
        {/* SAVE BUTTON APPEARS WHEN THERE IS CARDS IN THE VIEWPORT */}
        {newDeck.cards.length > 0 ? (
          <div className="side-by-side-btns">
            <BigRedButton
              mainFunction={() => handleClick()}
              innerText={"Save Deck"}
            />
            {/* DISCARD BUTTON CLEARS THE VIEWPORT */}

            <BigRedButton
              mainFunction={() =>
                setNewDeck({
                  name: "",
                  practiceModeScore: 0,
                  activeRecallScore: 0,
                  cards: [],
                })
              }
              innerText="Discard"
            />
          </div>
        ) : null}
      </div>
      {/* TEXT APPEARS WHEN WAITING FOR API CALL RESPONSE */}
      {isLoading && <h4 className="loading-text">Loading new deck...</h4>}
      {/* ERROR TEXT APPEARS IF SOMETHING GOES WRONG */}
      {isError && (
        <h4 className="loading-text">
          Hmm.. Something went wrong! Stupid AI.... Please try again.
        </h4>
      )}
      {/* MAIN CARDS VIEWPORT */}
      <CardWindow
        cardWindowDeck={newDeck}
        flip={props.flip}
        flipCard={props.flipCard}
        setFolders={props.setFolders}
        folders={props.folders}
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

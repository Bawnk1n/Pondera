import { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { createDeck } from "../api";
import Card from "./Card";
import { CardWindow } from "./CardWindow";

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
  const [newDeck, setNewDeck] = useState({
    name: "",
    score: 0,
    cards: [],
  });
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjectOptions[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [selectedDialect, setSelectedDialect] = useState("");

  const [formData, setFormData] = useState({
    language: "",
    subject: "",
    level: "",
    dialect: "",
  });
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function generate(input) {
    try {
      setIsError(false);
      setIsLoading(true);
      const deck = await createDeck(input);
      setNewDeck(deck);
    } catch (error) {
      console.error("failed to create deck: ", error);
      setIsError(true);
    }
    setIsLoading(false);
  }

  // SAVE NEW DECK BUTTON
  function handleClick() {
    props.saveNewDeck(newDeck);
  }

  function handleLanguageChange(option) {
    setSelectedLanguage(option);
  }

  function handleSubjectChange(option) {
    setSelectedSubject(option);
  }

  function handleDifficultyChange(option) {
    setSelectedDifficulty(option.target.value);
  }

  function handleChangeDialect(event) {
    setSelectedDialect(event.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    generate(
      `Create and populate a valid JSON object in the following format: {"name": name, "score": 0, cards: [{"front": english_word, "back": ${
        selectedLanguage.value
      }_translation}, etc..]}. The cards array should be filled with 20 front/back pairs and the words should fall into the following categories: Subject: ${
        selectedSubject.value
      }, Level: ${selectedDifficulty} type: "conversational" ${
        selectedDialect ? `Dialect: ` + selectedDialect : null
      }. If the language language uses non-alphabetic letters, put the phonetic instructions with the translation.`
    );
  }

  return (
    <div className="card-viewport">
      <div className="form--prompt">
        <form onSubmit={handleSubmit}>
          <CreatableSelect
            isClearable
            isSearchable
            options={languageOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleLanguageChange}
            value={selectedLanguage}
          />
          <CreatableSelect
            isClearable
            isSearchable
            options={subjectOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleSubjectChange}
            value={selectedSubject}
          />
          <select onChange={handleDifficultyChange} value={selectedDifficulty}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            type="text"
            onChange={handleChangeDialect}
            placeholder="Dialect"
            value={selectedDialect}
          ></input>
          <button className="btn--red" type="submit">
            Generate Deck
          </button>
        </form>
      </div>
      <div className="side-by-side-btns">
        {newDeck.cards.length > 0 ? (
          <div className="side-by-side-btns">
            <button onClick={() => handleClick()} className="btn--red">
              Save Deck
            </button>
            <button
              onClick={() =>
                setNewDeck({
                  name: "",
                  score: 0,
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
      {isLoading && <h3>Loading new deck...</h3>}
      {isError && (
        <h3>Hmm.. Something went wrong! Stupid AI.... Please try again.</h3>
      )}
      <CardWindow
        cardWindowDeck={newDeck}
        flip={props.flip}
        flipCard={props.flipCard}
      />
    </div>
  );
}

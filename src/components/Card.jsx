import { useState, useEffect } from "react";
import { PageButton } from "./PageButton";

export default function Card(props) {
  // Needed to make localFlip because I moved the flip var to app.jsx so I could do things with it in practice mode,
  // but it fucked things up here and was flipping ALL cards in the card window when ONE was clicked

  const [localFlip, setLocalFlip] = useState(false);

  function localSwitch() {
    if (props.viewportMode != "Active Recall") {
      localFlip ? setLocalFlip(false) : setLocalFlip(true);
      setNewValue(localFlip ? props.card.front : props.card.back);
    }
  }

  const [localEdit, setLocalEdit] = useState(false);
  const [newValue, setNewValue] = useState(
    localFlip ? props.card.back : props.card.front
  );
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (!props.editMode) {
      setLocalFlip(false);
    }
  }, [props.cardWindowDeck]);

  function handleEdit(e) {
    setNewValue(e.target.value);
    setIsChanging(true);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    newValue
      ? props.setFolders((oldFolders) => {
          return oldFolders.map((folder) => {
            return {
              ...folder,
              decks: folder.decks.map((deck) => {
                if (deck.name === props.cardWindowDeck.name) {
                  return {
                    ...deck,
                    cards: deck.cards.map((card) => {
                      if (localFlip) {
                        if (
                          card.back === props.card.back &&
                          card.front === props.card.front
                        ) {
                          return { ...card, back: newValue };
                        }
                      } else {
                        if (
                          card.front === props.card.front &&
                          card.back === props.card.back
                        ) {
                          return { ...card, front: newValue };
                        }
                      }
                      return card;
                    }),
                  };
                }
                return deck;
              }),
            };
          });
        })
      : null;
    setLocalEdit(false);
  }

  return (
    <div>
      <div
        className="card"
        //this ternary facilitates only being able to flip the card once in Practice Mode
        onClick={
          !localEdit
            ? props.viewportMode === "Practice"
              ? props.flip === false
                ? props.flipCard
                : null
              : localSwitch
            : null
        }
        style={
          props.viewportMode === "Practice"
            ? { backgroundColor: props.flip ? "#b4c0c9" : "" }
            : { backgroundColor: localFlip ? "#b4c0c9" : "" }
        }
      >
        <p>
          {!localEdit ? (
            props.viewportMode === "Practice" ||
            props.viewportMode === "Active Recall" ? (
              props.flip ? (
                props.card.back
              ) : (
                props.card.front
              )
            ) : localFlip ? (
              props.card.back
            ) : (
              props.card.front
            )
          ) : (
            <div>
              <input
                type="text"
                value={newValue}
                onChange={handleEdit}
                className="editInput"
              ></input>{" "}
              <button type="submit" onClick={handleEditSubmit}>
                Submit
              </button>
            </div>
          )}
        </p>
      </div>
      {props.editMode && (
        <PageButton
          mainFunction={() => setLocalEdit(true)}
          innerText={"Edit"}
        />
      )}
    </div>
  );
}

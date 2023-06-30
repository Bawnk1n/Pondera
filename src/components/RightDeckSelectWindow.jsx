import DeckThumbnail from "./DeckThumbnail";
import { PageButton } from "./PageButton";
import { useState, useEffect } from "react";

export function RightDeckSelectWindow(props) {
  const [rightPage, setRightPage] = useState(1);
  const [amountOfRightPages, setAmountOfRightPages] = useState(0);

  //for calculating the number of pages in the right deck select sidebar
  useEffect(() => {
    let selectedFolder = props.folders.find(
      (folder) => folder.name === props.rightSelectedFolder
    );
    if (selectedFolder) {
      let amountOfDecks = selectedFolder.decks.length;

      setAmountOfRightPages(Math.ceil(amountOfDecks / 5));
    } else {
      setAmountOfRightPages(0);
    }
  }, [props.folders]);

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
      props.setFolders((oldFolders) =>
        oldFolders.map((folder) => ({
          ...folder,
          decks: folder.decks.filter(
            (current_deck) => current_deck.name != deck.name
          ),
        }))
      );
      props.setRightSelectedFolder(props.rightSelectedFolder);
      props.setCardWindowDeck({
        name: "",
        cards: [],
        practiceModeScore: 0,
        activeRecallScore: 0,
      });
      props.setUpdateDeck(false);
    }
  }

  function deleteFolder() {
    props.setFolders((oldFolders) => {
      return oldFolders.filter((folder) => {
        return folder.name != props.rightSelectedFolder;
      });
    });
    if (props.folders.length === 1) {
      props.setFolders([
        {
          name: "",
          decks: [],
        },
      ]);
      props.setRightSelectedFolder("");
    }
  }

  return (
    <div id="deck-select-container">
      <p className="deck-select-header">Your Decks</p>

      {/* DROPDOWN TO SELECT FOLDER */}
      <select
        onChange={(e) => props.handleChangeRightSelectedFolder(e)}
        value={props.rightSelectedFolder}
        className="select--folder"
      >
        <option value="">Select</option>
        {props.folders.map((folder) => {
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
      {props.folders.map((folder) => {
        let index = -1;
        if (folder.name === props.rightSelectedFolder) {
          return folder.decks.map((deck) => {
            index++;
            if (rightPage === 1) {
              if (index < 5) {
                return (
                  <DeckThumbnail
                    deck={deck}
                    addToCardWindow={() => props.addToCardWindow(deck)}
                  />
                );
              }
            } else if (rightPage === 2) {
              if (index > 4 && index < 10) {
                return (
                  <DeckThumbnail
                    deck={deck}
                    addToCardWindow={() => props.addToCardWindow(deck)}
                  />
                );
              }
            } else if (rightPage === 3) {
              if (index > 10 && index < 16) {
                return (
                  <DeckThumbnail
                    deck={deck}
                    addToCardWindow={() => props.addToCardWindow(deck)}
                  />
                );
              }
            }
          });
        }
      })}
      <p>
        page {rightPage} / {amountOfRightPages === 0 ? "1" : amountOfRightPages}
      </p>
      {rightPage > 1 && (
        <PageButton
          mainFunction={() => setRightPage((old) => old - 1)}
          innerText={"Back"}
        />
      )}
      <div className="side-by-side-btns">
        {rightPage < amountOfRightPages && (
          <PageButton
            mainFunction={() => setRightPage((old) => old + 1)}
            innerText={"Next"}
          />
        )}
      </div>

      {/* DELETE DECKS BUTTON IF DECKS EXIST */}
      {props.folders[0].decks.length > 0 ? (
        <PageButton
          mainFunction={() => deleteDeck(props.cardWindowDeck)}
          innerText={"Delete Deck"}
        />
      ) : null}
      {props.rightSelectedFolder && (
        <PageButton mainFunction={deleteFolder} innerText={"Delete Folder"} />
      )}
    </div>
  );
}

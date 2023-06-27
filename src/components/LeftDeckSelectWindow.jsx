import { PageButton } from "./PageButton";
import DeckThumbnail from "./DeckThumbnail";
import { presetFolders } from "../assets/Decks";
import { useState } from "react";

export function LeftDeckSelectWindow(props) {
  //for selecting which deck get shown in the left window
  const [leftSelectedFolder, setLeftSelectedFolder] = useState(
    presetFolders[0].name
  );

  //page numbers for left and right sidebars
  const [leftPage, setLeftPage] = useState(1);

  //change the decks displayed in left viewport based on the Select element
  function handleChangeLeftSelectedFolder(e) {
    setLeftSelectedFolder(e.target.value);
  }

  return (
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
                      addToCardWindow={() => props.addToCardWindow(deck)}
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
                      addToCardWindow={() => props.addToCardWindow(deck)}
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
            <PageButton
              mainFunction={() => setLeftPage((old) => old - 1)}
              innerText={"Prev"}
            />
          )}
          {leftPage === 1 && (
            <PageButton
              mainFunction={() => setLeftPage((old) => old + 1)}
              innerText={"Next"}
            />
          )}
        </div>
      }
    </div>
  );
}

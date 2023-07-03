import { BigRedButton } from "./BigRedButton";
import { MediumRedButton } from "./MediumRedButton";
import { useState } from "react";

export function SaveToFolderPopup(props) {
  //for changing the currently shown folder decks on the right sidebar to be the one just created or just saved to.
  const [selectedFolderToSave, setSelectedFolderToSave] = useState("");
  //used to render Select element with all current folders when saving a new deck
  const [isChoosingAFolder, setIsChoosingAFolder] = useState(false);

  // the onChange of the Select element when saving a deck into an existing folder
  function handleChangeSelectedFolderToSave(e) {
    setSelectedFolderToSave(e.target.value);
  }

  //submit button for saving a new folder
  function handleSubmitToNewFolder() {
    //check if deck name already exists in folder.

    props.setFolders((old) => {
      return old.map((folder) => {
        if (
          selectedFolderToSave
            ? folder.name === selectedFolderToSave
            : folder.name === props.rightSelectedFolder
        ) {
          if (folder.decks.some((deck) => deck.name === props.decks.name)) {
            let newName = prompt(
              `Name: ${props.decks.name} already exists, please choose a unique name`
            );
            while (folder.decks.some((deck) => deck.name === newName)) {
              newName = prompt(
                `Name: ${newName} already exists, please choose a unique name`
              );
            }
            return {
              ...folder,
              decks: [
                ...folder.decks,
                {
                  name: newName,
                  cards: props.decks.cards,
                  practiceModeScore: 0,
                  activeRecallScore: 0,
                },
              ],
            };
          } else {
            return { ...folder, decks: [...folder.decks, props.decks] };
          }
        } else {
          return folder;
        }
      });
    });
    // reset decks
    props.setDecks({
      name: "",
      cards: [],
      practiceModeScore: 0,
      activeRecallScore: 0,
    });
    //unrenders div
    props.setIsSavingFolder(false);
    selectedFolderToSave
      ? props.setRightSelectedFolder(selectedFolderToSave)
      : null;
  }

  //for button that shows up only when creating new folder when some already exist
  function createNewFolderForButton() {
    let name = prompt("Name your new folder", "New Folder");
    if (!name) {
      return;
    }
    props.setFolders((old) => [...old, { name: name, decks: [props.decks] }]);
    //might need to delete this or something if it causes problems, just trying to get this down into Generate
    setSelectedFolderToSave(name);
    //changes right sidebar to show the decks in the newly created folder
    props.setRightSelectedFolder(name);
    //unrenders div in the middle of the screen
    props.setIsSavingFolder(false);
  }

  //renders a SELECT element with all existing folders... might be able to make this work better -- CHECK BACK HERE
  function addToExistingFolderForButton() {
    setIsChoosingAFolder(true);
  }

  function quit() {
    let response = confirm("Quitting will delete the deck. Continue?");
    if (!response) {
      return;
    } else {
      props.setIsSavingFolder(false);
    }
  }

  return (
    <div id="saving-folder-window">
      <h4>Create a new folder or add to an existing folder?</h4>
      <BigRedButton
        mainFunction={createNewFolderForButton}
        innerText={"Create New Folder"}
      />
      <BigRedButton
        mainFunction={addToExistingFolderForButton}
        innerText={"Add To Existing"}
      />

      {/* RENDERS Select ELEMENT ONLY AFTER CLICKING 'ADD TO EXISTING' BUTTON */}
      {isChoosingAFolder && (
        <>
          <select
            onChange={handleChangeSelectedFolderToSave}
            value={
              selectedFolderToSave
                ? selectedFolderToSave
                : props.rightSelectedFolder
            }
            className="select--difficulty"
          >
            <option value="">Choose a folder</option>
            {props.folders.map((folder) => {
              return (
                <option key={folder.name} value={folder.name}>
                  {folder.name}
                </option>
              );
            })}
          </select>
          <div className="side-by-side-btns">
            <MediumRedButton
              mainFunction={handleSubmitToNewFolder}
              innerText={"Save"}
            />
            <MediumRedButton mainFunction={quit} innerText={"Quit"} />
          </div>
        </>
      )}
    </div>
  );
}

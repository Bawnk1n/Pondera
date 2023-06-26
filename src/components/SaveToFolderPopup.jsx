import { BigRedButton } from "./BigRedButton";
import { useState } from "react";

export function SaveToFolderPopup(props) {
  const [selectedFolderToSave, setSelectedFolderToSave] = useState("");
  //used to render Select element with all current folders when saving a new deck
  const [isChoosingAFolder, setIsChoosingAFolder] = useState(false);

  // the onChange of the Select element when saving a deck into an existing folder
  function handleChangeSelectedFolderToSave(e) {
    setSelectedFolderToSave(e.target.value);
  }

  //submit button for saving a new folder
  function handleSubmitToNewFolder() {
    props.setFolders((old) => {
      return old.map((folder) => {
        if (folder.name === selectedFolderToSave) {
          return { ...folder, decks: [...folder.decks, props.decks] };
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
    props.setRightSelectedFolder(selectedFolderToSave);
  }

  //for button that shows up only when creating new folder when some already exist
  function createNewFolderForButton() {
    let name = prompt("Name your new folder", "New Folder");
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
            value={selectedFolderToSave}
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
          <BigRedButton
            mainFunction={handleSubmitToNewFolder}
            innerText={"Save"}
          />
        </>
      )}
    </div>
  );
}
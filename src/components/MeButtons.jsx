import { MediumRedButton } from "./MediumRedButton";

export function MeButtons(props) {
  return (
    <div id="me-buttons">
      {/* IF YOU CHOOSE A DECK FROM THE SIDEBAR, BTN WILL CHANGE TO 'UPDATE DECK', OTHERWISE IT WILL BE 'SAVE DECK' */}
      {/* BUTTONS SHOW WHEN IN VIEW MODE */}
      {props.viewportMode === "View" &&
      props.cardWindowDeck.cards.length > 0 &&
      props.cardAdded ? (
        <>
          {props.updateDeck ? (
            <MediumRedButton
              mainFunction={props.updateDeckFunction}
              innerText={"Update Deck"}
            />
          ) : (
            <MediumRedButton
              mainFunction={() => props.saveNewDeck(props.cardWindowDeck)}
              innerText={"Save Deck"}
            />
          )}
        </>
      ) : null}
      {/* CLEAR WINDOW BTN SHOWN WHEN THERE ARE ANY CARDS IN THE WINDOW*/}
      {props.viewportMode === "View" &&
        props.cardWindowDeck.cards.length > 0 && (
          <MediumRedButton
            mainFunction={props.clearWindow}
            innerText="Clear Window"
          />
        )}
    </div>
  );
}

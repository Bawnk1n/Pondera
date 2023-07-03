import Card from "./Card";

export function CardWindow(props) {
  return (
    <div id="card-window-transition">
      <div id="card-window">
        {props.cardWindowDeck.cards.length > 0
          ? props.cardWindowDeck.cards.map((card) => {
              return (
                <Card
                  key={card.front}
                  card={card}
                  flip={props.flip}
                  flipCard={props.flipCard}
                  cardWindowDeck={props.cardWindowDeck}
                  folders={props.folders}
                  setFolders={props.setFolders}
                  editMode={props.editMode ? true : false}
                  setCardWindowDeck={props.setCardWindowDeck}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

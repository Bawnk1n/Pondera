import Card from "./Card";

export function CardWindow(props) {
  return (
    <div id="card-window-transition">
      <div id="card-window">
        {props.cardWindowDeck.cards
          ? props.cardWindowDeck.cards.map((card) => {
              return (
                <Card
                  key={card}
                  card={card}
                  flip={props.flip}
                  flipCard={props.flipCard}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

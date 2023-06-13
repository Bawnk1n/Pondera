import Card from "./Card";

export function CardWindow(props) {
  return (
    <div id="card-window">
      {props.newDeck.map((card) => {
        return <Card card={card} />;
      })}
      {props.cardWindowDeck
        ? props.cardWindowDeck.map((card) => {
            return <Card card={card} />;
          })
        : null}
    </div>
  );
}

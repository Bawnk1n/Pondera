export default function (props) {
  function handleClick() {
    props.addToCardWindow(props.deck);
  }

  return (
    <div id="deck-picture" onClick={handleClick}>
      <div class="deck-thumbnail">
        <p>{props.deck.name}</p>
      </div>
      <div id="background-box"></div>
    </div>
  );
}

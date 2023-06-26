export function MediumRedButton(props) {
  function handleClick() {
    props.mainFunction();
  }
  return (
    <button onClick={handleClick} className="medium-red-btn">
      Save Deck
    </button>
  );
}

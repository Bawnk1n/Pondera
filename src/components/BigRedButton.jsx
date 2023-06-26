export function BigRedButton(props) {
  function handleClick() {
    props.mainFunction();
  }
  return (
    <button onClick={handleClick} className="btn--red">
      {props.innerText}
    </button>
  );
}

export function PageButton(props) {
  function handleClick() {
    props.mainFunction();
  }
  return (
    <button className="page-button" onClick={handleClick}>
      {props.innerText}
    </button>
  );
}

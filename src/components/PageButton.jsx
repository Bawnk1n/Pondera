export function PageButton(props) {
  function handleClick() {
    props.mainFunction();
  }
  return (
    <button
      className="page-button"
      onClick={handleClick}
      style={{ ...(props.width ? { width: props.width, minWidth: "0" } : {}) }}
    >
      {" "}
      {props.innerText}
    </button>
  );
}

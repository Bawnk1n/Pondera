

export default function(props) {

function handleClick() {
    props.addToCardWindow(props.deck)
}

    return (
        <div id="deck-picture" onClick={handleClick}>
            <div class='deck-thumbnail' >
                <h4>{props.deck.name}</h4>
            </div>
            <div id='background-box'></div>
        </div>
    )
}
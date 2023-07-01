# Ponderosa

#### Video Demo: <https://rumble.com/v2x3ytm-my-cs50-final-project.html>

#### Description:

##### Functionalities:

###### GENERATE DECKS MODE

The landing page is the 'Generate Decks' mode. On this page you will find a form with 2 dropdowns populated with some preset options, but also double as text inputs and will accept typed responses as well. Below that is a dropdown with options for 'level of difficulty' and below that is the (optional) dialect input (useful for travellers with specific destinations and learning requirements in mind)
If this is your first deck, clicking 'Generate' will generate a new deck from scratch, you then have the option to save or discard it (sometimes the openAI API call returns some funky stuff). If you choose to save it, you will be prompted to name your deck and name a new folder in which it will be placed.
If this is not your first deck, the 'Continnue' button will appear, this button will also create a new deck, but it will collect all the cards already in your **currently selected folder** (the folder viewable on the right sidebar). This feature doesn't always work correctly and might require a few tries to get to preference.

Clicking on the cards will flip them to the back side, which, if the API call has worked correctly, will be the translation in the target language.
Sometimes when the difficulty is set to advanced, and a dialect is chosen, the API call will return the target language on the front of the cards, and english on the back, for cases like this there is a 'Swap' button at the bottom of the page which will swap the fronts and the backs, to keep things consistent.

Instructions for this process can be shown or hidden via the 'Show/Hide Directions button close to the top of the page

###### VIEW MODE

You can then click on any deck from either sidebar (left sidebar is preset decks in Spanish to give you some ideas) or the 'Main Viewport' button to take you to the 'View' mode viewport. in this viewport you will be able to see all the cards in the selected deck, your current stats for 'Practice Mode Score' and 'Active Recall' score, and buttons to enter 'Practice Mode', 'Active Recall Mode' or go back to 'Generate' mode.

###### PRACTICE MODE

Clicking the 'Practice Mode' button will take you to practice mode, which is just a simple mode that shows the front of one card at a time, you then try your best to remember what is on the other side, then click the card to see if you were correct or not. Pass/Fail buttons appear at this point to record your progress. At the end of the deck the mode will end and automatically set your deck stats to the new score if it is a top score.

###### ACTIVE RECALL MODE

Active Recall mode is much less forgiving. You do not have the ability to flip the card manually, you must type what you think is on the back and submit it to be able to see what is on the back. The input is not case sensitive and will remove any trailing whitespace, but you MUST get accent marks correct. If you are using a US keyboard, its a good idea to download the target language to your system, then turn autocorrect on, unless you don't mind doing a lot of mouse clicking to extract the correct accented letters from the 'character map' program (Windows).

Happy learning!

##### Files and Descriptions

App.jsx: Main file to peruse the structure of the app

App.css: Stylesheet for the entire app

Api.js: file with function that calls the OpenAI API

Components: All component files are named for what they contain and should be easily traversable.

assets/Decks.jsx: File containing the preset decks which populate the left sidebar.

/*-------------------------Constants-------------------------*/

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const values = {
    'A': 11,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10
};


/*-------------------------Variables-------------------------*/

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let isGameActive = false;
let playerBalance = 1000;


/*-------------------------Cached Elements-------------------------*/

const dealerCardsEl = document.querySelector('dealer-cards');
const playerCardsEl = document.querySelector('player-cards');
const dealerScoreEl = document.querySelector('dealer-score');
const playerScoreEl = document.querySelector('player-score');
const messageEl = document.querySelector('#message');
const balanceEl = document.querySelector('#balance');

const dealBtn = document.querySelector('#deal-btn');
const hitBtn = document.querySelector('#hit-btn');
const standBtn = document.querySelector('#stand-btn');
const resetBtn = document.querySelector('#reset-btn');


/*------------------------Functions-------------------------*/

// Initializing game


function init() {
    deck = [];
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    gameActive = false;


    messageEl.textContent = 'Welcome to Blackjack! Click Deal to start.';
    dealBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;


    render();
    
}


// Creating deck of cards

function createDeck() {
    const newDeck = [];

    suits.forEach(suit => {
        ranks.forEach(rank => {
            newDeck.push({
                suit: suit,
                rank: rank,
                value: values[rank]
            })
        })
    })

    return newDeck;

}

// Shuffling deck of cards

function shuffleDeck(deckToShuffle) {
    for (let i = deckToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckToShuffle[i], deckToShuffle[j]] = [deckToShuffle[j], deckToShuffle[i]];
    }
    return deckToShuffle;
}

// Deal card from deck

function dealCard() {
    return deck.pop();
}

// Calculate score of hand

function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;

    // Add values for each card

    hand.forEach(card => {
        score += card.value;
        if (card.rank === 'A') {
            aceCount++;
        }
    });

    // Adjust for Aces if score is over 21
    
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    return score;

}





























/*-------------------------Event Listeners-------------------------*/

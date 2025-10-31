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
let gameActive = false;
let playerBalance = 1000;


/*-------------------------Cached Elements-------------------------*/

const dealerCardsEl = document.querySelector('#dealer-cards');
const playerCardsEl = document.querySelector('#player-cards');
const dealerScoreEl = document.querySelector('#dealer-score');
const playerScoreEl = document.querySelector('#player-score');
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
        score -= 10;   // <-- makes the ace count as 1 instead of 11
        aceCount--;
    }

    return score;

}

// Initialize game

function startGame() {
    deck = createDeck(); 
    deck = shuffleDeck(deck);

    playerHand = [];
    dealerHand = [];

    // Deal initial cards
    
    playerHand.push(dealCard());
    dealerHand.push(dealCard());
    playerHand.push(dealCard());
    dealerHand.push(dealCard());

    // Calculate scores

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    // Set game as active

    gameActive = true;

    // Update buttons

    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;

    messageEl.textContent = 'Hit or Stand?';

    // Check for immediate blackjack

    if (playerScore === 21) {
        messageEl.textContent = 'Blackjack! You win!';
        endGame();
        return;

    }

    render();
}

// Player hits

function playerHit() {
    if(!gameActive) return;

    // Deal one card to player

    playerHand.push(dealCard());
    playerScore = calculateScore(playerHand);

    // Check for bust

    if (playerScore > 21) {
        messageEl.textContent = 'You busted! Dealer wins.';
        endGame();
    } else if (playerScore === 21) {
        playerStand();
    }

    render();
}

// Player stands

function playerStand() {
    if(!gameActive) return;

    // Dealer draws cards until reaching 17

    while (dealerScore < 17) {
        dealerHand.push(dealCard());
        dealerScore = calculateScore(dealerHand);
    }

    // Determine winner
    determineWinner();
    endGame();
}

// Determine the winner

function determineWinner() {
    if (dealerScore > 21) {
        messageEl.textContent = 'Dealer busts You win!';
        playerBalance += 100;
    } else if (playerScore > dealerScore) {
        messageEl.textContent = 'You win!';
        playerBalance += 100;
    } else if (playerScore < dealerScore) {
        messageEl.textContent = 'Dealer wins!';
        playerBalance -= 100;
    } else {
        messageEl.textContent = "Push! It's a tie.";
    }
}

// End the game

function endGame() {
    gameActive = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealBtn.disabled = false; 
    render();
}


// Render the game state


function render() {
    playerCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';



// Render player's cards

playerHand.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');
    cardEl.classList.add(card.suit === '♥️' || card.suit === '♦️' ? 'red' : 'black');
    cardEl.innerHTML = `<div>${card.rank}</div><div>${card.suit}</div>`;
    playerCardsEl.appendChild(cardEl);
})

//Render dealer's cards

dealerHand.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');

    // Hide first dealer card if game is active 
    if (index === 0 && gameActive) {
        cardEl.classList.add('hidden');
        cardEl.textContent = '?';
    } else {
        cardEl.classList.add(card.suit === '♥️' || card.suit === '♦️' ? 'red' : 'black');
        cardEl.innerHTML = `<div>${card.rank}</div><div>${card.suit}</div>`;
    }

    dealerCardsEl.appendChild(cardEl);
});

//Update scores

playerScoreEl.textContent = playerScore;
dealerScoreEl.textContent = gameActive ? '?' : dealerScore;

//Update balance


balanceEl.textContent = playerBalance;

}


/*-------------------------Event Listeners-------------------------*/


dealBtn.addEventListener('click', startGame);
hitBtn.addEventListener('click', playerHit);
standBtn.addEventListener('click', playerStand);
resetBtn.addEventListener('click', init);

// Initialize on load

init();

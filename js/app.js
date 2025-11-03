



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
let currentBet = 0;


/*-------------------------Cached Elements-------------------------*/

const dealerCardsEl = document.querySelector('#dealer-cards');
const playerCardsEl = document.querySelector('#player-cards');
const dealerScoreEl = document.querySelector('#dealer-score');
const playerScoreEl = document.querySelector('#player-score');
const messageEl = document.querySelector('#message');
const balanceEl = document.querySelector('#balance');
const betInputEl = document.querySelector('#bet-input');

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
    currentBet = 0;  
    


    messageEl.textContent = 'Welcome to Blackjack! Click Deal to start.';
    dealBtn.disabled = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    betInputEl.disabled = false;


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

// Animation of card dealing from deck

function animateDeal(target) {
    const deckCard = document.querySelector('.deck-card:last-child');
        if(!deckCard) return;

        const animatedCard = deckCard.cloneNode(true);
        document.body.appendChild(animatedCard);

        animatedCard.style.position = 'fixed';
        animatedCard.style.left = '50px';
        animatedCard.style.top = '50%';
        animatedCard.style.zIndex = '100';

        // Add animation class based on target

        if (target === 'player') {
            animatedCard.classList.add('dealing-to-player');
        } else {
            animatedCard.classList.add('dealing-to-dealer');
        }

        // Remove the animated card after animation completes

        setTimeout(() => {
            animatedCard.remove();
        }, 600);
    
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

    const betAmount = parseInt(betInputEl.value);

    if (isNaN(betAmount) || betAmount < 1 || betAmount > 100) {
        messageEl.textContent = 'Please enter a bet amount between $1 and $100';
        return; 
    }
    if (betAmount > playerBalance) {
        messageEl.textContent = 'Insufficient balance! Lower your bet.';
        return;
    }

    // Deduct bet from balance

    currentBet = betAmount;
    playerBalance -= currentBet;
    betInputEl.disabled = true;

    deck = createDeck(); 
    deck = shuffleDeck(deck);

    playerHand = [];
    dealerHand = [];

    // Deal initial cards
    
    setTimeout(() => {
        animateDeal('player');
        playerHand.push(dealCard());
    }, 100);

    setTimeout(() => {
        animateDeal('dealer');
        dealerHand.push(dealCard());
        render();
    }, 300);

    setTimeout(() => {
        animateDeal('player');
        playerHand.push(dealCard());
        render();
    }, 500);

    setTimeout(() => {
        animateDeal('dealer');
        dealerHand.push(dealCard());
    
    // Calculate scores

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);


    // Check for immediate blackjack

    if (playerScore === 21) {
        messageEl.textContent = 'Blackjack! You win!';
        playerBalance += currentBet * 2.5;
        endGame();
        return;
    }

    render();
}, 700);

    // Set game as active

    gameActive = true;

    // Update buttons

    dealBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;

    messageEl.textContent = 'Hit or Stand?';
}



// Player hits

function playerHit() {
    if(!gameActive) return;

    // Animate dealing
    animateDeal('player');

    // Deal one card to player

    setTimeout(() => {
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
  }, 300);
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
        playerBalance += currentBet * 2;
    } else if (playerScore > dealerScore) {
        messageEl.textContent = 'You win!';
        playerBalance += currentBet * 2;
    } else if (playerScore < dealerScore) {
        messageEl.textContent = 'Dealer wins!';
    
    } else {

        messageEl.textContent = "Push! It's a tie.";
        playerBalance += currentBet; 
    }
}

// End the game

function endGame() {
    gameActive = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealBtn.disabled = false;
    betInputEl.disabled = false;  
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

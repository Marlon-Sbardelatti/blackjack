// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
let deckID = "";
async function getDeck(event) {
  try {
    //creating a brand new deck
    let path = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    deckID = data.deck_id;
  } catch (e) {
    console.log("Error: ", e);
  }
}

let playerCount = 0;
let dealersCount = 0;

function convertCardValue(card) {
  if (card.value == "ACE") {
    return 11;
  } else if (
    card.value == "KING" ||
    card.value == "QUEEN" ||
    card.value == "JACK"
  ) {
    return 10;
  }

  return Number(card.value);
}

function verifyGame(playerCount, dealersCount) {
  if (playerCount > 21 || dealersCount == 21) {
    let buttons = document.getElementById("action-btns");
    buttons.setAttribute("style", "display: none");
    let misteryCardDiv = document.getElementsByClassName("mistery-card")[0];
    misteryCardDiv.setAttribute("src", misteryCard.image);
    misteryCardDiv.classList.remove("mistery-card");
    let count = document.getElementById("dealer-count");
    count.innerText = `Dealer's count: ${dealersCount}`;

    let div = document.createElement("div");
    div.classList.add("result");
    let winner = document.createElement("h2");
    winner.innerText = "Dealer Won!";
    let dhand = document.createElement("p");
    dhand.innerText = `Dealers's hand: ${dealersCount}`;
    let phand = document.createElement("p");
    phand.innerText = `Players's hand: ${playerCount}`;
    div.appendChild(winner);
    div.appendChild(dhand);
    div.appendChild(phand);
    // document.getElementById("dealers-hand").appendChild(div);
    let container = document.getElementById("container-result");
    container.appendChild(div);
    container.setAttribute("style", "display: block");
    let btn = document.getElementById("start-btn");
    btn.innerText = "Restart";
    btn.setAttribute("style", "display: block");
    return true;
  } else if (dealersCount > 21 || playerCount == 21) {
    let misteryCardDiv = document.getElementsByClassName("mistery-card")[0];
    misteryCardDiv.setAttribute("src", misteryCard.image);
    misteryCardDiv.classList.remove("mistery-card");
    let count = document.getElementById("dealer-count");
    count.innerText = `Dealer's count: ${dealersCount}`;

    let div = document.createElement("div");
    div.classList.add("result");
    let winner = document.createElement("h2");
    winner.innerText = "Player Won!";
    let phand = document.createElement("p");
    phand.innerText = `Players's hand: ${playerCount}`;
    let dhand = document.createElement("p");
    dhand.innerText = `Dealers's hand: ${dealersCount}`;
    div.appendChild(winner);
    div.appendChild(phand);
    div.appendChild(dhand);
    // document.getElementById("players-hand").appendChild(div);
    let container = document.getElementById("container-result");
    container.appendChild(div);
    container.setAttribute("style", "display: block");
    let btn = document.getElementById("start-btn");
    btn.innerText = "Restart";
    btn.setAttribute("style", "display: block");
    return true;
  }
  return false;
}

getDeck();

let misteryCard = "";
async function start(event) {
  try {
    if (document.getElementsByClassName("result")) {
      clearCards();
      let buttons = document.getElementById("action-btns");
      buttons.setAttribute("style", "display: block");
      let container = document.getElementById("container-result");
      container.setAttribute("style", "display: none");
    }
    if (document.getElementById("imgs-container")) {
      let imgsDiv = document.getElementById("imgs-container");
      imgsDiv.setAttribute("style", "display: none");
    }
    let path = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`;
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();

    if (!data.success) {
      getDeck();
    }

    let dealersCard = document.createElement("img");
    dealersCard.setAttribute("src", data.cards[0].image);
    dealersCount += convertCardValue(data.cards[0]);
    let dealersDiv = document
      .getElementById("dealers-hand")
      .getElementsByTagName("div")[0];
    dealersDiv.appendChild(dealersCard);
    dealersCard = document.createElement("img");
    dealersCard.setAttribute("src", "../styles/assets/back-card.png");
    dealersCard.classList.add("mistery-card");
    // dealersCount += convertCardValue(data.cards[0]);
    dealersDiv = document
      .getElementById("dealers-hand")
      .getElementsByTagName("div")[0];
    dealersDiv.appendChild(dealersCard);
    document.getElementById("dealer-count").innerText =
      "Dealer's hand: " + dealersCount;
    // `Dealer's count: ${dealersCount}`;
    document
      .getElementById("dealer-count")
      .setAttribute("style", "display: block");

    let playersCard = document.createElement("img");
    playersCard.setAttribute("src", data.cards[1].image);
    playerCount += convertCardValue(data.cards[1]);
    let playersDiv = document
      .getElementById("players-hand")
      .getElementsByTagName("div")[0];
    playersDiv.appendChild(playersCard);

    playersCard = document.createElement("img");
    playersCard.setAttribute("src", data.cards[3].image);
    playerCount += convertCardValue(data.cards[3]);
    playersDiv = document
      .getElementById("players-hand")
      .getElementsByTagName("div")[0];
    playersDiv.appendChild(playersCard);

    document.getElementById("player-count").innerText =
      "Your hand: " + playerCount;
    // `Player's count: ${playerCount}`;
    document
      .getElementById("player-count")
      .setAttribute("style", "display: block");

    misteryCard = data.cards[2];
    dealersCount += convertCardValue(data.cards[2]);

    document.getElementById("start-btn").setAttribute("style", "display: none");
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function hit(event) {
  try {
    let path = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`;
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();

    if (!data.success) {
      getDeck();
    }
    let playersCard = document.createElement("img");
    playersCard.setAttribute("src", data.cards[0].image);
    playerCount += convertCardValue(data.cards[0]);
    let playersDiv = document
      .getElementById("players-hand")
      .getElementsByTagName("div")[0];
    playersDiv.appendChild(playersCard);
    document.getElementById("player-count").innerText =
      `Player's count: ${playerCount}`;
    verifyGame(playerCount, dealersCount);
  } catch (error) {
    console.log("Error: ", error);
  }
}

function clearCards() {
  let divs = document.getElementsByClassName("cards-container");

  for (const div of divs) {
    div.innerHTML = "";
  }

  let result = document.getElementsByClassName("result");
  for (const div of result) {
    div.innerHTML = "";
  }

  playerCount = 0;
  dealersCount = 0;
}

function stay(event) {
  let misteryCardDiv = document.getElementsByClassName("mistery-card")[0];
  misteryCardDiv.setAttribute("src", misteryCard.image);
  misteryCardDiv.classList.remove("mistery-card");
  let count = document.getElementById("dealer-count");
  count.innerText = `Dealer's count: ${dealersCount}`;
  let buttonsDiv = document.getElementById("action-btns");
  buttonsDiv.setAttribute("style", "display: none");

  if (dealersCount <= 16) {
    dealerHit();
  } else {
    verifyAfterDealer(playerCount, dealersCount);
  }
}

function dealerHit(arguments) {
  let path = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`;
  fetch(path, {})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.success) {
        getDeck();
      }
      let dealersCard = document.createElement("img");
      dealersCard.setAttribute("src", data.cards[0].image);
      dealersCount += convertCardValue(data.cards[0]);
      let dealersDiv = document
        .getElementById("dealers-hand")
        .getElementsByTagName("div")[0];
      dealersDiv.appendChild(dealersCard);
      document.getElementById("dealer-count").innerText =
        `Dealer's count: ${dealersCount}`;
      if (dealersCount <= 16) {
        dealerHit();
      } else {
        verifyAfterDealer(playerCount, dealersCount);
      }
    })
    .catch((error) => {
      alert("Usuário não encontrado");
      console.error("Error:", error);
    });
}

function verifyAfterDealer(playerCount, dealersCount) {
  if (dealersCount > 21) {
    playerWon();
  } else if (dealersCount > playerCount) {
    dealerWon();
  } else if (dealersCount == playerCount) {
    draw();
  } else {
    playerWon();
  }
}
function playerWon() {
  let count = document.getElementById("dealer-count");
  count.innerText = `Dealer's count: ${dealersCount}`;

  let div = document.createElement("div");
  div.classList.add("result");
  let winner = document.createElement("h2");
  winner.innerText = "Player Won!";
  let phand = document.createElement("p");
  phand.innerText = `Players's hand: ${playerCount}`;
  let dhand = document.createElement("p");
  dhand.innerText = `Dealers's hand: ${dealersCount}`;
  div.appendChild(winner);
  div.appendChild(phand);
  div.appendChild(dhand);
  // document.getElementById("players-hand").appendChild(div);
  let container = document.getElementById("container-result");
  container.appendChild(div);
  container.setAttribute("style", "display: block");
  let btn = document.getElementById("start-btn");
  btn.innerText = "Restart";
  btn.setAttribute("style", "display: block");
  return true;
}
function dealerWon() {
  let buttons = document.getElementById("action-btns");
  buttons.setAttribute("style", "display: none");
  let count = document.getElementById("dealer-count");
  count.innerText = `Dealer's count: ${dealersCount}`;

  let div = document.createElement("div");
  div.classList.add("result");
  let winner = document.createElement("h2");
  winner.innerText = "Dealer Won!";
  let dhand = document.createElement("p");
  dhand.innerText = `Dealers's hand: ${dealersCount}`;
  let phand = document.createElement("p");
  phand.innerText = `Players's hand: ${playerCount}`;
  div.appendChild(winner);
  div.appendChild(dhand);
  div.appendChild(phand);
  // document.getElementById("dealers-hand").appendChild(div);
  let container = document.getElementById("container-result");
  container.appendChild(div);
  container.setAttribute("style", "display: block");
  let btn = document.getElementById("start-btn");
  btn.innerText = "Restart";
  btn.setAttribute("style", "display: block");
  return true;
}
function draw() {
  let buttons = document.getElementById("action-btns");
  buttons.setAttribute("style", "display: none");
  let count = document.getElementById("dealer-count");
  count.innerText = `Dealer's count: ${dealersCount}`;

  let div = document.createElement("div");
  div.classList.add("result");
  let winner = document.createElement("h2");
  winner.innerText = "Draw:";
  let dhand = document.createElement("p");
  dhand.innerText = `Dealers's hand: ${dealersCount}`;
  let phand = document.createElement("p");
  phand.innerText = `Players's hand: ${playerCount}`;
  div.appendChild(winner);
  div.appendChild(dhand);
  div.appendChild(phand);
  // document.getElementById("dealers-hand").appendChild(div);
  let container = document.getElementById("container-result");
  container.appendChild(div);
  container.setAttribute("style", "display: block");
  let btn = document.getElementById("start-btn");
  btn.innerText = "Restart";
  btn.setAttribute("style", "display: block");
  return true;
}

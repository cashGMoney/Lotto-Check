// script.js
const tickets = [
  [12, 18, 25, 33, 47, 9],
  [3, 15, 22, 41, 60, 17],
  [5, 13, 29, 38, 66, 4],
  [7, 19, 26, 35, 58, 21],
  [2, 14, 28, 44, 67, 11],
  [6, 20, 31, 39, 59, 26],
  [9, 16, 24, 36, 62, 2],
  [10, 21, 30, 42, 65, 13],
  [1, 17, 27, 34, 63, 7],
  [8, 23, 32, 40, 68, 19],
  [11, 22, 37, 45, 64, 5],
  [4, 12, 33, 46, 61, 25],
  [15, 18, 29, 43, 66, 8],
  [13, 19, 28, 38, 67, 14],
  [2, 16, 30, 41, 60, 6],
  [5, 20, 31, 39, 59, 24],
  [7, 21, 32, 44, 62, 10],
  [3, 14, 27, 35, 65, 23],
  [6, 17, 26, 36, 63, 12],
  [9, 22, 34, 40, 68, 1],
  [8, 13, 25, 42, 64, 18],
  [10, 15, 24, 37, 61, 20],
  [1, 19, 29, 43, 66, 16],
  [11, 14, 28, 45, 67, 3],
  [4, 18, 30, 38, 60, 22],
  [12, 21, 31, 39, 59, 15],
  [2, 23, 32, 44, 62, 26],
  [5, 16, 27, 35, 65, 9],
  [7, 20, 33, 36, 63, 19],
  [3, 17, 26, 40, 68, 25]
];


function getWinningNumbers() {
  const nums = [];
  for (let i = 1; i <= 5; i++) {
    const val = parseInt(document.getElementById(`num${i}`).value);
    if (!isNaN(val)) nums.push(val);
  }
  const powerball = parseInt(document.getElementById("powerball").value);
  return { nums, powerball };
}

function launchConfetti() {
  const confetti = document.createElement("div");
  confetti.className = "confetti";
  confetti.innerHTML = "🎊🎉✨💥🎈";
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 2000);
}

function checkTickets() {
  const { nums: winning, powerball } = getWinningNumbers();
  const resultsDiv = document.getElementById("results");

  while (resultsDiv.firstChild) {
    resultsDiv.removeChild(resultsDiv.firstChild);
  }

  let winCount = 0;

  const scoredTickets = tickets.map((ticket, index) => {
    const regularMatches = ticket.slice(0, 5).filter(n => winning.includes(n)).length;
    const powerMatch = ticket[5] === powerball;
    const isWinner = powerMatch || regularMatches >= 3;
    if (isWinner) winCount++;
    return { ticket, regularMatches, powerMatch, isWinner, index };
  });

  scoredTickets.sort((a, b) => {
    if (a.isWinner && !b.isWinner) return -1;
    if (!a.isWinner && b.isWinner) return 1;
    if (b.regularMatches !== a.regularMatches) return b.regularMatches - a.regularMatches;
    if (b.powerMatch && !a.powerMatch) return 1;
    if (!b.powerMatch && a.powerMatch) return -1;
    return 0;
  });

  const summaryContainer = document.createElement("div");
  summaryContainer.className = "summary";
  summaryContainer.innerHTML = winCount > 0
    ? `🎉 You have <strong>${winCount}</strong> winning line${winCount > 1 ? "s" : ""}!`
    : `😢 No winning lines this time. Try again!`;
  resultsDiv.appendChild(summaryContainer);

  if (winCount > 0) launchConfetti();

  const ticketContainer = document.createElement("div");
  ticketContainer.className = "ticket-container";

  scoredTickets.forEach(({ ticket, regularMatches, powerMatch, isWinner, index }) => {
  const div = document.createElement("div");
  div.className = "ticket";

  const formatted = ticket.map((n, idx) => {
    const isMatch = idx < 5 ? winning.includes(n) : n === powerball;
    const ballClass = idx === 5 ? 'powerball' : '';
    return `<span class="${isMatch ? 'match' : ''} ${ballClass}">${n}</span>`;
  }).join(", ");

  div.innerHTML = `<strong>Line ${index + 1}:</strong> ${formatted} — ${regularMatches}/5 ${powerMatch ? "+ PB✓" : "+ PB✗"} ${isWinner ? "<span class='winner'>🎉 Winner!</span>" : ""}`;
  ticketContainer.appendChild(div);
});


  resultsDiv.appendChild(ticketContainer);
}



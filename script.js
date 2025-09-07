// script.js
const tickets = [
  [8, 27, 28, 50, 67, 6],
  [7, 19, 33, 40, 54, 8],
  [5, 42, 51, 55, 56, 1],
  [6, 10, 33, 46, 60, 18],
  [24, 33, 35, 46, 55, 4],
  [10, 26, 33, 34, 41, 17],
  [21, 30, 41, 44, 49, 12],
  [14, 33, 47, 68, 69, 20],
  [6, 29, 42, 44, 67, 8],
  [12, 15, 34, 44, 49, 14],
  [26, 28, 33, 34, 37, 2],
  [12, 16, 22, 25, 28, 9],
  [26, 28, 31, 36, 69, 25],
  [31, 36, 52, 58, 63, 19],
  [23, 33, 46, 61, 64, 18],
  [13, 16, 30, 36, 58, 16],
  [14, 22, 36, 39, 59, 10],
  [11, 18, 19, 33, 47, 23],
  [4, 9, 40, 41, 67, 25],
  [10, 22, 39, 53, 61, 22],
  [11, 24, 29, 30, 64, 12],
  [8, 11, 38, 55, 56, 1],
  [16, 34, 40, 55, 67, 26],
  [20, 32, 33, 55, 69, 8],
  [2, 4, 18, 29, 50, 9]
];

function getPrize(regularMatches, powerMatch) {
  if (regularMatches === 5 && powerMatch) return "Grand Prize";
  if (regularMatches === 5) return "$1,000,000";
  if (regularMatches === 4 && powerMatch) return "$50,000";
  if (regularMatches === 4) return "$100";
  if (regularMatches === 3 && powerMatch) return "$100";
  if (regularMatches === 3) return "$7";
  if (regularMatches === 2 && powerMatch) return "$7";
  if (regularMatches === 1 && powerMatch) return "$4";
  if (regularMatches === 0 && powerMatch) return "$4";
  return "$0";
}

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
  let totalWon = 0;

  const scoredTickets = tickets.map((ticket, index) => {
    const regularMatches = ticket.slice(0, 5).filter(n => winning.includes(n)).length;
    const powerMatch = ticket[5] === powerball;
    const isWinner = powerMatch || regularMatches >= 3;
    const prize = getPrize(regularMatches, powerMatch);

    if (prize !== "$0") {
      winCount++;
      if (prize !== "Grand Prize") {
        totalWon += parseInt(prize.replace(/[^0-9]/g, ""));
      }
    }

    return { ticket, regularMatches, powerMatch, isWinner, prize, index };
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
  summaryContainer.innerHTML = `
    🎉 You have <strong>${winCount}</strong> winning line${winCount > 1 ? "s" : ""}!<br>
    💰 Total Won: <strong>${totalWon > 0 ? `$${totalWon.toLocaleString()}` : "$0"}</strong>
  `;
  resultsDiv.appendChild(summaryContainer);

  if (winCount > 0) launchConfetti();

  const ticketContainer = document.createElement("div");
  ticketContainer.className = "ticket-container";

  scoredTickets.forEach(({ ticket, regularMatches, powerMatch, isWinner, prize, index }) => {
    const div = document.createElement("div");
    div.className = "ticket";

    const formatted = ticket.map((n, idx) => {
      const isMatch = idx < 5 ? winning.includes(n) : n === powerball;
      const ballClass = idx === 5 ? 'powerball' : '';
      return `<span class="${isMatch ? 'match' : ''} ${ballClass}">${n}</span>`;
    }).join(", ");

    div.innerHTML = `
      <strong>Line ${index + 1}:</strong> ${formatted} — ${regularMatches}/5 ${powerMatch ? "+ PB✓" : "+ PB✗"}
      ${isWinner ? `<span class='winner'>🎉 Winner!</span>` : ""}
      <br><span class="prize">Prize: ${prize}</span>
    `;
    ticketContainer.appendChild(div);
  });

  resultsDiv.appendChild(ticketContainer);
}




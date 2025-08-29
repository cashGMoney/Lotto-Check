// script.js
const tickets = [
  [10, 18, 65, 66, 67, 9],
  [5, 20, 34, 51, 66, 13],
  [10, 52, 53, 64, 65, 22],
  [26, 42, 43, 50, 63, 22],
  [2, 14, 33, 50, 63, 10],
  [5, 27, 34, 40, 58, 18],
  [11, 13, 23, 29, 46, 11],
  [2, 18, 20, 50, 60, 23],
  [18, 24, 27, 42, 68, 3],
  [20, 28, 40, 54, 62, 19],
  [22, 49, 54, 56, 69, 18],
  [8, 19, 24, 38, 56, 10],
  [11, 12, 36, 48, 60, 22],
  [20, 38, 47, 63, 67, 8],
  [5, 18, 31, 35, 40, 22],
  [5, 6, 22, 23, 68, 15],
  [11, 12, 48, 50, 67, 26],
  [6, 23, 31, 52, 53, 9],
  [1, 21, 35, 42, 60, 20],
  [12, 20, 24, 39, 51, 4],
  [14, 20, 32, 38, 48, 19],
  [3, 22, 39, 62, 69, 15],
  [1, 14, 29, 39, 44, 9],
  [2, 34, 40, 60, 63, 4],
  [17, 34, 38, 53, 58, 14],
  [1, 17, 40, 42, 47, 12],
  [5, 12, 23, 57, 69, 1],
  [21, 26, 35, 49, 54, 7],
  [12, 26, 30, 35, 44, 14],
  [19, 56, 58, 65, 68, 2]
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




// script.js
const tickets = [
  [5, 12, 23, 34, 45, 13], // Last number is Powerball
  [1, 2, 3, 4, 5, 26],
  // Add up to 30 lines here
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

  scoredTickets.forEach(({ ticket, regularMatches, powerMatch, isWinner }, i) => {
    const div = document.createElement("div");
    div.className = "ticket";
    const formatted = ticket.map((n, idx) => {
      const isMatch = idx < 5 ? winning.includes(n) : n === powerball;
      const ballClass = idx === 5 ? 'powerball' : '';
      return `<span class="${isMatch ? 'match' : ''} ${ballClass}">${n}</span>`;
    }).join(", ");
    div.innerHTML = `<strong>Line ${i + 1}:</strong> ${formatted} — ${regularMatches}/5 ${powerMatch ? "+ PB✓" : "+ PB✗"} ${isWinner ? "<span class='winner'>🎉 Winner!</span>" : ""}`;
    ticketContainer.appendChild(div);
  });

  resultsDiv.appendChild(ticketContainer);
}



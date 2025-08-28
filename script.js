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

function checkTickets() {
  const { nums: winning, powerball } = getWinningNumbers();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const scoredTickets = tickets.map((ticket, index) => {
    const regularMatches = ticket.slice(0, 5).filter(n => winning.includes(n)).length;
    const powerMatch = ticket[5] === powerball;
    return { ticket, regularMatches, powerMatch, index };
  });

  scoredTickets.sort((a, b) => {
    if (b.regularMatches !== a.regularMatches) return b.regularMatches - a.regularMatches;
    return b.powerMatch - a.powerMatch;
  });

  scoredTickets.forEach(({ ticket, regularMatches, powerMatch }, i) => {
    const div = document.createElement("div");
    div.className = "ticket";
    const formatted = ticket.map((n, idx) => {
      const isMatch = idx < 5 ? winning.includes(n) : n === powerball;
      const ballClass = idx === 5 ? 'powerball' : '';
      return `<span class="${isMatch ? 'match' : ''} ${ballClass}">${n}</span>`;
    }).join(", ");
    div.innerHTML = `<strong>Line ${i + 1}:</strong> ${formatted} — ${regularMatches}/5 ${powerMatch ? "+ PB✓" : "+ PB✗"}`;
    resultsDiv.appendChild(div);
  });
}

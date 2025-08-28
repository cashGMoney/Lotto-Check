// script.js
const tickets = [
  [5, 12, 23, 34, 45, 49],
  [1, 2, 3, 4, 5, 6],
  // Add up to 30 lines here
];

function checkTickets() {
  const input = document.getElementById("winningNumbers").value;
  const winning = input.split(",").map(n => parseInt(n.trim()));
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const scoredTickets = tickets.map((ticket, index) => {
    const matchCount = ticket.filter(n => winning.includes(n)).length;
    return { ticket, matchCount, index };
  });

  scoredTickets.sort((a, b) => b.matchCount - a.matchCount);

  scoredTickets.forEach(({ ticket, matchCount }) => {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerHTML = ticket.map(n =>
      `<span class="${winning.includes(n) ? 'match' : ''}">${n}</span>`
    ).join(", ") + ` — ${matchCount}/${winning.length}`;
    resultsDiv.appendChild(div);
  });
}

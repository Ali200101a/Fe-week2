const loginBtn = document.querySelector('#login-btn');
const dialog = document.querySelector('#login-dialog');
const closeBtn = document.querySelector('#close-dialog');
const loginForm = document.querySelector('#login-form');

const cardsContainer = document.querySelector('#cards-container');

loginBtn?.addEventListener('click', () => dialog?.showModal());
closeBtn?.addEventListener('click', () => dialog?.close());

loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  dialog?.close();
});

const entries = [
  { date: '2024-01-12', mood: 'Happy', weight: 78.5, sleep: 7.0, notes: 'Gym day' },
  { date: '2024-01-13', mood: 'Tired', weight: 78.2, sleep: 5.5, notes: 'Long day' },
  { date: '2024-01-14', mood: 'Satisfied', weight: 78.0, sleep: 8.0, notes: 'Good sleep' },
];

function renderCards(list) {
  if (!cardsContainer) return;

  cardsContainer.innerHTML = list
    .map(
      (e) => `
      <article class="entry-card">
        <div class="entry-date">${e.date}</div>
        <div><strong>Mood:</strong> ${e.mood}</div>
        <div><strong>Weight:</strong> ${e.weight} kg</div>
        <div><strong>Sleep:</strong> ${e.sleep} h</div>
        <div class="entry-notes">${e.notes}</div>
      </article>
    `
    )
    .join('');
}

renderCards(entries);
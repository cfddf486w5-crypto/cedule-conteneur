const form = document.getElementById('schedule-form');
const historyElement = document.getElementById('history');
const template = document.getElementById('history-item-template');

const storageKey = 'container-schedule-history';
let entries = JSON.parse(localStorage.getItem(storageKey) || '[]');

function saveEntries() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function formatEntry(entry) {
  return `Conteneur ${entry.containerNumber} — ${entry.date} | ${entry.startTime} à ${entry.endTime} — ${entry.notes || 'Sans notes'} — e-mail: ${entry.email}`;
}

function renderHistory() {
  historyElement.innerHTML = '';

  if (entries.length === 0) {
    historyElement.innerHTML = '<li>Aucune entrée pour le moment.</li>';
    return;
  }

  entries.forEach((entry, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('.content').textContent = formatEntry(entry);

    node.querySelector('.delete').addEventListener('click', () => {
      entries.splice(index, 1);
      saveEntries();
      renderHistory();
    });

    node.querySelector('.edit').addEventListener('click', () => {
      document.getElementById('date').value = entry.date;
      document.getElementById('startTime').value = entry.startTime;
      document.getElementById('endTime').value = entry.endTime;
      document.getElementById('containerNumber').value = entry.containerNumber;
      document.getElementById('notes').value = entry.notes;
      document.getElementById('email').value = entry.email;

      entries.splice(index, 1);
      saveEntries();
      renderHistory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    node.querySelector('.email').addEventListener('click', () => {
      const subject = encodeURIComponent(`Mise à jour cédule conteneur ${entry.containerNumber}`);
      const body = encodeURIComponent(
        `Bonjour,%0D%0A%0D%0A` +
          `Voici la cédule mise à jour :%0D%0A` +
          `Date: ${entry.date}%0D%0A` +
          `Heure: ${entry.startTime} à ${entry.endTime}%0D%0A` +
          `Conteneur: ${entry.containerNumber}%0D%0A` +
          `Notes: ${entry.notes || 'Aucune'}%0D%0A%0D%0AMerci.`
      );
      window.location.href = `mailto:${entry.email}?subject=${subject}&body=${body}`;
    });

    historyElement.appendChild(node);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = document.getElementById('date').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const containerNumber = document.getElementById('containerNumber').value.trim().toUpperCase();
  const notes = document.getElementById('notes').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!date || !startTime || !endTime || !containerNumber || !email) {
    alert('Merci de remplir tous les champs obligatoires.');
    return;
  }

  if (startTime >= endTime) {
    alert('L’heure de début doit être avant l’heure de fin.');
    return;
  }

  entries.unshift({ date, startTime, endTime, containerNumber, notes, email });
  saveEntries();
  renderHistory();
  form.reset();
});

renderHistory();

const form = document.getElementById('schedule-form');
const weekLabel = document.getElementById('week-label');
const weekRange = document.getElementById('week-range');
const summaryElement = document.getElementById('warehouse-summary');
const weekViewElement = document.getElementById('week-view');
const proofContainerSelect = document.getElementById('proof-container');
const proofForm = document.getElementById('proof-form');
const proofList = document.getElementById('proof-list');
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.bottom-nav button');
const alertBox = document.getElementById('alert-box');
const settingsForm = document.getElementById('settings-form');
const settingsShortcut = document.getElementById('settings-shortcut');

const storageKey = 'container-schedule-history-v4';
const proofKey = 'container-schedule-proof-v4';
const settingsKey = 'container-schedule-settings-v1';
let entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
let proofs = JSON.parse(localStorage.getItem(proofKey) || '[]');
let settings = JSON.parse(localStorage.getItem(settingsKey) || '{"alertIntervalMinutes":60}');
let currentWeekStart = getStartOfWeek(new Date());
let alertTimer = null;

const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const warehouses = ['Langelier', 'Laval', '5995'];

function saveAll() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
  localStorage.setItem(proofKey, JSON.stringify(proofs));
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}

function switchPage(pageName) {
  pages.forEach((page) => page.classList.toggle('active', page.dataset.page === pageName));
  navButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.target === pageName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getWeekWindow(referenceDate) {
  const start = getStartOfWeek(referenceDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function getWeekDates(referenceDate) {
  const start = getStartOfWeek(referenceDate);
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return formatDate(date);
  });
}

function isDateInCurrentWeek(dateStr) {
  const { start, end } = getWeekWindow(currentWeekStart);
  const d = new Date(`${dateStr}T00:00:00`);
  return d >= start && d <= end;
}

function isArchived(entry) {
  return Boolean(entry.archivedAt);
}

function renderWeekHeader() {
  const { start, end } = getWeekWindow(currentWeekStart);
  weekLabel.textContent = `Semaine du ${formatDate(start)}`;
  weekRange.textContent = `${formatDate(start)} au ${formatDate(end)}`;
}

function updateTimeOptions() {
  const warehouse = document.getElementById('warehouse').value;
  const date = document.getElementById('date').value;
  const select = document.getElementById('startTime');
  const slotMessage = document.getElementById('slot-message');
  const submitButton = form.querySelector('button[type="submit"]');
  const dayEntries = entries.filter((entry) => entry.warehouse === warehouse && entry.date === date);

  let options = [];
  if (warehouse === 'Langelier') {
    const used = dayEntries.map((entry) => entry.startTime);
    options = ['08:00', '12:00'].filter((slot) => !used.includes(slot));
    slotMessage.textContent = options.length
      ? `Langelier: créneaux disponibles ${options.join(' / ')}.`
      : 'Date complète pour Langelier (08:00 et 12:00 déjà cédulés).';
    submitButton.disabled = options.length === 0;
  } else {
    options = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
    slotMessage.textContent = '';
    submitButton.disabled = false;
  }

  select.innerHTML = '';
  if (!options.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Aucune heure disponible';
    select.appendChild(option);
    return;
  }

  options.forEach((time) => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    select.appendChild(option);
  });
}

function renderSummary() {
  const weekDates = getWeekDates(currentWeekStart);
  summaryElement.innerHTML = '';

  warehouses.forEach((name) => {
    const counts = weekDates.map((date) => entries.filter((entry) => entry.warehouse === name && entry.date === date).length);
    const max = Math.max(1, ...counts);
    const card = document.createElement('article');
    card.className = 'summary-item';

    const bars = counts
      .map((count, index) => {
        const height = Math.max(8, Math.round((count / max) * 120));
        return `<div class="bar-wrap"><div class="bar" style="height:${height}px"></div><small>${count}</small><span class="day-label">${dayNames[index].slice(0, 3)}</span></div>`;
      })
      .join('');

    card.innerHTML = `<h3>${name}</h3><p>${counts.reduce((a, b) => a + b, 0)} conteneur(s) cette semaine</p><div class="bars">${bars}</div>`;
    summaryElement.appendChild(card);
  });
}

function renderWeekView() {
  weekViewElement.innerHTML = '';
  const weekDates = getWeekDates(currentWeekStart);

  weekDates.forEach((date, index) => {
    const dayEntries = entries
      .filter((entry) => entry.date === date)
      .sort((a, b) => `${a.startTime}${a.containerNumber}`.localeCompare(`${b.startTime}${b.containerNumber}`));

    const col = document.createElement('div');
    col.className = 'day-column';
    col.innerHTML = `<h3>${dayNames[index]}<br /><small>${date}</small></h3>`;

    if (!dayEntries.length) {
      col.innerHTML += '<p class="hint">Aucun conteneur.</p>';
    }

    dayEntries.forEach((entry) => {
      const box = document.createElement('div');
      box.className = `container-card ${isArchived(entry) ? 'archived' : ''}`;
      box.innerHTML = `<strong>${entry.containerNumber}</strong><br />${entry.warehouse} | ${entry.startTime} | LFD ${entry.lfd}`;

      if (isArchived(entry)) {
        box.innerHTML += `<div class="readonly-label">Archivé (lecture seule)</div>`;
      } else {
        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit';
        editBtn.textContent = 'Modifier';
        editBtn.addEventListener('click', () => loadEntryToForm(entry.id));

        const importBtn = document.createElement('button');
        importBtn.className = 'import-action';
        importBtn.textContent = entry.imported ? 'Importé ✓' : 'Marquer importé';
        importBtn.addEventListener('click', () => {
          entry.imported = !entry.imported;
          saveAll();
          renderAll();
        });

        const archiveBtn = document.createElement('button');
        archiveBtn.className = 'delete';
        archiveBtn.textContent = 'Archiver';
        archiveBtn.addEventListener('click', () => {
          proofContainerSelect.value = entry.id;
          switchPage('proof');
        });

        actions.append(editBtn, importBtn, archiveBtn);
        box.appendChild(actions);
      }

      col.appendChild(box);
    });

    weekViewElement.appendChild(col);
  });
}

function loadEntryToForm(entryId) {
  const entry = entries.find((candidate) => candidate.id === entryId);
  if (!entry || isArchived(entry)) return;
  document.getElementById('warehouse').value = entry.warehouse;
  document.getElementById('date').value = entry.date;
  updateTimeOptions();
  document.getElementById('startTime').value = entry.startTime;
  document.getElementById('containerNumber').value = entry.containerNumber;
  document.getElementById('lfd').value = entry.lfd;
  entries = entries.filter((candidate) => candidate.id !== entry.id);
  saveAll();
  renderAll();
  switchPage('schedule');
}

function renderProofSelector() {
  proofContainerSelect.innerHTML = '';
  const activeEntries = entries.filter((entry) => !isArchived(entry));

  if (!activeEntries.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Aucun conteneur à archiver';
    proofContainerSelect.appendChild(option);
    return;
  }

  activeEntries.forEach((entry) => {
    const option = document.createElement('option');
    option.value = entry.id;
    option.textContent = `${entry.containerNumber} (${entry.date} - ${entry.warehouse})`;
    proofContainerSelect.appendChild(option);
  });
}

function renderProofList() {
  proofList.innerHTML = '';
  if (!proofs.length) {
    proofList.innerHTML = '<li>Aucune preuve de réception.</li>';
    return;
  }

  proofs.forEach((proof) => {
    const li = document.createElement('li');
    li.className = 'proof-item';
    li.innerHTML = `<strong>${proof.containerNumber}</strong> — ${proof.receivedDate} ${proof.receivedTime}<br /><img src="${proof.photoData}" alt="Preuve ${proof.containerNumber}" />`;
    proofList.appendChild(li);
  });
}

function validateConstraints(newEntry) {
  const dayEntries = entries.filter((entry) => entry.warehouse === newEntry.warehouse && entry.date === newEntry.date);
  if (newEntry.warehouse === 'Langelier') {
    if (!['08:00', '12:00'].includes(newEntry.startTime)) return 'Langelier accepte uniquement 08:00 ou 12:00.';
    if (dayEntries.length >= 2) return 'Date complète pour Langelier.';
    if (dayEntries.some((entry) => entry.startTime === newEntry.startTime)) return 'Ce créneau est déjà pris à Langelier.';
  }
  return null;
}

function getOverdueEntries() {
  const today = formatDate(new Date());
  return entries.filter((entry) => entry.date < today && !isArchived(entry));
}

function notifyOverdue() {
  const overdue = getOverdueEntries();
  if (!overdue.length) {
    alertBox.classList.add('hidden');
    alertBox.textContent = '';
    return;
  }

  const list = overdue.map((entry) => `${entry.containerNumber} (${entry.date})`).join(', ');
  alertBox.classList.remove('hidden');
  alertBox.textContent = `ALERTE: conteneurs non archivés après date prévue: ${list}.`;

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Conteneurs non archivés', { body: list });
  }
}

function restartAlertLoop() {
  if (alertTimer) clearInterval(alertTimer);
  const minutes = Math.max(1, Number(settings.alertIntervalMinutes) || 60);
  alertTimer = setInterval(notifyOverdue, minutes * 60 * 1000);
  notifyOverdue();
}

function renderAll() {
  renderWeekHeader();
  renderSummary();
  renderWeekView();
  renderProofSelector();
  renderProofList();
  updateTimeOptions();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const warehouse = document.getElementById('warehouse').value;
  const date = document.getElementById('date').value;
  const startTime = document.getElementById('startTime').value;
  const containerNumber = document.getElementById('containerNumber').value.trim().toUpperCase();
  const lfd = document.getElementById('lfd').value;

  if (!warehouse || !date || !startTime || !containerNumber || !lfd) {
    alert('Merci de remplir tous les champs obligatoires.');
    return;
  }

  if (!/^[A-Z]{4}\d{7}$/.test(containerNumber)) {
    alert('Numéro invalide. Format attendu: MSMU1231234.');
    return;
  }

  const newEntry = { id: crypto.randomUUID(), warehouse, date, startTime, containerNumber, lfd, imported: false, archivedAt: null };
  const validationError = validateConstraints(newEntry);
  if (validationError) return alert(validationError);

  entries.push(newEntry);
  entries.sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  saveAll();
  form.reset();
  renderAll();
  switchPage('week');
});

proofForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const containerId = proofContainerSelect.value;
  const photoFile = document.getElementById('proof-photo').files[0];
  const receivedTime = document.getElementById('proof-time').value;

  if (!containerId || !photoFile || !receivedTime) return alert('Veuillez remplir tous les champs de preuve.');

  const entry = entries.find((candidate) => candidate.id === containerId);
  if (!entry) return alert('Le conteneur sélectionné est introuvable.');

  const reader = new FileReader();
  reader.onload = () => {
    entry.archivedAt = `${formatDate(new Date())} ${receivedTime}`;
    proofs.unshift({ id: crypto.randomUUID(), containerId, containerNumber: entry.containerNumber, receivedDate: formatDate(new Date()), receivedTime, photoData: reader.result });
    saveAll();
    renderAll();
    proofForm.reset();
  };
  reader.readAsDataURL(photoFile);
});

settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  settings.alertIntervalMinutes = Number(document.getElementById('alert-interval').value) || 60;
  saveAll();
  restartAlertLoop();
  alert('Paramètres enregistrés.');
});

settingsShortcut.addEventListener('click', () => switchPage('settings'));

document.getElementById('warehouse').addEventListener('change', updateTimeOptions);
document.getElementById('date').addEventListener('change', updateTimeOptions);

document.getElementById('prev-week').addEventListener('click', () => {
  const start = new Date(currentWeekStart);
  start.setDate(start.getDate() - 7);
  currentWeekStart = start;
  renderAll();
});

document.getElementById('next-week').addEventListener('click', () => {
  const start = new Date(currentWeekStart);
  start.setDate(start.getDate() + 7);
  currentWeekStart = start;
  renderAll();
});

navButtons.forEach((button) => {
  button.addEventListener('click', () => switchPage(button.dataset.target));
});

document.getElementById('alert-interval').value = settings.alertIntervalMinutes;
if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
renderAll();
restartAlertLoop();
switchPage('dashboard');

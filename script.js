const form = document.getElementById('schedule-form');
const historyElement = document.getElementById('history');
const template = document.getElementById('history-item-template');
const weekLabel = document.getElementById('week-label');
const weekRange = document.getElementById('week-range');
const summaryElement = document.getElementById('warehouse-summary');
const pendingListElement = document.getElementById('pending-list');
const proofContainerSelect = document.getElementById('proof-container');
const proofForm = document.getElementById('proof-form');
const proofList = document.getElementById('proof-list');
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.bottom-nav button');
const asnMessage = document.getElementById('asn-message');
const asnLink = document.getElementById('asn-link');

const storageKey = 'container-schedule-history-v3';
const pendingKey = 'container-schedule-pending-v3';
const proofKey = 'container-schedule-proof-v3';
let entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
let pendingContainers = JSON.parse(localStorage.getItem(pendingKey) || '[]');
let proofs = JSON.parse(localStorage.getItem(proofKey) || '[]');
let currentWeekStart = getStartOfWeek(new Date());

const warehouseRules = {
  Langelier: { maxPerSlot: 1, maxPerDay: 2, allowedSlots: ['08:00', '12:00'], allowedDoors: ['2'] },
  Laval: { maxPerSlot: 3, slotIntervalMinutes: 30, allowedDoors: ['1', '2', '3', '4', '5'] },
  '5995': { maxPerSlot: 3, slotIntervalMinutes: 30, allowedDoors: ['1', '2', '3', '4', '5'] },
};

function saveAll() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
  localStorage.setItem(pendingKey, JSON.stringify(pendingContainers));
  localStorage.setItem(proofKey, JSON.stringify(proofs));
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

function isDateInCurrentWeek(dateStr) {
  const { start, end } = getWeekWindow(currentWeekStart);
  const d = new Date(`${dateStr}T00:00:00`);
  return d >= start && d <= end;
}

function getEntryDurationHours(entry) {
  if (entry.warehouse === 'Langelier') return 4;
  return entry.containerType === '40FT' ? 4 : 2;
}

function getStatus(entry) {
  if (!entry.lfd) return 'ok';
  return entry.date > entry.lfd ? 'late' : 'ok';
}

function buildEntryContent(entry) {
  const statusLabel = getStatus(entry) === 'late' ? 'RETARD (LFD dépassé)' : 'À temps';
  const qtyText = entry.quantity ? ` | Qté: ${entry.quantity}` : '';
  const itemsText = entry.items ? ` | Items: ${entry.items}` : '';
  return `${entry.warehouse} — ${entry.containerNumber} (${entry.containerType}) | ${entry.date} ${entry.startTime} (${getEntryDurationHours(entry)}h) | LFD: ${entry.lfd} | Porte: ${entry.door}${itemsText}${qtyText} | ${statusLabel} | ${entry.notes || 'Sans notes'}`;
}

function renderWeekHeader() {
  const { start, end } = getWeekWindow(currentWeekStart);
  weekLabel.textContent = `Semaine du ${formatDate(start)}`;
  weekRange.textContent = `${formatDate(start)} au ${formatDate(end)}`;
}

function renderSummary() {
  const weekEntries = entries.filter((entry) => isDateInCurrentWeek(entry.date));
  const warehouses = ['Langelier', 'Laval', '5995'];
  summaryElement.innerHTML = '';
  warehouses.forEach((name) => {
    const count = weekEntries.filter((entry) => entry.warehouse === name).length;
    const lateCount = weekEntries.filter((entry) => entry.warehouse === name && getStatus(entry) === 'late').length;
    const card = document.createElement('article');
    card.className = 'summary-item';
    card.innerHTML = `<h3>${name}</h3><p>${count} conteneur(s) cédulé(s)</p><p>${lateCount} en retard LFD</p>`;
    summaryElement.appendChild(card);
  });
}

function openAsnLink(item) {
  asnMessage.textContent = `ASN ${item.asn || '-'} sélectionné.`;
  if (!item.itemLink) {
    asnLink.classList.add('hidden');
    asnLink.removeAttribute('href');
    asnMessage.textContent += ' Aucun lien items fourni.';
    return;
  }

  asnLink.classList.remove('hidden');
  asnLink.href = item.itemLink;
  asnLink.textContent = `Ouvrir la liste des items pour ASN ${item.asn || '-'}`;
  switchPage('items');
}

function renderPendingList() {
  pendingListElement.innerHTML = '';
  if (!pendingContainers.length) {
    pendingListElement.innerHTML = '<li>Aucun conteneur en attente.</li>';
    return;
  }

  pendingContainers.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `<div class="content">${item.containerNumber} | LFD: ${item.lfd || '-'} </div>`;

    const actions = document.createElement('div');
    actions.className = 'item-actions';

    const asnButton = document.createElement('button');
    asnButton.className = 'email';
    asnButton.textContent = `${item.asn || 'ASN'} (lien)`;
    asnButton.addEventListener('click', () => openAsnLink(item));

    actions.appendChild(asnButton);
    li.appendChild(actions);
    pendingListElement.appendChild(li);
  });
}

function renderProofSelector() {
  proofContainerSelect.innerHTML = '';
  if (!entries.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Aucun conteneur cédulé';
    proofContainerSelect.appendChild(option);
    return;
  }

  entries.forEach((entry) => {
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
    li.innerHTML = `<strong>${proof.containerNumber}</strong> — ${proof.receivedDate} ${proof.receivedTime}<br />Items: ${proof.items} | Qté: ${proof.quantity}<br /><img src="${proof.photoData}" alt="Preuve ${proof.containerNumber}" />`;
    proofList.appendChild(li);
  });
}

function renderHistory() {
  historyElement.innerHTML = '';
  const weekEntries = entries.filter((entry) => isDateInCurrentWeek(entry.date));
  if (!weekEntries.length) {
    historyElement.innerHTML = '<li>Aucune cédule pour cette semaine.</li>';
    renderSummary();
    renderProofSelector();
    return;
  }

  weekEntries.forEach((entry) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('.content').textContent = buildEntryContent(entry);
    if (getStatus(entry) === 'late') node.classList.add('late');

    node.querySelector('.delete').addEventListener('click', () => {
      entries = entries.filter((candidate) => candidate.id !== entry.id);
      saveAll();
      renderHistory();
      renderProofSelector();
    });

    node.querySelector('.edit').addEventListener('click', () => {
      document.getElementById('warehouse').value = entry.warehouse;
      document.getElementById('date').value = entry.date;
      document.getElementById('startTime').value = entry.startTime;
      document.getElementById('containerNumber').value = entry.containerNumber;
      document.getElementById('containerType').value = entry.containerType;
      document.getElementById('lfd').value = entry.lfd;
      document.getElementById('door').value = entry.door;
      document.getElementById('email').value = entry.email;
      document.getElementById('items').value = entry.items || '';
      document.getElementById('quantity').value = entry.quantity || '';
      document.getElementById('notes').value = entry.notes;
      entries = entries.filter((candidate) => candidate.id !== entry.id);
      saveAll();
      renderHistory();
      switchPage('schedule');
    });

    node.querySelector('.email').addEventListener('click', () => {
      const subject = encodeURIComponent(`Mise à jour cédule conteneur ${entry.containerNumber}`);
      const body = encodeURIComponent(`Bonjour,\n\nCédule conteneur:\nEntrepôt: ${entry.warehouse}\nDate: ${entry.date}\nHeure: ${entry.startTime}\nDurée prévue: ${getEntryDurationHours(entry)}h\nConteneur: ${entry.containerNumber}\nLFD: ${entry.lfd}\nPorte/reculage: ${entry.door}\nItems: ${entry.items || '-'}\nQté: ${entry.quantity || '-'}\nNotes: ${entry.notes || 'Aucune'}\n\nMerci.`);
      window.location.href = `mailto:${entry.email}?subject=${subject}&body=${body}`;
    });

    historyElement.appendChild(node);
  });

  renderSummary();
  renderProofSelector();
}

function validateConstraints(newEntry) {
  const dayEntries = entries.filter((entry) => entry.warehouse === newEntry.warehouse && entry.date === newEntry.date);
  const sameTimeEntries = dayEntries.filter((entry) => entry.startTime === newEntry.startTime);
  const rules = warehouseRules[newEntry.warehouse];

  if (newEntry.warehouse === 'Langelier') {
    if (!rules.allowedSlots.includes(newEntry.startTime)) return 'Langelier accepte uniquement 08:00 ou 12:00.';
    if (dayEntries.length >= rules.maxPerDay) return 'Langelier est limité à 2 conteneurs par jour.';
    if (sameTimeEntries.length >= rules.maxPerSlot) return 'Le créneau sélectionné est déjà pris pour Langelier.';
    if (!rules.allowedDoors.some((door) => newEntry.door.includes(door))) return 'Langelier utilise uniquement la porte dock 2.';
  }

  if (newEntry.warehouse === 'Laval' || newEntry.warehouse === '5995') {
    const [hour, minute] = newEntry.startTime.split(':').map(Number);
    if (minute % rules.slotIntervalMinutes !== 0) return `${newEntry.warehouse}: la cédule doit être sur des intervalles de 30 minutes.`;
    if (sameTimeEntries.length >= rules.maxPerSlot) return `${newEntry.warehouse}: maximum 3 conteneurs simultanément.`;
    if (!rules.allowedDoors.some((door) => newEntry.door.includes(door))) return `${newEntry.warehouse}: les portes valides sont 1 à 5.`;
    if (hour < 0 || hour > 23) return `${newEntry.warehouse}: heure invalide.`;
  }

  return null;
}

function parseEmailInput(rawText) {
  return rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const chunks = line.split(';').map((part) => part.trim());
      if (chunks.length >= 4) {
        const [asn, containerNumber, lfd, itemLink] = chunks;
        return { asn, containerNumber: (containerNumber || '').toUpperCase(), lfd: lfd || '', itemLink: itemLink || '' };
      }
      const [containerNumber, lfd] = chunks;
      return { asn: '', containerNumber: (containerNumber || '').toUpperCase(), lfd: lfd || '', itemLink: '' };
    })
    .filter((item) => item.containerNumber);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const warehouse = document.getElementById('warehouse').value;
  const date = document.getElementById('date').value;
  const startTime = document.getElementById('startTime').value;
  const containerNumber = document.getElementById('containerNumber').value.trim().toUpperCase();
  const containerType = document.getElementById('containerType').value;
  const lfd = document.getElementById('lfd').value;
  const door = document.getElementById('door').value.trim();
  const email = document.getElementById('email').value.trim();
  const items = document.getElementById('items').value.trim();
  const quantity = document.getElementById('quantity').value;
  const notes = document.getElementById('notes').value.trim();

  if (!warehouse || !date || !startTime || !containerNumber || !lfd || !door || !email) {
    alert('Merci de remplir tous les champs obligatoires.');
    return;
  }

  const newEntry = { id: crypto.randomUUID(), warehouse, date, startTime, containerNumber, containerType, lfd, door, email, items, quantity, notes };
  const validationError = validateConstraints(newEntry);
  if (validationError) return alert(validationError);

  entries.push(newEntry);
  entries.sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  saveAll();
  renderWeekHeader();
  renderHistory();
  form.reset();
  switchPage('history');
});

document.getElementById('import-email').addEventListener('click', () => {
  const raw = document.getElementById('email-import').value;
  const parsed = parseEmailInput(raw);
  if (!parsed.length) return alert('Aucune ligne valide trouvée.');

  pendingContainers.unshift(...parsed);
  saveAll();
  renderPendingList();
  document.getElementById('email-import').value = '';
});

proofForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const containerId = proofContainerSelect.value;
  const photoFile = document.getElementById('proof-photo').files[0];
  const receivedTime = document.getElementById('proof-time').value;
  const items = document.getElementById('proof-items').value.trim();
  const quantity = document.getElementById('proof-qty').value;

  if (!containerId || !photoFile || !receivedTime || !items || !quantity) return alert('Veuillez remplir tous les champs de preuve.');

  const entry = entries.find((candidate) => candidate.id === containerId);
  if (!entry) return alert('Le conteneur sélectionné est introuvable.');

  const reader = new FileReader();
  reader.onload = () => {
    proofs.unshift({ id: crypto.randomUUID(), containerId, containerNumber: entry.containerNumber, receivedDate: formatDate(new Date()), receivedTime, items, quantity, photoData: reader.result });
    saveAll();
    renderProofList();
    proofForm.reset();
  };
  reader.readAsDataURL(photoFile);
});

document.getElementById('prev-week').addEventListener('click', () => {
  const start = new Date(currentWeekStart);
  start.setDate(start.getDate() - 7);
  currentWeekStart = start;
  renderWeekHeader();
  renderHistory();
});

document.getElementById('next-week').addEventListener('click', () => {
  const start = new Date(currentWeekStart);
  start.setDate(start.getDate() + 7);
  currentWeekStart = start;
  renderWeekHeader();
  renderHistory();
});

navButtons.forEach((button) => {
  button.addEventListener('click', () => switchPage(button.dataset.target));
});

renderWeekHeader();
renderPendingList();
renderProofList();
renderHistory();
switchPage('dashboard');

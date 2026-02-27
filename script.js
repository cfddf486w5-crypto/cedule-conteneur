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
const toast = document.getElementById('toast');
const settingsForm = document.getElementById('settings-form');
const appFooter = document.getElementById('app-footer');
const footerYear = document.getElementById('footer-year');
const footerYearShort = document.getElementById('footer-year-short');

const storageKey = 'container-schedule-history-v5';
const proofKey = 'container-schedule-proof-v5';
const settingsKey = 'container-schedule-settings-v2';
const uiKey = 'container-ui-v2';
const draftKey = 'container-draft-v1';
const safeParse = (value, fallback) => { try { return JSON.parse(value); } catch { return fallback; } };
const isValidDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());
const getSafeDate = (value, fallback = new Date()) => {
  if (value === null || value === undefined || value === '') return fallback;
  const parsed = new Date(value);
  return isValidDate(parsed) ? parsed : fallback;
};

const extraSettingLabels = [
  'Activer rappel à 24h',
  'Activer rappel à 48h',
  'Afficher le numéro de conteneur en gras',
  'Afficher les zones avec couleurs distinctes',
  'Confirmer avant archivage',
  'Confirmer avant suppression',
  'Notifier pour les imports JSON',
  'Masquer les entrées archivées par défaut',
  'Trier les retards en premier',
  'Activer son d’alerte',
  'Afficher l’heure serveur',
  'Utiliser format de date court',
  'Utiliser format de date long',
  'Montrer les LFD en rouge à J-1',
  'Montrer badge importé',
  'Activer aperçu avant impression',
  'Activer export automatique quotidien',
  'Afficher compteur total sur la nav',
  'Afficher compteur retard sur la nav',
  'Désactiver notifications toast',
  'Agrandir cartes de conteneurs',
  'Réduire marges du dashboard',
  'Activer tri intelligent des créneaux',
  'Afficher semaine ISO',
  'Autoriser doublon de numéro',
  'Exiger note à l’archivage',
  'Activer verrouillage après archivage',
  'Montrer historique des modifications',
  'Activer mode lecture seule le weekend',
  'Activer bordure forte pour retards',
  'Afficher photo miniature dans la semaine',
  'Activer synchronisation locale fréquente',
  'Nettoyer automatiquement brouillon à minuit',
  'Activer contraste renforcé',
  'Afficher résumé par jour dans dashboard',
  'Rendre champs obligatoires en MAJUSCULES',
  'Afficher message de bienvenue',
  'Activer rappel de sauvegarde',
  'Activer validation stricte du conteneur',
  'Forcer ouverture sur Dashboard',
  'Activer raccourcis clavier avancés',
  'Afficher infobulles sur boutons',
  'Garder filtres de recherche persistants',
  'Masquer export CSV',
  'Afficher temps depuis dernière MAJ',
  'Activer rappel photo manquante',
  'Activer suggestion d’heure automatique',
  'Afficher version de l’application',
  'Activer mode discret (sans son)',
  'Envoyer copie locale des preuves',
  'Activer détection automatique des doublons inter-zones',
  'Afficher l’occupation par demi-journée',
  'Colorer automatiquement les jours complets',
  'Masquer les boutons de suppression rapide',
  'Autoriser édition après archivage (admin)',
  'Afficher marqueur de priorité élevée',
  'Activer mode supervision',
  'Afficher ID interne des entrées',
  'Préremplir la zone la plus utilisée',
  'Préremplir l’heure la plus utilisée',
  'Limiter le nombre de cédules par jour',
  'Alerter si LFD à moins de 72h',
  'Alerter si preuve sans note',
  'Exporter automatiquement les preuves hebdomadaires',
  'Afficher icône archive sur cartes archivées',
  'Afficher icône retard sur cartes en retard',
  'Activer mode grand écran dashboard',
  'Activer compression image des preuves',
  'Limiter taille photo à 2MB',
  'Masquer bouton dupliquer',
  'Afficher estimation de charge quotidienne',
  'Afficher capacité restante par zone',
  'Activer verrouillage des weekends',
  'Activer confirmation avant import JSON',
  'Activer confirmation avant vider les données',
  'Masquer conteneurs importés dans la semaine',
  'Afficher uniquement conteneurs actifs par défaut',
  'Appliquer tri par LFD par défaut',
  'Activer focus automatique sur recherche',
  'Conserver dernière page visitée',
  'Réinitialiser filtres au changement de semaine',
  'Appliquer thème sombre par défaut',
  'Masquer KPIs importés',
  'Afficher KPIs retards critiques',
  'Afficher date de création sur carte',
  'Afficher date d’archivage sur carte',
  'Autoriser archivage sans photo (exception)',
  'Afficher bouton impression rapide sur dashboard',
  'Afficher bouton export preuves sur dashboard',
  'Activer barre de progression hebdomadaire',
  'Activer rappel des preuves en attente',
  'Activer résumé vocal des alertes',
  'Activer vibration sur mobile (si supportée)',
  'Afficher alertes dans le footer',
  'Afficher total des archives du mois',
  'Afficher total des imports du mois',
  'Afficher niveau de risque par conteneur',
  'Activer code couleur par LFD',
  'Montrer filtre rapide LFD aujourd’hui',
  'Montrer filtre rapide LFD cette semaine',
  'Activer mode productivité (moins d’animations)',
  'Activer highlight du jour courant',
  'Activer check-list avant archivage',
  'Activer double confirmation suppression totale',
  'Activer journal local des exports CSV',
  'Activer journal local des imports JSON',
  'Afficher dernière action utilisateur',
  'Activer auto-scroll vers formulaire après édition',
  'Activer verrouillage des champs archivés',
  'Activer mode lisibilité (police plus grande)',
  'Activer police monospace pour conteneurs',
  'Afficher infobulle des raccourcis clavier',
  'Afficher raccourcis dans la nav',
  'Activer compteur de clics actions',
  'Afficher indicateur sauvegarde locale',
  'Activer sauvegarde locale toutes les 30 sec',
  'Activer backup JSON auto hebdo',
  'Afficher statut connexion navigateur',
  'Activer debug UI (dev)',
  'Afficher temps de rendu des vues',
  'Afficher numéro de semaine dans en-tête',
  'Afficher date du jour dans en-tête',
  'Activer tri par zone puis heure',
  'Activer tri par priorité puis LFD',
  'Activer regroupement des archivés en bas',
  'Masquer preuves anciennes de plus de 90 jours',
  'Activer nettoyage auto des preuves (365j)',
  'Activer nettoyage auto des cédules archivées (365j)',
  'Afficher tag “nouveau” 24h après création',
  'Activer suggestion de note automatique',
  'Activer normalisation automatique des numéros',
  'Afficher validateur visuel du numéro',
  'Activer blocage des caractères invalides',
  'Activer check anti-collision de créneau',
  'Afficher histogramme des cédules par zone',
  'Afficher moyenne quotidienne de cédules',
  'Afficher tendance hebdomadaire (+/-)',
  'Afficher export “semaine courante” rapide',
  'Afficher export “retards uniquement” rapide',
  'Activer mode audit (lecture seule globale)',
  'Activer rappel de mise à jour de la page',
  'Afficher horodatage précis des notifications',
  'Activer anti double-clic sur actions',
  'Activer désactivation auto des boutons après clic',
  'Afficher état des permissions notifications',
  'Afficher rappel d’autoriser notifications',
];

function normalizeExtraOptions(raw) {
  const normalized = {};
  extraSettingLabels.forEach((_, index) => {
    normalized[`option-${index + 1}`] = Boolean(raw && raw[`option-${index + 1}`]);
  });
  return normalized;
}

function renderExtraSettingOptions() {
  const optionsRoot = document.getElementById('extra-settings-options');
  if (!optionsRoot) return;
  const legendCount = document.getElementById('extra-settings-count');
  if (legendCount) legendCount.textContent = String(extraSettingLabels.length);
  optionsRoot.innerHTML = extraSettingLabels.map((label, index) => {
    const optionId = `setting-option-${index + 1}`;
    const optionKey = `option-${index + 1}`;
    const checked = settings.extraOptions?.[optionKey] ? 'checked' : '';
    return `<label for="${optionId}"><input id="${optionId}" data-option-key="${optionKey}" type="checkbox" ${checked} /> ${label}</label>`;
  }).join('');
}


let entries = safeParse(localStorage.getItem(storageKey), []);
if (!Array.isArray(entries)) entries = [];

let proofs = safeParse(localStorage.getItem(proofKey), []);
if (!Array.isArray(proofs)) proofs = [];

let settings = {
  alertIntervalMinutes: 60,
  muteAlerts: false,
  compactMode: false,
  reduceMotion: false,
  footerSticky: false,
  footerShort: false,
  extraOptions: {},
  ...safeParse(localStorage.getItem(settingsKey), {}),
};
settings.extraOptions = normalizeExtraOptions(settings.extraOptions);

let ui = {
  page: 'dashboard',
  dark: false,
  weekStart: null,
  ...safeParse(localStorage.getItem(uiKey), {}),
};

let draft = safeParse(localStorage.getItem(draftKey), {});
if (!draft || typeof draft !== 'object') draft = {};

let currentWeekStart = getStartOfWeek(getSafeDate(ui.weekStart));
let alertTimer = null;
let undoDeletedEntry = null;

const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const warehouses = ['Langelier', 'Laval', '5995'];



function saveAll() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
  localStorage.setItem(proofKey, JSON.stringify(proofs));
  localStorage.setItem(settingsKey, JSON.stringify(settings));
  ui.weekStart = formatDate(currentWeekStart);
  localStorage.setItem(uiKey, JSON.stringify(ui));
}


function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 2200);
}

function switchPage(pageName) {
  ui.page = pageName;
  localStorage.setItem(uiKey, JSON.stringify(ui));
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
function formatDate(date) { return date.toISOString().slice(0, 10); }
function nowTime() { return new Date().toTimeString().slice(0, 5); }
function isArchived(entry) { return Boolean(entry.archivedAt); }
function getOverdueEntries() { const today = formatDate(new Date()); return entries.filter((entry) => entry.date < today && !isArchived(entry)); }

function getWeekDates(referenceDate) {
  const start = getStartOfWeek(referenceDate);
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return formatDate(date);
  });
}

function renderWeekHeader() {
  const start = getStartOfWeek(currentWeekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  weekLabel.textContent = `Semaine du ${formatDate(start)}`;
  weekRange.textContent = `${formatDate(start)} au ${formatDate(end)}`;
}

function updateKpis() {
  const weekDates = getWeekDates(currentWeekStart);
  const weekly = entries.filter((e) => weekDates.includes(e.date));
  const archived = weekly.filter(isArchived).length;
  const imported = weekly.filter((e) => e.imported).length;
  const overdue = getOverdueEntries().length;
  const fillRate = weekly.length ? Math.round((archived / weekly.length) * 100) : 0;
  document.getElementById('kpi-grid').innerHTML = [
    ['Total semaine', weekly.length], ['Archivés', archived], ['Importés', imported], ['En retard', overdue], ['Taux archivage', `${fillRate}%`],
  ].map(([label, value]) => `<article class="kpi"><small>${label}</small><h3>${value}</h3></article>`).join('');
  document.getElementById('last-updated').textContent = `Dernière mise à jour: ${new Date().toLocaleString('fr-CA')}`;
}

function updateTimeOptions() {
  const warehouse = document.getElementById('warehouse').value;
  const date = document.getElementById('date').value;
  const select = document.getElementById('startTime');
  const slotMessage = document.getElementById('slot-message');
  const submitButton = form.querySelector('button[type="submit"]');
  const dayEntries = entries.filter((entry) => entry.warehouse === warehouse && entry.date === date);
  let options = warehouse === 'Langelier'
    ? ['08:00', '12:00'].filter((slot) => !dayEntries.map((e) => e.startTime).includes(slot))
    : ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00'];
  slotMessage.textContent = warehouse === 'Langelier' ? (options.length ? `Langelier: ${options.join(' / ')}` : 'Date complète pour Langelier.') : '';
  submitButton.disabled = !options.length;
  select.innerHTML = options.map((time) => `<option value="${time}">${time}</option>`).join('') || '<option value="">Aucune heure disponible</option>';
}

function renderSummary() {
  const weekDates = getWeekDates(currentWeekStart);
  summaryElement.innerHTML = '';
  warehouses.forEach((name) => {
    const counts = weekDates.map((date) => entries.filter((entry) => entry.warehouse === name && entry.date === date).length);
    const max = Math.max(1, ...counts);
    const total = counts.reduce((a, b) => a + b, 0);
    const bars = counts.map((count, i) => `<div class="bar-wrap"><div class="bar" style="height:${Math.max(8, Math.round((count / max) * 120))}px"></div><small>${count}</small><span>${dayNames[i].slice(0, 3)}</span></div>`).join('');
    const card = document.createElement('article');
    card.className = 'summary-item';
    card.innerHTML = `<h3>${name}</h3><p>${total} conteneur(s) | Utilisation ${Math.min(100, total * 10)}%</p><div class="bars">${bars}</div>`;
    summaryElement.appendChild(card);
  });
}

function activeFilters(entry) {
  const search = document.getElementById('search-input').value.trim().toUpperCase();
  if (search && !entry.containerNumber.includes(search)) return false;
  return true;
}


function toggleSearchFilters() {
  const filters = document.getElementById('week-filters');
  const toggle = document.getElementById('toggle-search-filters');
  const isCollapsed = filters.classList.toggle('collapsed');
  toggle.textContent = isCollapsed ? 'Afficher les filtres de recherche' : 'Masquer les filtres de recherche';
  toggle.setAttribute('aria-expanded', String(!isCollapsed));
}

function sortEntries(list) {
  const mode = document.getElementById('sort-mode').value;
  return [...list].sort((a, b) => {
    if (mode === 'container') return a.containerNumber.localeCompare(b.containerNumber);
    if (mode === 'lfd') return `${a.lfd}${a.startTime}`.localeCompare(`${b.lfd}${b.startTime}`);
    return `${a.startTime}${a.containerNumber}`.localeCompare(`${b.startTime}${b.containerNumber}`);
  });
}

function renderWeekView() {
  weekViewElement.innerHTML = '';
  const weekDates = getWeekDates(currentWeekStart);
  weekDates.forEach((date, index) => {
    const dayEntries = sortEntries(entries.filter((entry) => entry.date === date && activeFilters(entry)));
    const col = document.createElement('div');
    col.className = 'day-column';
    col.innerHTML = `<h3>${dayNames[index]}<br /><small>${date}</small></h3>`;
    if (!dayEntries.length) col.innerHTML += '<p class="hint">Aucun conteneur.</p>';
    dayEntries.forEach((entry) => {
      const overdue = entry.date < formatDate(new Date()) && !isArchived(entry);
      const box = document.createElement('div');
      box.className = `container-card ${isArchived(entry) ? 'archived' : ''} ${overdue ? 'overdue' : ''}`;
      box.innerHTML = `<strong>${entry.containerNumber}</strong><br />${entry.warehouse} | ${entry.startTime} | LFD ${entry.lfd}`;
      box.innerHTML += `<div class="badges">${entry.imported ? '<span class="badge ok">Importé</span>' : ''}${isArchived(entry) ? '<span class="badge ok">Archivé</span>' : ''}${overdue ? '<span class="badge warn">Retard</span>' : ''}</div>`;
      if (isArchived(entry)) {
        box.innerHTML += `<div class="readonly-label">Archivé (lecture seule)</div>`;
      } else {
        const actions = document.createElement('div'); actions.className = 'card-actions';
        actions.innerHTML = `<button data-act="edit">Modifier</button><button data-act="copy">Copier #</button><button data-act="duplicate">Dupliquer</button><button data-act="import">${entry.imported ? 'Retirer import' : 'Marquer importé'}</button><button data-act="archive">Archiver</button><button data-act="delete" class="danger">Supprimer</button>`;
        actions.addEventListener('click', (event) => {
          const action = event.target.dataset.act;
          if (!action) return;
          if (action === 'edit') loadEntryToForm(entry.id);
          if (action === 'copy') navigator.clipboard?.writeText(entry.containerNumber).then(() => showToast('Numéro copié.'));
          if (action === 'duplicate') duplicateEntry(entry);
          if (action === 'import') { entry.imported = !entry.imported; saveAll(); renderAll(); }
          if (action === 'archive') { proofContainerSelect.value = entry.id; switchPage('proof'); }
          if (action === 'delete') removeEntry(entry.id);
        });
        box.appendChild(actions);
      }
      col.appendChild(box);
    });
    weekViewElement.appendChild(col);
  });
}

function removeEntry(entryId) {
  const entry = entries.find((e) => e.id === entryId);
  if (!entry || !confirm(`Supprimer ${entry.containerNumber} ?`)) return;
  undoDeletedEntry = { ...entry };
  document.getElementById('undo-delete').disabled = false;
  entries = entries.filter((e) => e.id !== entryId);
  saveAll(); renderAll();
}

function duplicateEntry(entry) {
  const copy = { ...entry, id: crypto.randomUUID(), imported: false, archivedAt: null, date: formatDate(new Date()) };
  const validationError = validateConstraints(copy);
  if (validationError) return showToast(validationError);
  entries.push(copy); saveAll(); renderAll(); showToast('Cédule dupliquée pour aujourd’hui.');
}

function loadEntryToForm(entryId) {
  const entry = entries.find((candidate) => candidate.id === entryId);
  if (!entry || isArchived(entry)) return;
  for (const key of ['warehouse', 'date', 'containerNumber', 'lfd']) document.getElementById(key).value = entry[key];
  updateTimeOptions();
  document.getElementById('startTime').value = entry.startTime;
  entries = entries.filter((candidate) => candidate.id !== entry.id);
  saveAll(); renderAll(); switchPage('schedule');
}

function renderProofSelector() {
  const activeEntries = entries.filter((entry) => !isArchived(entry));
  proofContainerSelect.innerHTML = activeEntries.length
    ? activeEntries.map((entry) => `<option value="${entry.id}">${entry.containerNumber} (${entry.date} - ${entry.warehouse})</option>`).join('')
    : '<option value="">Aucun conteneur à archiver</option>';
}

function renderProofList() {
  proofList.innerHTML = proofs.length
    ? proofs.map((proof) => `<li class="proof-item"><strong>${proof.containerNumber}</strong> — ${proof.receivedDate} ${proof.receivedTime}<br/>${proof.note ? `<em>${proof.note}</em><br/>` : ''}<img src="${proof.photoData}" alt="Preuve ${proof.containerNumber}" /></li>`).join('')
    : '<li>Aucune preuve de réception.</li>';
}

function validateConstraints(newEntry) {
  const dayEntries = entries.filter((entry) => entry.warehouse === newEntry.warehouse && entry.date === newEntry.date);
  if ([0, 6].includes(new Date(`${newEntry.date}T00:00:00`).getDay())) return 'La cédule est limitée au lundi-vendredi.';
  if (newEntry.lfd < newEntry.date) return 'La date LFD doit être >= date de cédule.';
  if (entries.some((e) => e.containerNumber === newEntry.containerNumber && e.date === newEntry.date && e.startTime === newEntry.startTime)) return 'Conteneur déjà cédulé sur ce créneau.';
  if (newEntry.warehouse === 'Langelier') {
    if (!['08:00', '12:00'].includes(newEntry.startTime)) return 'Langelier accepte uniquement 08:00 ou 12:00.';
    if (dayEntries.length >= 2) return 'Date complète pour Langelier.';
    if (dayEntries.some((entry) => entry.startTime === newEntry.startTime)) return 'Ce créneau est déjà pris à Langelier.';
  }
  return null;
}

function notifyOverdue() {
  const overdue = getOverdueEntries();
  if (!overdue.length) { alertBox.classList.add('hidden'); alertBox.textContent = ''; return; }
  const list = overdue.map((entry) => `${entry.containerNumber} (${entry.date})`).join(', ');
  alertBox.classList.remove('hidden');
  alertBox.textContent = `ALERTE: ${overdue.length} conteneur(s) non archivé(s): ${list}.`;
  if (!settings.muteAlerts && 'Notification' in window && Notification.permission === 'granted') new Notification('Conteneurs non archivés', { body: list });
}


function updateFooterYear() {
  const year = String(new Date().getFullYear());
  if (footerYear) footerYear.textContent = year;
  if (footerYearShort) footerYearShort.textContent = year;
}

function getVisibleHeight(element) {
  if (!element) return 0;
  const styles = window.getComputedStyle(element);
  if (styles.display === 'none' || styles.visibility === 'hidden') return 0;
  return Math.ceil(element.getBoundingClientRect().height);
}

function getFixedBottomNav() {
  const selectors = ['.bottom-nav', 'nav[aria-label="bottom"]', 'nav[aria-label*="bottom" i]', 'nav[aria-label*="bas" i]'];
  return selectors
    .map((selector) => document.querySelector(selector))
    .find((element) => {
      if (!element) return false;
      const styles = window.getComputedStyle(element);
      return ['fixed', 'sticky'].includes(styles.position);
    }) || null;
}

function applyFooterPreferences() {
  document.body.classList.toggle('footer-short', settings.footerShort);
  appFooter?.classList.toggle('is-sticky', settings.footerSticky);
  if (appFooter && !settings.footerSticky) appFooter.style.bottom = '';
  updateLayoutOffsets();
}

function updateLayoutOffsets() {
  const fixedBottomNav = getFixedBottomNav();
  const navHeight = getVisibleHeight(fixedBottomNav);
  if (settings.footerSticky && appFooter) appFooter.style.bottom = `${navHeight}px`;
  const footerHeight = settings.footerSticky ? getVisibleHeight(appFooter) : 0;
  const baseGap = navHeight || footerHeight ? 8 : 0;
  const safeBottom = navHeight + footerHeight + baseGap;
  document.documentElement.style.setProperty('--safe-bottom-offset', `${safeBottom}px`);
  if (toast) toast.style.bottom = `${Math.max(16, navHeight + footerHeight + 12)}px`;
}

function restartAlertLoop() {
  if (alertTimer) clearInterval(alertTimer);
  alertTimer = setInterval(notifyOverdue, Math.max(1, Number(settings.alertIntervalMinutes) || 60) * 60 * 1000);
  notifyOverdue();
}

function renderAll() {
  renderWeekHeader(); updateKpis(); renderSummary(); renderWeekView(); renderProofSelector(); renderProofList(); updateTimeOptions();
}

function exportCsv(filename, rows) {
  const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = {
    id: crypto.randomUUID(),
    warehouse: document.getElementById('warehouse').value,
    date: document.getElementById('date').value,
    startTime: document.getElementById('startTime').value,
    containerNumber: document.getElementById('containerNumber').value.trim().toUpperCase(),
    lfd: document.getElementById('lfd').value,
    imported: false,
    archivedAt: null,
  };
  const errorBox = document.getElementById('form-message');
  if (!payload.warehouse || !payload.date || !payload.startTime || !payload.containerNumber || !payload.lfd) return (errorBox.textContent = 'Merci de remplir tous les champs.');
  if (!/^[A-Z]{4}\d{7}$/.test(payload.containerNumber)) return (errorBox.textContent = 'Format attendu: MSMU1231234.');
  const validationError = validateConstraints(payload);
  if (validationError) return (errorBox.textContent = validationError);
  errorBox.textContent = '';
  entries.push(payload);
  entries.sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  form.reset(); localStorage.removeItem(draftKey); draft = {};
  saveAll(); renderAll(); switchPage('week'); showToast('Cédule ajoutée.');
});

proofForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const containerId = proofContainerSelect.value;
  const photoFile = document.getElementById('proof-photo').files[0];
  const receivedTime = document.getElementById('proof-time').value;
  const note = document.getElementById('proof-note').value.trim();
  if (!containerId || !photoFile || !receivedTime) return showToast('Veuillez remplir les champs de preuve.');
  if (photoFile.size > 3 * 1024 * 1024) return showToast('Image trop lourde (max 3MB).');
  const entry = entries.find((candidate) => candidate.id === containerId);
  if (!entry) return showToast('Conteneur introuvable.');
  const reader = new FileReader();
  reader.onload = () => {
    entry.archivedAt = `${formatDate(new Date())} ${receivedTime}`;
    proofs.unshift({ id: crypto.randomUUID(), containerId, containerNumber: entry.containerNumber, receivedDate: formatDate(new Date()), receivedTime, note, photoData: reader.result });
    saveAll(); renderAll(); proofForm.reset(); document.getElementById('proof-time').value = nowTime(); showToast('Conteneur archivé.');
  };
  reader.readAsDataURL(photoFile);
});

settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  settings.alertIntervalMinutes = Number(document.getElementById('alert-interval').value) || 60;
  settings.muteAlerts = document.getElementById('mute-alerts').checked;
  settings.compactMode = document.getElementById('compact-mode').checked;
  settings.reduceMotion = document.getElementById('reduce-motion').checked;
  settings.footerSticky = document.getElementById('footer-sticky').checked;
  settings.footerShort = document.getElementById('footer-short').checked;
  settings.extraOptions = normalizeExtraOptions(
    Array.from(document.querySelectorAll('#extra-settings-options input[type="checkbox"]')).reduce((acc, checkbox) => {
      acc[checkbox.dataset.optionKey] = checkbox.checked;
      return acc;
    }, {}),
  );
  document.body.classList.toggle('compact', settings.compactMode);
  document.body.classList.toggle('reduce-motion', settings.reduceMotion);
  applyFooterPreferences();
  saveAll(); restartAlertLoop(); showToast('Paramètres enregistrés.');
});

navButtons.forEach((button) => button.addEventListener('click', () => switchPage(button.dataset.target)));
['warehouse', 'date'].forEach((id) => document.getElementById(id).addEventListener('change', updateTimeOptions));
['search-input', 'sort-mode'].forEach((id) => document.getElementById(id).addEventListener('input', renderWeekView));

document.getElementById('prev-week').addEventListener('click', () => { currentWeekStart.setDate(currentWeekStart.getDate() - 7); saveAll(); renderAll(); });
document.getElementById('next-week').addEventListener('click', () => { currentWeekStart.setDate(currentWeekStart.getDate() + 7); saveAll(); renderAll(); });
document.getElementById('today-week').addEventListener('click', () => { currentWeekStart = getStartOfWeek(new Date()); saveAll(); renderAll(); });
document.getElementById('settings-shortcut').addEventListener('click', () => switchPage('settings'));
document.getElementById('toggle-search-filters').addEventListener('click', toggleSearchFilters);
document.getElementById('theme-toggle').addEventListener('click', () => { ui.dark = !ui.dark; document.body.classList.toggle('dark', ui.dark); document.getElementById('theme-toggle').textContent = ui.dark ? '☀️' : '🌙'; localStorage.setItem(uiKey, JSON.stringify(ui)); });
document.getElementById('print-week').addEventListener('click', () => window.print());
document.getElementById('export-schedule').addEventListener('click', () => exportCsv('cedules.csv', [['Container', 'Zone', 'Date', 'Heure', 'LFD', 'Importe', 'Archive'], ...entries.map((e) => [e.containerNumber, e.warehouse, e.date, e.startTime, e.lfd, e.imported, e.archivedAt || ''])]));
document.getElementById('export-proofs').addEventListener('click', () => exportCsv('preuves.csv', [['Container', 'Date reception', 'Heure', 'Notes'], ...proofs.map((p) => [p.containerNumber, p.receivedDate, p.receivedTime, p.note || ''])]));
document.getElementById('quick-today').addEventListener('click', () => { document.getElementById('date').value = formatDate(new Date()); updateTimeOptions(); });
document.getElementById('clear-draft').addEventListener('click', () => { localStorage.removeItem(draftKey); draft = {}; form.reset(); showToast('Brouillon effacé.'); });
document.getElementById('undo-delete').addEventListener('click', () => { if (!undoDeletedEntry) return; entries.push(undoDeletedEntry); undoDeletedEntry = null; document.getElementById('undo-delete').disabled = true; saveAll(); renderAll(); });
document.getElementById('import-json').addEventListener('click', () => document.getElementById('json-file').click());
document.getElementById('json-file').addEventListener('change', (event) => {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const parsed = safeParse(reader.result, null);
    if (!parsed || !Array.isArray(parsed.entries) || !Array.isArray(parsed.proofs)) return showToast('Fichier JSON invalide.');
    entries = parsed.entries; proofs = parsed.proofs; saveAll(); renderAll(); showToast('Import JSON complété.');
  };
  reader.readAsText(file);
});
document.getElementById('clear-all').addEventListener('click', () => {
  if (!confirm('Confirmer la suppression de toutes les données?')) return;
  entries = []; proofs = []; undoDeletedEntry = null; document.getElementById('undo-delete').disabled = true;
  saveAll(); renderAll(); showToast('Toutes les données ont été vidées.');
});

document.addEventListener('keydown', (event) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
  const map = { d: 'dashboard', w: 'week', s: 'schedule', p: 'proof', t: 'settings' };
  const target = map[event.key.toLowerCase()];
  if (target) switchPage(target);
});

form.addEventListener('input', () => {
  draft = {
    warehouse: document.getElementById('warehouse').value,
    date: document.getElementById('date').value,
    startTime: document.getElementById('startTime').value,
    containerNumber: document.getElementById('containerNumber').value,
    lfd: document.getElementById('lfd').value,
  };
  localStorage.setItem(draftKey, JSON.stringify(draft));
});

proofList.addEventListener('click', (event) => {
  if (event.target.tagName !== 'IMG') return;
  window.open(event.target.src, '_blank', 'noopener,noreferrer');
});

if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
document.getElementById('alert-interval').value = settings.alertIntervalMinutes;
document.getElementById('mute-alerts').checked = settings.muteAlerts;
document.getElementById('compact-mode').checked = settings.compactMode;
document.getElementById('reduce-motion').checked = settings.reduceMotion;
document.getElementById('footer-sticky').checked = settings.footerSticky;
document.getElementById('footer-short').checked = settings.footerShort;
renderExtraSettingOptions();
document.body.classList.toggle('compact', settings.compactMode);
document.body.classList.toggle('reduce-motion', settings.reduceMotion);
updateFooterYear();
applyFooterPreferences();
document.body.classList.toggle('dark', ui.dark);
document.getElementById('theme-toggle').textContent = ui.dark ? '☀️' : '🌙';
document.getElementById('proof-time').value = nowTime();
for (const key of ['warehouse', 'date', 'containerNumber', 'lfd']) if (draft[key]) document.getElementById(key).value = draft[key];
renderAll();
restartAlertLoop();
switchPage(ui.page || 'dashboard');
window.addEventListener('resize', updateLayoutOffsets);

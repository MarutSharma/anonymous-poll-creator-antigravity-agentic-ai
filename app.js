/* ============================================================
   PollCraft – app.js
   ============================================================ */

// ─── State ────────────────────────────────────────────────────
let polls = loadPolls();
let currentAccent = 'violet';
let currentView = 'create';
let currentVotePollId = null;
let currentResultPollId = null;
let lastPublishedId = null;
let selectedOptions = new Set();
let optionCount = 0;

// ─── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCreator();
  bindTitleCounter();
  bindSwatches();
  bindToggle();
  showView('create');
});

function initCreator() {
  const list = document.getElementById('options-list');
  list.innerHTML = '';
  optionCount = 0;
  addOption('Option A');
  addOption('Option B');
}

// ─── Navigation ───────────────────────────────────────────────
function showView(name) {
  currentView = name;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const view = document.getElementById(`view-${name}`);
  if (view) view.classList.add('active');

  const navBtn = document.getElementById(`nav-${name}`);
  if (navBtn) navBtn.classList.add('active');

  if (name === 'polls') renderPollsGrid();
}

function goBack() {
  showView('polls');
}

// ─── Title counter ────────────────────────────────────────────
function bindTitleCounter() {
  const input = document.getElementById('poll-title');
  const counter = document.getElementById('title-counter');
  input.addEventListener('input', () => {
    counter.textContent = `${input.value.length} / 200`;
  });
}

// ─── Options ──────────────────────────────────────────────────
function addOption(defaultValue = '') {
  optionCount++;
  const id = `opt-${Date.now()}-${optionCount}`;
  const row = document.createElement('div');
  row.className = 'option-row';
  row.id = id;
  row.innerHTML = `
    <span class="option-drag" title="Drag to reorder">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="9" y1="6" x2="15" y2="6"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/>
      </svg>
    </span>
    <input
      type="text"
      class="option-input"
      placeholder="Enter option…"
      value="${escapeHtml(defaultValue)}"
      maxlength="200"
    />
    <button class="option-delete" title="Remove option" onclick="removeOption('${id}')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>`;
  document.getElementById('options-list').appendChild(row);

  // Keep add-button visible
  const addBtn = document.getElementById('add-option-btn');
  if (optionCount >= 8) addBtn.style.display = 'none';
}

function removeOption(id) {
  const list = document.getElementById('options-list');
  const rows = list.querySelectorAll('.option-row');
  if (rows.length <= 2) { showToast('A poll needs at least 2 options'); return; }
  const row = document.getElementById(id);
  if (row) { row.style.opacity = '0'; row.style.transform = 'translateX(-10px)'; setTimeout(() => row.remove(), 200); }
  const addBtn = document.getElementById('add-option-btn');
  addBtn.style.display = '';
  optionCount--;
}

// ─── Swatches ──────────────────────────────────────────────────
function bindSwatches() {
  document.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      currentAccent = sw.dataset.theme;
      document.documentElement.setAttribute('data-accent', currentAccent);
    });
  });
}

// ─── Toggle ───────────────────────────────────────────────────
function bindToggle() {
  const toggle = document.getElementById('show-results-toggle');
  const label = document.getElementById('results-toggle-label');
  toggle.addEventListener('change', () => {
    label.textContent = toggle.checked ? 'After voting' : 'Hidden';
  });
}

// ─── Preview ──────────────────────────────────────────────────
function previewPoll() {
  const draft = buildDraftPoll();
  if (!draft) return;
  draft.id = 'preview-' + Date.now();
  draft.votes = {};
  draft.options.forEach(o => { draft.votes[o.id] = 0; });
  openVoteView(draft);
}

// ─── Publish ──────────────────────────────────────────────────
function publishPoll() {
  const draft = buildDraftPoll();
  if (!draft) return;

  const poll = {
    ...draft,
    id: 'poll-' + Date.now(),
    createdAt: Date.now(),
    votes: {},
    voted: false,
  };
  poll.options.forEach(o => { poll.votes[o.id] = 0; });

  polls.unshift(poll);
  savePolls();

  lastPublishedId = poll.id;
  openShareModal(poll);

  // Reset creator
  document.getElementById('poll-title').value = '';
  document.getElementById('title-counter').textContent = '0 / 200';
  initCreator();
}

function buildDraftPoll() {
  const title = document.getElementById('poll-title').value.trim();
  if (!title) { showToast('Please enter a poll question'); document.getElementById('poll-title').focus(); return null; }

  const inputs = document.querySelectorAll('.option-input');
  const options = [];
  let hasEmpty = false;
  inputs.forEach((inp, i) => {
    const val = inp.value.trim();
    if (!val) { hasEmpty = true; return; }
    options.push({ id: `o-${i}-${Date.now()}`, text: val });
  });

  if (options.length < 2) { showToast('Please add at least 2 options'); return null; }
  if (hasEmpty) { showToast('Please fill in all options or remove empty ones'); return null; }

  return {
    title,
    options,
    type: document.getElementById('poll-type').value,
    expires: document.getElementById('poll-expires').value,
    showResults: document.getElementById('show-results-toggle').checked,
    theme: currentAccent,
  };
}

// ─── My Polls Grid ────────────────────────────────────────────
function renderPollsGrid() {
  const grid = document.getElementById('polls-grid');
  const empty = document.getElementById('polls-empty');
  grid.innerHTML = '';

  if (polls.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  polls.forEach((poll, idx) => {
    const totalVotes = Object.values(poll.votes || {}).reduce((a, b) => a + b, 0);
    const card = document.createElement('div');
    card.className = 'poll-card';
    card.style.animationDelay = `${idx * 0.06}s`;
    card.setAttribute('data-accent', poll.theme || 'violet');

    card.innerHTML = `
      <div class="poll-card-accent" style="background:${themeGradient(poll.theme)}"></div>
      <div class="poll-card-title">${escapeHtml(poll.title)}</div>
      <div class="poll-card-meta">${poll.options.length} options · ${timeAgo(poll.createdAt)}</div>
      <div class="poll-card-stats">
        <span class="stat-chip">🗳 ${totalVotes} vote${totalVotes !== 1 ? 's' : ''}</span>
        <span class="stat-chip">${poll.type === 'multi' ? '☑ Multi' : '◉ Single'}</span>
        ${poll.expires !== 'never' ? `<span class="stat-chip">⏱ ${poll.expires}</span>` : ''}
      </div>
      <div class="poll-card-actions">
        <button class="btn-ghost" onclick="event.stopPropagation(); votePoll('${poll.id}')">Vote</button>
        <button class="btn-ghost" onclick="event.stopPropagation(); viewResults('${poll.id}')">Results</button>
        <button class="btn-ghost" onclick="event.stopPropagation(); deletePoll('${poll.id}')">Delete</button>
      </div>`;

    grid.appendChild(card);
  });
}

// ─── Vote View ────────────────────────────────────────────────
function votePoll(id) {
  const poll = polls.find(p => p.id === id);
  if (!poll) return;
  openVoteView(poll);
}

function openVoteView(poll) {
  currentVotePollId = poll.id;
  selectedOptions = new Set();

  document.getElementById('view-vote').classList.add('active');
  document.querySelectorAll('.view').forEach(v => { if (v.id !== 'view-vote') v.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Theme bar
  document.getElementById('vote-theme-bar').style.background = themeGradient(poll.theme);
  document.documentElement.setAttribute('data-accent', poll.theme || 'violet');

  document.getElementById('vote-title').textContent = poll.title;
  document.getElementById('vote-meta').textContent =
    `${poll.options.length} options · ${poll.type === 'multi' ? 'Multiple choice' : 'Single choice'}`;

  const container = document.getElementById('vote-options');
  container.innerHTML = '';

  poll.options.forEach(opt => {
    const isMulti = poll.type === 'multi';
    const div = document.createElement('div');
    div.className = `vote-option`;
    div.id = `vopt-${opt.id}`;
    div.innerHTML = `
      <div class="vote-option-indicator ${isMulti ? 'vote-option-multi' : ''}">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <span class="vote-option-text">${escapeHtml(opt.text)}</span>`;
    div.addEventListener('click', () => toggleOption(opt.id, poll.type));
    container.appendChild(div);
  });

  document.getElementById('submit-vote-btn').disabled = true;
}

function toggleOption(optId, type) {
  if (type === 'single') {
    selectedOptions.clear();
    document.querySelectorAll('.vote-option').forEach(el => el.classList.remove('selected'));
  }
  const el = document.getElementById(`vopt-${optId}`);
  if (selectedOptions.has(optId)) {
    selectedOptions.delete(optId);
    el.classList.remove('selected');
  } else {
    selectedOptions.add(optId);
    el.classList.add('selected');
  }
  document.getElementById('submit-vote-btn').disabled = selectedOptions.size === 0;
}

function submitVote() {
  const isPreview = currentVotePollId && currentVotePollId.startsWith('preview-');
  if (isPreview) { showToast('This is just a preview!'); return; }

  const poll = polls.find(p => p.id === currentVotePollId);
  if (!poll) return;

  selectedOptions.forEach(optId => {
    if (poll.votes[optId] !== undefined) poll.votes[optId]++;
    else poll.votes[optId] = 1;
  });
  poll.voted = true;
  savePolls();
  showToast('🗳 Vote submitted!');
  viewResults(poll.id);
}

// ─── Results View ─────────────────────────────────────────────
function viewResults(id) {
  const poll = polls.find(p => p.id === id);
  if (!poll) return;
  currentResultPollId = id;

  document.getElementById('view-results').classList.add('active');
  document.querySelectorAll('.view').forEach(v => { if (v.id !== 'view-results') v.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Theme bar
  document.getElementById('results-theme-bar').style.background = themeGradient(poll.theme);
  document.documentElement.setAttribute('data-accent', poll.theme || 'violet');

  document.getElementById('results-title').textContent = poll.title;

  const totalVotes = Object.values(poll.votes || {}).reduce((a, b) => a + b, 0);
  document.getElementById('results-total-votes').textContent = `🗳 ${totalVotes} vote${totalVotes !== 1 ? 's' : ''}`;
  document.getElementById('results-poll-type').textContent = poll.type === 'multi' ? '☑ Multiple choice' : '◉ Single choice';

  const barsEl = document.getElementById('results-bars');
  barsEl.innerHTML = '';

  const maxVotes = Math.max(...Object.values(poll.votes || {}), 1);

  poll.options.forEach(opt => {
    const count = poll.votes[opt.id] || 0;
    const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
    const isWinner = count === maxVotes && count > 0;

    const item = document.createElement('div');
    item.className = 'result-bar-item';
    item.innerHTML = `
      <div class="result-bar-header">
        <span class="result-bar-label">${escapeHtml(opt.text)} ${isWinner ? '🏆' : ''}</span>
        <span class="result-bar-count">${pct}% · ${count} vote${count !== 1 ? 's' : ''}</span>
      </div>
      <div class="result-bar-track">
        <div class="result-bar-fill ${isWinner ? 'winner' : ''}"
             style="background:${themeGradient(poll.theme)}"
             data-width="${pct}"></div>
      </div>`;
    barsEl.appendChild(item);
  });

  // Animate bars after DOM is painted
  requestAnimationFrame(() => requestAnimationFrame(() => {
    barsEl.querySelectorAll('.result-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }));
}

// ─── Delete Poll ──────────────────────────────────────────────
function deletePoll(id) {
  polls = polls.filter(p => p.id !== id);
  savePolls();
  renderPollsGrid();
  showToast('Poll deleted');
}

// ─── Start New Poll ───────────────────────────────────────────
function startNewPoll() {
  showView('create');
}

// ─── Share Modal ──────────────────────────────────────────────
function openShareModal(poll) {
  const modal = document.getElementById('share-modal');
  const linkInput = document.getElementById('share-link-input');
  linkInput.value = `${window.location.href.split('#')[0]}#poll/${poll.id}`;
  modal.classList.remove('hidden');
}

function closeShareModal() {
  document.getElementById('share-modal').classList.add('hidden');
}

function copyShareLink() {
  const val = document.getElementById('share-link-input').value;
  navigator.clipboard.writeText(val).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
}

function copyPollLink() {
  const poll = polls.find(p => p.id === currentResultPollId);
  if (!poll) return;
  const link = `${window.location.href.split('#')[0]}#poll/${poll.id}`;
  navigator.clipboard.writeText(link).then(() => showToast('Link copied!'));
}

// ─── Handle hash links ────────────────────────────────────────
function handleHash() {
  const hash = window.location.hash;
  const match = hash.match(/^#poll\/(.+)$/);
  if (match) {
    const id = match[1];
    const poll = polls.find(p => p.id === id);
    if (poll) votePoll(id);
  }
}
window.addEventListener('hashchange', handleHash);
window.addEventListener('load', handleHash);

// ─── Persistence ──────────────────────────────────────────────
function savePolls() {
  try { localStorage.setItem('pollcraft_polls', JSON.stringify(polls)); } catch (e) {}
}

function loadPolls() {
  try {
    const raw = localStorage.getItem('pollcraft_polls');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

// ─── Toast ────────────────────────────────────────────────────
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.style.animation = 'none';
  void toast.offsetWidth;
  toast.style.animation = '';
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.add('hidden'), 2800);
}

// ─── Helpers ──────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function timeAgo(ts) {
  if (!ts) return 'just now';
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const THEME_GRADIENTS = {
  violet:  'linear-gradient(90deg,#7c3aed,#a855f7)',
  sky:     'linear-gradient(90deg,#0ea5e9,#38bdf8)',
  rose:    'linear-gradient(90deg,#f43f5e,#fb7185)',
  emerald: 'linear-gradient(90deg,#10b981,#34d399)',
  amber:   'linear-gradient(90deg,#f59e0b,#fbbf24)',
  pink:    'linear-gradient(90deg,#ec4899,#f472b6)',
};
function themeGradient(theme) { return THEME_GRADIENTS[theme] || THEME_GRADIENTS.violet; }

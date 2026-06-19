const TODAY = new Date().toISOString().slice(0, 10);

let state = {
  tasks: [
    { id: 1, name: 'Prepare quarterly report', quadrant: 1, goalId: 1, due: '2026-06-20', done: false, note: '' },
    { id: 2, name: 'Study TX-UK Chapter 4', quadrant: 2, goalId: 2, due: '2026-06-25', done: false, note: '' },
    { id: 3, name: 'Reply to client emails', quadrant: 3, goalId: null, due: '2026-06-18', done: false, note: '' },
    { id: 4, name: 'Organise desktop files', quadrant: 4, goalId: null, due: '2026-06-30', done: true, note: '' },
    { id: 5, name: 'Review mock exam paper', quadrant: 2, goalId: 2, due: '2026-06-22', done: false, note: '' },
  ],
  goals: [
    { id: 1, name: 'Land Big 10 internship', emoji: '🏢', color: '#7F77DD' },
    { id: 2, name: 'Pass ACCA TX-UK', emoji: '📚', color: '#1D9E75' },
  ],
  nextTaskId: 6,
  nextGoalId: 3,
  streak: [1,1,1,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
};

const QM = [
  { id: 1, label: 'Do first',  sub: 'Important & urgent',       dot: '#7F77DD', bg: 'var(--purple-bg)', tc: 'var(--purple-text)', bc: 'var(--purple)' },
  { id: 2, label: 'Schedule',  sub: 'Important, not urgent',    dot: '#1D9E75', bg: 'var(--green-bg)',  tc: 'var(--green-text)',  bc: 'var(--green)'  },
  { id: 3, label: 'Delegate',  sub: 'Urgent, not important',    dot: '#BA7517', bg: 'var(--amber-bg)', tc: 'var(--amber-text)', bc: 'var(--amber)'  },
  { id: 4, label: 'Eliminate', sub: 'Not urgent or important',  dot: '#888780', bg: 'var(--gray-bg)',  tc: 'var(--gray-text)',  bc: 'var(--gray)'   },
];

let activeTab = 'matrix';
let formState = { name: '', quadrant: 1, goalId: '', due: '', note: '' };
let goalFormState = { name: '', emoji: '📌' };
let modalMode = null;

// ── Persistence ──────────────────────────────────────────────────────────────
function saveState() {
  try { localStorage.setItem('fm_state', JSON.stringify(state)); } catch (e) {}
}
function loadState() {
  try { const s = localStorage.getItem('fm_state'); if (s) state = JSON.parse(s); } catch (e) {}
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  document.getElementById('hdate').textContent = new Date().toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short'
  });
  render();
});

// ── Tab switching ─────────────────────────────────────────────────────────────
function switchTab(t) {
  activeTab = t;
  document.querySelectorAll('.tab').forEach((el, i) =>
    el.classList.toggle('active', ['matrix','goals','today','progress'][i] === t)
  );
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + t).classList.add('active');
  render();
}

// ── Render all ───────────────────────────────────────────────────────────────
function render() {
  renderMatrix();
  renderGoals();
  renderToday();
  renderProgress();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(s) {
  if (!s) return '';
  const d = new Date(s + 'T00:00:00');
  const diff = Math.round((d - new Date(TODAY + 'T00:00:00')) / 864e5);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < 0) return Math.abs(diff) + 'd ago';
  if (diff <= 6) return 'in ' + diff + 'd';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Matrix ────────────────────────────────────────────────────────────────────
function renderMatrix() {
  const g = document.getElementById('matrix-grid');
  g.innerHTML = QM.map(q => {
    const tasks = state.tasks.filter(t => t.quadrant === q.id);
    const pills = tasks.slice(0, 4).map(t => `
      <div class="task-pill">
        <div class="check ${t.done ? 'done' : ''}" onclick="toggleTask(${t.id})">
          ${t.done ? '<i class="ti ti-check" style="font-size:9px;color:#fff"></i>' : ''}
        </div>
        <span class="task-pill-dot" style="background:${q.dot}"></span>
        <span class="task-pill-name" style="${t.done ? 'text-decoration:line-through;opacity:0.45' : ''}">${esc(t.name)}</span>
        ${t.due ? `<span class="task-pill-due">${fmtDate(t.due)}</span>` : ''}
        <button class="del-btn" onclick="confirmDelete('task',${t.id})"><i class="ti ti-x"></i></button>
      </div>`).join('');
    const more = tasks.length > 4 ? `<div style="font-size:10px;color:var(--text-tertiary);padding:3px 4px">+${tasks.length - 4} more</div>` : '';
    return `<div class="quadrant">
      <div class="q-header">
        <div>
          <span class="q-label" style="background:${q.bg};color:${q.tc}">${q.label}</span>
          <div class="q-subtitle">${q.sub}</div>
        </div>
        <span class="q-count">${tasks.length}</span>
      </div>
      ${pills}${more}
      ${tasks.length === 0 ? `<div class="empty" style="padding:10px 0;font-size:11px">Empty</div>` : ''}
    </div>`;
  }).join('');
}

// ── Goals ─────────────────────────────────────────────────────────────────────
function renderGoals() {
  const list = document.getElementById('goals-list');
  if (!state.goals.length) { list.innerHTML = `<div class="empty">No goals yet. Add one below.</div>`; return; }
  list.innerHTML = state.goals.map(g => {
    const tasks = state.tasks.filter(t => t.goalId === g.id);
    const done = tasks.filter(t => t.done).length;
    const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
    const rows = tasks.map(t => {
      const q = QM.find(q => q.id === t.quadrant);
      return `<div class="goal-task-row">
        <div class="check ${t.done ? 'done' : ''}" onclick="toggleTask(${t.id})">
          ${t.done ? '<i class="ti ti-check" style="font-size:9px;color:#fff"></i>' : ''}
        </div>
        <span class="gt-name" style="${t.done ? 'text-decoration:line-through;opacity:0.45' : ''}">${esc(t.name)}</span>
        <span class="qt-badge" style="background:${q.bg};color:${q.tc}">${q.label}</span>
        ${t.due ? `<span style="font-size:10px;color:var(--text-tertiary)">${fmtDate(t.due)}</span>` : ''}
        <button class="del-btn" style="opacity:1" onclick="confirmDelete('task',${t.id})"><i class="ti ti-x"></i></button>
      </div>`;
    }).join('');
    return `<div class="goal-card">
      <div class="goal-header">
        <div class="goal-icon" style="background:${g.color}22">${g.emoji}</div>
        <span class="goal-name">${esc(g.name)}</span>
        <span style="font-size:11px;color:var(--text-tertiary);margin-right:4px">${done}/${tasks.length}</span>
        <button class="goal-del" onclick="confirmDelete('goal',${g.id})"><i class="ti ti-trash" style="font-size:14px"></i></button>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%;background:${g.color}"></div></div>
      <div class="prog-label">${pct}% complete</div>
      ${rows}
      <button class="add-btn" style="margin-top:10px;margin-bottom:0;padding:8px 12px" onclick="openTaskModal(${g.id})">
        <i class="ti ti-plus"></i> Add task to this goal
      </button>
    </div>`;
  }).join('');
}

// ── Today ─────────────────────────────────────────────────────────────────────
function renderToday() {
  const overdue  = state.tasks.filter(t => !t.done && t.due && t.due < TODAY);
  const dueToday = state.tasks.filter(t => !t.done && t.due === TODAY);
  const upcoming = state.tasks.filter(t => !t.done && t.due > TODAY).slice(0, 5);

  const makeRow = (t, badge = '') => {
    const q = QM.find(q => q.id === t.quadrant);
    return `<div class="today-task" onclick="toggleTask(${t.id})">
      <div class="check ${t.done ? 'done' : ''}">
        ${t.done ? '<i class="ti ti-check" style="font-size:9px;color:#fff"></i>' : ''}
      </div>
      <div class="tt-info">
        <div class="tt-name" style="${t.done ? 'text-decoration:line-through;opacity:0.45' : ''}">${esc(t.name)}</div>
        <div class="tt-meta">${q.label}${t.due ? ' · ' + fmtDate(t.due) : ''}</div>
      </div>
      ${badge}
    </div>`;
  };

  document.getElementById('today-content').innerHTML = `
    <div class="day-card">
      <div class="day-card-header"><i class="ti ti-alert-circle" style="font-size:15px;color:var(--red)"></i> Overdue (${overdue.length})</div>
      ${overdue.length ? overdue.map(t => makeRow(t, '<span class="overdue-tag">Overdue</span>')).join('') : '<div class="empty">Nothing overdue 🎉</div>'}
    </div>
    <div class="day-card">
      <div class="day-card-header"><i class="ti ti-sun" style="font-size:15px;color:var(--amber)"></i> Today (${dueToday.length})</div>
      ${dueToday.length ? dueToday.map(t => makeRow(t)).join('') : '<div class="empty">Nothing due today</div>'}
    </div>
    <div class="day-card">
      <div class="day-card-header"><i class="ti ti-calendar" style="font-size:15px;color:var(--purple)"></i> Coming up</div>
      ${upcoming.length ? upcoming.map(t => makeRow(t)).join('') : '<div class="empty">Nothing scheduled</div>'}
    </div>`;
}

// ── Progress ──────────────────────────────────────────────────────────────────
function renderProgress() {
  const all = state.tasks, done = all.filter(t => t.done);
  const pct = all.length ? Math.round(done.length / all.length * 100) : 0;
  const overdue = all.filter(t => !t.done && t.due && t.due < TODAY).length;
  const streak = state.streak;
  const curStreak = (() => { let s = 0; for (let i = streak.length - 1; i >= 0; i--) { if (streak[i]) s++; else break; } return s; })();
  const days = ['M','T','W','T','F','S','S'];

  const streakHtml = streak.slice(-21).map((d, i) => {
    const isT = i === 20;
    return `<div class="streak-day ${isT ? 's-today' : d ? 's-done' : 's-miss'}">${days[i % 7]}</div>`;
  }).join('');

  const qBars = QM.map(q => {
    const qt = all.filter(t => t.quadrant === q.id), qd = qt.filter(t => t.done);
    const p = qt.length ? Math.round(qd.length / qt.length * 100) : 0;
    return `<div class="q-prog-row">
      <div class="q-prog-meta">
        <span class="q-prog-name">${q.sub}</span>
        <span class="q-prog-count">${qd.length}/${qt.length}</span>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${p}%;background:${q.dot}"></div></div>
    </div>`;
  }).join('');

  document.getElementById('progress-content').innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-lbl">Done</div><div class="stat-val">${done.length}</div><div class="stat-sub">of ${all.length} tasks</div></div>
      <div class="stat-card"><div class="stat-lbl">Rate</div><div class="stat-val">${pct}%</div><div class="stat-sub">completion</div></div>
      <div class="stat-card"><div class="stat-lbl">Goals</div><div class="stat-val">${state.goals.length}</div><div class="stat-sub">active</div></div>
      <div class="stat-card"><div class="stat-lbl">Overdue</div><div class="stat-val" style="${overdue ? 'color:var(--red)' : ''}">${overdue}</div><div class="stat-sub">tasks</div></div>
    </div>
    <div class="prog-card">
      <div class="prog-card-title">Activity — last 21 days</div>
      <div class="streak-row">${streakHtml}</div>
      <div style="font-size:12px;color:var(--text-secondary)">Current streak: <b>${curStreak} day${curStreak !== 1 ? 's' : ''}</b></div>
    </div>
    <div class="prog-card">
      <div class="prog-card-title">By quadrant</div>
      ${qBars}
    </div>`;
}

// ── Task actions ──────────────────────────────────────────────────────────────
function toggleTask(id) {
  const t = state.tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; if (t.done) state.streak[state.streak.length - 1] = 1; }
  saveState(); render();
}

// ── Delete confirm ────────────────────────────────────────────────────────────
function confirmDelete(type, id) {
  const root = document.getElementById('confirm-root');
  let name = '';
  if (type === 'task') { const t = state.tasks.find(t => t.id === id); name = t ? t.name : 'this task'; }
  else { const g = state.goals.find(g => g.id === id); name = g ? g.name : 'this goal'; }
  const extra = type === 'goal' ? '<br>Tasks linked to this goal will be unlinked.' : '';
  root.innerHTML = `<div class="confirm-overlay" onclick="if(event.target===this)closeConfirm()">
    <div class="confirm-modal">
      <div class="confirm-title">Delete ${type}?</div>
      <div class="confirm-sub">Remove <b>${esc(name)}</b>? This cannot be undone.${extra}</div>
      <div class="confirm-row">
        <button class="btn-cancel" style="flex:1" onclick="closeConfirm()">Cancel</button>
        <button class="btn-danger" style="flex:1" onclick="doDelete('${type}',${id})">Delete</button>
      </div>
    </div>
  </div>`;
}

function doDelete(type, id) {
  if (type === 'task') {
    state.tasks = state.tasks.filter(t => t.id !== id);
  } else {
    state.goals = state.goals.filter(g => g.id !== id);
    state.tasks.forEach(t => { if (t.goalId === id) t.goalId = null; });
  }
  closeConfirm(); saveState(); render();
}

function closeConfirm() { document.getElementById('confirm-root').innerHTML = ''; }

// ── Modals ────────────────────────────────────────────────────────────────────
function openTaskModal(preGoalId) {
  formState = { name: '', quadrant: 1, goalId: preGoalId || '', due: '', note: '' };
  modalMode = 'task'; renderModal();
}

function openGoalModal() {
  goalFormState = { name: '', emoji: '📌' };
  modalMode = 'goal'; renderModal();
}

function closeModal() { document.getElementById('modal-root').innerHTML = ''; modalMode = null; }

function renderModal() {
  const root = document.getElementById('modal-root');
  if (modalMode === 'task') {
    const qOpts = QM.map(q => `
      <div class="q-opt ${formState.quadrant === q.id ? 'sel-' + q.id : ''}" onclick="selQ(${q.id})">
        <div class="q-opt-label">${q.label}</div>
        <div class="q-opt-sub">${q.sub}</div>
      </div>`).join('');
    const gOpts = state.goals.map(g =>
      `<option value="${g.id}" ${formState.goalId == g.id ? 'selected' : ''}>${g.emoji} ${esc(g.name)}</option>`
    ).join('');
    root.innerHTML = `<div class="overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-handle"></div>
        <div class="modal-title">New task</div>
        <div class="field"><label>Task name</label><input id="f-name" type="text" placeholder="What needs to be done?" oninput="formState.name=this.value" autofocus></div>
        <div class="field"><label>Priority</label><div class="q-grid">${qOpts}</div></div>
        <div class="field"><label>Goal (optional)</label><select onchange="formState.goalId=this.value"><option value="">— No goal —</option>${gOpts}</select></div>
        <div class="field"><label>Due date</label><input type="date" onchange="formState.due=this.value"></div>
        <div class="field"><label>Notes</label><textarea placeholder="Any extra details..." oninput="formState.note=this.value"></textarea></div>
        <div class="modal-actions">
          <button class="btn-cancel" onclick="closeModal()">Cancel</button>
          <button class="btn-save" onclick="saveTask()">Add task</button>
        </div>
      </div>
    </div>`;
  } else if (modalMode === 'goal') {
    const emojis = ['📌','🏆','🎯','📚','💼','💡','🏃','❤️','🌱','🔑','⭐','🚀'];
    const ep = emojis.map(e =>
      `<div class="emoji-opt ${goalFormState.emoji === e ? 'sel' : ''}" onclick="selEmoji('${e}')">${e}</div>`
    ).join('');
    root.innerHTML = `<div class="overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-handle"></div>
        <div class="modal-title">New goal</div>
        <div class="field"><label>Goal name</label><input type="text" placeholder="What do you want to achieve?" oninput="goalFormState.name=this.value" autofocus></div>
        <div class="field"><label>Icon</label><div class="emoji-row">${ep}</div></div>
        <div class="modal-actions">
          <button class="btn-cancel" onclick="closeModal()">Cancel</button>
          <button class="btn-save" onclick="saveGoal()">Add goal</button>
        </div>
      </div>
    </div>`;
  }
}

function selQ(id) { formState.quadrant = id; renderModal(); }
function selEmoji(e) { goalFormState.emoji = e; renderModal(); }

function saveTask() {
  if (!formState.name.trim()) { alert('Please enter a task name.'); return; }
  state.tasks.push({
    id: state.nextTaskId++,
    name: formState.name.trim(),
    quadrant: formState.quadrant,
    goalId: formState.goalId ? parseInt(formState.goalId) : null,
    due: formState.due,
    done: false,
    note: formState.note,
  });
  closeModal(); saveState(); render();
}

function saveGoal() {
  if (!goalFormState.name.trim()) { alert('Please enter a goal name.'); return; }
  const colors = ['#7F77DD','#1D9E75','#BA7517','#E24B4A','#378ADD','#D4537E'];
  state.goals.push({
    id: state.nextGoalId++,
    name: goalFormState.name.trim(),
    emoji: goalFormState.emoji,
    color: colors[state.goals.length % colors.length],
  });
  closeModal(); saveState(); render();
}

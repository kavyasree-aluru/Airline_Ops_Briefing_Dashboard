// ─────────── DATA ───────────
const STAFF = [
  { id:'S-0042', name:'Ravi Kumar', role:'Shift Supervisor', zone:'Terminal A', shift:'06:00–14:00', status:'on-duty', phone:'+91-98400-11221' },
  { id:'S-0071', name:'Priya Sharma', role:'Gate Agent', zone:'Gate A12', shift:'06:00–14:00', status:'on-duty', phone:'+91-98400-22332' },
  { id:'S-0088', name:'Arun Mehta', role:'Ramp Coordinator', zone:'Apron 2', shift:'06:00–14:00', status:'on-break', phone:'+91-98400-33443' },
  { id:'S-0103', name:'Deepa Nair', role:'Check-in Supervisor', zone:'Terminal B', shift:'14:00–22:00', status:'off-duty', phone:'+91-98400-44554' },
  { id:'S-0115', name:'Karthik Iyer', role:'Security Coordinator', zone:'Main Hall', shift:'06:00–14:00', status:'on-duty', phone:'+91-98400-55665' },
  { id:'S-0129', name:'Sonal Verma', role:'Ground Handler', zone:'Apron 1', shift:'06:00–14:00', status:'on-duty', phone:'+91-98400-66776' },
  { id:'S-0147', name:'Rahul Pillai', role:'Baggage Supervisor', zone:'Belt 4–7', shift:'14:00–22:00', status:'off-duty', phone:'+91-98400-77887' },
];

const CONFLICTS = [
  { gate:'A-12', flights:['6E-501 (07:45)', 'AI-202 (07:50)'], delta:'5 min overlap', severity:'Critical' },
  { gate:'B-06', flights:['SG-110 (09:20)', '6E-811 (09:25)'], delta:'5 min overlap', severity:'High' },
  { gate:'C-14', flights:['UK-953 (11:00)', 'AI-410 (11:10)'], delta:'10 min overlap', severity:'Medium' },
];

const NOTIFS = [
  { icon:'🚨', cls:'red', msg:'Gate A-12 conflict: 6E-501 vs AI-202 overlap in 40 min', time:'07:06' },
  { icon:'⛅', cls:'amber', msg:'Low visibility advisory: RVR < 3500m at Rwy 09L/27R', time:'06:52' },
  { icon:'👤', cls:'amber', msg:'Staff shortage: 2 gate agents absent for afternoon shift', time:'06:30' },
  { icon:'✅', cls:'green', msg:'6E-201 departed 3 min early from Gate B-04', time:'06:12' },
  { icon:'ℹ️', cls:'blue', msg:'System maintenance window scheduled 02:00–04:00 tomorrow', time:'05:45' },
];

const WX_FORECAST = [
  { time:'09:00', cond:'⛅ Haze', temp:'31°', wind:'16kt NNE', vis:'5.2km' },
  { time:'12:00', cond:'🌤 Clearing', temp:'35°', wind:'12kt N', vis:'8.0km' },
  { time:'15:00', cond:'☀ Sunny', temp:'37°', wind:'10kt NW', vis:'10km+' },
  { time:'18:00', cond:'🌤 Partly cloudy', temp:'34°', wind:'8kt W', vis:'10km+' },
  { time:'21:00', cond:'🌙 Clear', temp:'29°', wind:'6kt SW', vis:'10km+' },
];

const EXPORT_HISTORY = [
  { name:'Ops Brief 10-May-2026', fmt:'PDF', by:'A. Manager', time:'06:00' },
  { name:'Ops Brief 09-May-2026', fmt:'Excel', by:'K. Iyer', time:'05:58 yesterday' },
  { name:'Weekly Slot Report', fmt:'PDF', by:'System', time:'Mon 00:00' },
];

const ADMIN_TOGGLES = [
  { label:'Real-time Alerts', sub:'Push notifications for gate conflicts', on:true },
  { label:'Auto-Reassign Slots', sub:'Auto-resolve minor gate overlaps', on:false },
  { label:'Weather API Sync', sub:'Live METAR/TAF feed every 15 min', on:true },
  { label:'Staff Notifications', sub:'SMS alerts to supervisors on duty', on:true },
  { label:'Maintenance Mode', sub:'Disable public-facing kiosks', on:false },
];

const ACCESS_LOG = [
  { user:'manager@airport.com', action:'Login', time:'07:06' },
  { user:'k.iyer@airport.com', action:'Exported Slot Report', time:'06:42' },
  { user:'system', action:'Weather API sync', time:'06:30' },
  { user:'r.kumar@airport.com', action:'Resolved Gate B-04 conflict', time:'05:55' },
];

// ─────────── AUTH ───────────
let selectedRole = 'Airport Manager';

function selectRole(el) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedRole = el.dataset.role;
}

function autofill() {
  document.getElementById('login-user').value = 'manager@airport.com';
  document.getElementById('login-pass').value = 'admin123';
}

function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  const err = document.getElementById('err-msg');
  if (!u || !p) { err.style.display='block'; err.textContent='⚠ Please fill in all fields.'; return; }
  if (p.length < 4) { err.style.display='block'; err.textContent='⚠ Invalid credentials.'; return; }
  err.style.display='none';

  // set user info
  const initials = u.split('@')[0].split('.').map(x=>x[0].toUpperCase()).join('').slice(0,2) || 'AM';
  document.getElementById('user-avatar').textContent = initials;
  document.getElementById('user-name').textContent = selectedRole;
  document.getElementById('user-role').textContent = selectedRole.toUpperCase();

  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('dashboard-screen').classList.add('active');
  initDashboard();
}

function doLogout() {
  document.getElementById('dashboard-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
}

// ─────────── NAVIGATION ───────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const active = [...document.querySelectorAll('.nav-item')].find(n => n.getAttribute('onclick')?.includes(id));
  if (active) active.classList.add('active');
}

// ─────────── LIVE CLOCK ───────────
function updateClock() {
  const now = new Date();
  document.getElementById('live-time').textContent =
    now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' }) + ' IST';
}
setInterval(updateClock, 1000);
updateClock();

// ─────────── SLOT CHART ───────────
function buildSlotChart(container, gates) {
  const hours = Array.from({length:24}, (_,i) => String(i).padStart(2,'0'));
  const gateLabels = gates || ['A01','A02','A03','A04','A05','A06','B01','B02','B03','B04'];

  let html = '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:10px;width:100%">';
  html += '<tr><th style="padding:4px 8px;color:var(--muted);text-align:left;width:40px">Gate</th>';
  hours.forEach(h => {
    html += `<th style="padding:2px;color:var(--muted);font-family:JetBrains Mono,monospace;font-size:9px;text-align:center;width:28px">${h}</th>`;
  });
  html += '</tr>';

  gateLabels.forEach((gate, gi) => {
    html += `<tr><td style="padding:4px 8px;color:var(--muted2);font-family:JetBrains Mono,monospace">${gate}</td>`;
    hours.forEach((_, hi) => {
      const r = Math.random();
      let cls, bg;
      if (r < 0.05) { cls='conflict'; bg='var(--red)'; }
      else if (r < 0.15) { cls='delayed'; bg='var(--amber)'; }
      else if (r < 0.65) { cls='used'; bg='var(--accent2)'; }
      else { cls='empty'; bg='rgba(255,255,255,0.04)'; }
      html += `<td style="padding:2px"><div class="slot-cell ${cls}" style="background:${bg};height:20px;border-radius:3px" title="${gate} ${_}:00"></div></td>`;
    });
    html += '</tr>';
  });
  html += '</table></div>';
  document.getElementById(container).innerHTML = html;
}

// ─────────── DELAY HEATMAP ───────────
function buildHeatmap() {
  const routes = ['HYD→DEL','HYD→BOM','HYD→BLR','HYD→MAA','HYD→CCU','HYD→AMD'];
  const hours = Array.from({length:24}, (_,i) => String(i).padStart(2,'0'));
  const delays = Array.from({length:routes.length}, () =>
    Array.from({length:24}, () => Math.floor(Math.random()*60)));

  const maxDelay = 60;
  function heatColor(v) {
    const r = Math.floor((v/maxDelay)*255);
    const g = Math.floor((1-v/maxDelay)*150);
    return `rgb(${r},${g},30)`;
  }

  let html = '<div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%">';
  html += '<tr><th style="width:70px"></th>';
  hours.forEach(h => html += `<th style="font-size:9px;color:var(--muted);font-family:JetBrains Mono,monospace;padding:2px 1px;text-align:center">${h}</th>`);
  html += '</tr>';

  routes.forEach((route, ri) => {
    html += `<tr><td style="font-size:11px;color:var(--muted2);padding:3px 8px 3px 0;white-space:nowrap">${route}</td>`;
    delays[ri].forEach(d => {
      const c = heatColor(d);
      html += `<td style="padding:1px"><div class="hm-cell" style="background:${c};opacity:${0.3+0.7*(d/maxDelay)}" title="${d} min delay"></div></td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  html += '<div style="margin-top:14px;display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted2)">Delay intensity: ';
  for (let i=0;i<=10;i++) {
    html += `<span style="display:inline-block;width:18px;height:12px;border-radius:2px;background:${heatColor(i*6)}"></span>`;
  }
  html += ' <span style="margin-left:4px">0 min</span> → <span>60+ min</span></div></div>';
  document.getElementById('heatmap-container').innerHTML = html;
}

// ─────────── STAFF TABLE ───────────
function buildStaff() {
  const statusMap = { 'on-duty':['on-duty','● On Duty'], 'on-break':['on-break','◔ On Break'], 'off-duty':['off-duty','○ Off Duty'] };
  let html = STAFF.map(s => {
    const [cls, lbl] = statusMap[s.status];
    return `<tr>
      <td class="mono" style="color:var(--muted2);font-size:11px">${s.id}</td>
      <td style="font-weight:500">${s.name}</td>
      <td style="color:var(--muted2)">${s.role}</td>
      <td><span style="background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.15);border-radius:6px;padding:2px 8px;font-size:11px;color:var(--accent)">${s.zone}</span></td>
      <td class="mono" style="font-size:11px;color:var(--muted2)">${s.shift}</td>
      <td><span class="status-pill ${cls}">${lbl}</span></td>
      <td class="mono" style="font-size:11px;color:var(--muted2)">${s.phone}</td>
    </tr>`;
  }).join('');
  document.getElementById('staff-tbody').innerHTML = html;
}

// ─────────── CONFLICTS ───────────
function buildConflicts() {
  const html = CONFLICTS.map(c => `
    <div class="conflict-card">
      <div class="conflict-title">
        Gate ${c.gate} <span class="conflict-badge">${c.severity}</span>
      </div>
      <div class="conflict-detail">${c.flights[0]} ↔ ${c.flights[1]} · Overlap: ${c.delta}</div>
      <div class="conflict-actions">
        <button class="ca-btn resolve" onclick="resolveConflict(this)">✓ Resolve</button>
        <button class="ca-btn escalate">⚠ Escalate</button>
      </div>
    </div>`).join('');
  if (document.getElementById('overview-conflicts')) document.getElementById('overview-conflicts').innerHTML = html;
  if (document.getElementById('gate-conflicts-list')) document.getElementById('gate-conflicts-list').innerHTML = html;
}

function resolveConflict(btn) {
  const card = btn.closest('.conflict-card');
  card.style.transition = 'opacity 0.3s';
  card.style.opacity = '0';
  setTimeout(() => card.remove(), 300);
}

// ─────────── NOTIFICATIONS ───────────
function buildNotifs() {
  const html = (n) => `
    <div class="notif-item">
      <div class="notif-icon ${n.cls}">${n.icon}</div>
      <div>
        <div class="notif-msg">${n.msg}</div>
        <div class="notif-time">${n.time} today</div>
      </div>
    </div>`;
  const all = NOTIFS.map(html).join('');
  if (document.getElementById('overview-notifs')) document.getElementById('overview-notifs').innerHTML = all;
  if (document.getElementById('notif-list-full')) document.getElementById('notif-list-full').innerHTML = all;
}

// ─────────── WEATHER FORECAST ───────────
function buildWeather() {
  const html = WX_FORECAST.map(w => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
      <span class="mono" style="font-size:12px;color:var(--muted2)">${w.time}</span>
      <span style="font-size:13px">${w.cond}</span>
      <span style="font-weight:600;color:var(--text)">${w.temp}</span>
      <span style="font-size:11px;color:var(--muted2)">${w.wind}</span>
      <span style="font-size:11px;color:var(--muted2)">${w.vis}</span>
    </div>`).join('');
  if (document.getElementById('wx-forecast')) document.getElementById('wx-forecast').innerHTML = html;
}

// ─────────── EXPORT ───────────
function buildExportHistory() {
  const html = EXPORT_HISTORY.map(e => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:18px">📄</span>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500">${e.name}</div>
        <div style="font-size:11px;color:var(--muted2)">${e.fmt} · by ${e.by} · ${e.time}</div>
      </div>
      <button class="btn btn-ghost" style="font-size:11px;padding:5px 10px">↓</button>
    </div>`).join('');
  if (document.getElementById('export-history')) document.getElementById('export-history').innerHTML = html;
}

function exportBrief() {
  const btn = event.target;
  btn.textContent = '⏳ Generating...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✅ Brief Ready — Downloaded!';
    setTimeout(() => { btn.textContent = '📤 Generate & Download Brief'; btn.disabled = false; }, 3000);
  }, 1800);
}

// ─────────── ADMIN ───────────
function buildAdmin() {
  const states = ADMIN_TOGGLES.map(t => t.on);
  const html = ADMIN_TOGGLES.map((t, i) => `
    <div class="toggle-row">
      <div>
        <div class="toggle-label">${t.label}</div>
        <div class="toggle-sub">${t.sub}</div>
      </div>
      <div class="toggle ${t.on ? 'on' : ''}" onclick="this.classList.toggle('on')">
        <div class="toggle-knob"></div>
      </div>
    </div>`).join('');
  if (document.getElementById('admin-toggles')) document.getElementById('admin-toggles').innerHTML = html;

  const logHtml = ACCESS_LOG.map(l => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
      <div>
        <div style="font-size:13px;color:var(--text)">${l.user}</div>
        <div style="font-size:11px;color:var(--muted2)">${l.action}</div>
      </div>
      <span class="mono" style="font-size:11px;color:var(--muted)">${l.time}</span>
    </div>`).join('');
  if (document.getElementById('access-log')) document.getElementById('access-log').innerHTML = logHtml;
}

// ─────────── INIT ───────────
function initDashboard() {
  const today = new Date();
  document.getElementById('ops-date').value = today.toISOString().split('T')[0];
  document.getElementById('today-label').textContent = today.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  buildSlotChart('mini-slot-chart', ['A01','A02','A03','A04','A05','A06']);
  buildSlotChart('full-slot-chart', ['A01','A02','A03','A04','A05','A06','A07','A08','B01','B02','B03','B04','B05','B06','C01','C02','C03','C04']);
  buildHeatmap();
  buildStaff();
  buildConflicts();
  buildNotifs();
  buildWeather();
  buildExportHistory();
  buildAdmin();
}

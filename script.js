// ── ACCORDION ──
function toggleAcc(head){
  const acc=head.parentElement;
  const wasOpen=acc.classList.contains('open');
  // Close all
  document.querySelectorAll('.acc.open').forEach(a=>{
    a.classList.remove('open');
  });
  if(!wasOpen) acc.classList.add('open');
}

// ── TABS ──
function switchTab(btn,panelId){
  const container=btn.closest('.tabs');
  container.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  container.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const panel=document.getElementById(panelId);
  if(panel) panel.classList.add('active');
}

// ── SEARCH ──
const searchData=[
  {title:'PESTEL Analysis',desc:'Macro-environmental analysis — Political, Economic, Social, Technological, Environmental, Legal',tags:'pestel environmental macro analysis',section:'s1'},
  {title:"Porter's Five Forces",desc:'Competitive intensity — Rivalry, New Entrants, Suppliers, Buyers, Substitutes',tags:'porter five forces competitive industry rivalry',section:'s1'},
  {title:"Porter's Value Chain",desc:'Internal activity analysis — Primary and Support activities, competitive advantage',tags:'value chain porter internal activities',section:'s1'},
  {title:'BCG Matrix',desc:'Portfolio management — Stars, Cash Cows, Question Marks, Dogs',tags:'bcg boston matrix portfolio stars cash cows dogs',section:'s1'},
  {title:'Ansoff Matrix',desc:'Growth strategies — Market Penetration, Development, Product Development, Diversification',tags:'ansoff growth strategy market product',section:'s1'},
  {title:'SWOT Analysis',desc:'Internal strengths/weaknesses + External opportunities/threats',tags:'swot strengths weaknesses opportunities threats',section:'s1'},
  {title:"Mendelow's Matrix",desc:'Stakeholder mapping — Power vs Interest quadrants',tags:'mendelow stakeholder power interest',section:'s1'},
  {title:'Balanced Scorecard (BSC)',desc:'Four perspectives — Financial, Customer, Internal Process, Learning & Growth',tags:'balanced scorecard bsc kaplan norton four perspectives kpi',section:'s2'},
  {title:'Performance Prism',desc:'Stakeholder-centric performance framework — Satisfaction, Contribution, Strategies, Processes, Capabilities',tags:'performance prism neely stakeholder',section:'s2'},
  {title:'Fitzgerald & Moon Building Block',desc:'Service sector performance model — Dimensions, Standards, Rewards',tags:'fitzgerald moon building block service sector',section:'s2'},
  {title:'CSFs & KPIs',desc:'Critical Success Factors and Key Performance Indicators — SMART targets',tags:'csf kpi critical success key performance smart targets',section:'s2'},
  {title:'ROI — Return on Investment',desc:'Divisional financial measure — goal incongruence risk',tags:'roi return on investment divisional',section:'s3'},
  {title:'RI — Residual Income',desc:'Profit after capital charge — fixes ROI goal congruence problem',tags:'ri residual income divisional capital charge',section:'s3'},
  {title:'EVA — Economic Value Added',desc:'True economic profit — adjusts accounting figures, uses WACC',tags:'eva economic value added WACC NOPAT divisional',section:'s3'},
  {title:'Transfer Pricing',desc:'Pricing between divisions — goal congruence, minimum price formula, international tax',tags:'transfer pricing divisional goal congruence international tax arm length',section:'s4'},
  {title:'TQM — Total Quality Management',desc:'Quality philosophy — zero defects, customer focus, prevention',tags:'tqm total quality management zero defects prevention',section:'s5'},
  {title:'Kaizen',desc:'Continuous improvement — small incremental changes, kaizen costing',tags:'kaizen continuous improvement kaizen costing',section:'s5'},
  {title:'Lean',desc:'Eliminate waste — 7 wastes (TIMWOOD), value stream mapping',tags:'lean waste timwood value stream',section:'s5'},
  {title:'Six Sigma',desc:'Defect elimination — DMAIC methodology, 3.4 defects per million',tags:'six sigma dmaic defects quality',section:'s5'},
  {title:'JIT — Just in Time',desc:'Zero inventory — produce/receive exactly when needed',tags:'jit just in time inventory lean',section:'s5'},
  {title:'Cost of Quality',desc:'Prevention, Appraisal, Internal Failure, External Failure costs',tags:'cost quality prevention appraisal failure external internal',section:'s5'},
  {title:'Benchmarking',desc:'Internal, Competitive, Functional, Process benchmarking types',tags:'benchmarking internal competitive functional process best practice',section:'s5'},
  {title:'Beyond Budgeting',desc:'Abandon annual budgets — relative targets, rolling forecasts, decentralisation',tags:'beyond budgeting hope fraser rolling decentralised',section:'s6'},
  {title:'Rolling Budgets',desc:'Continuously updated forecasts — always 12 months ahead',tags:'rolling budget forecast continuous',section:'s6'},
  {title:'ABB — Activity Based Budgeting',desc:'Budget by activity drivers — linked to ABC costing',tags:'abb activity based budgeting abc',section:'s6'},
  {title:'ZBB — Zero Based Budgeting',desc:'Start from zero — justify all spending each period',tags:'zbb zero based budgeting justify public sector',section:'s6'},
  {title:'ABC — Activity Based Costing',desc:'Trace overheads to activities and cost drivers — more accurate product costs',tags:'abc activity based costing overhead cost driver',section:'s7'},
  {title:'Target Costing',desc:'Market price minus desired profit = cost target. Close cost gap through value engineering.',tags:'target costing market price value engineering cost gap',section:'s7'},
  {title:'Lifecycle Costing',desc:'Total cost over entire product life — R&D through disposal',tags:'lifecycle costing product life total cost disposal',section:'s7'},
  {title:'Throughput Accounting',desc:'Theory of constraints — maximise throughput through bottleneck. TPAR ratio.',tags:'throughput accounting theory constraints bottleneck tpar',section:'s7'},
  {title:'Big Data',desc:'5 Vs — Volume, Velocity, Variety, Veracity, Value. Analytics for performance management.',tags:'big data 5v analytics digital performance',section:'s8'},
  {title:'Predictive Analytics',desc:'Descriptive, Diagnostic, Predictive, Prescriptive analytics types',tags:'predictive analytics descriptive diagnostic prescriptive',section:'s8'},
  {title:'AI in Performance Management',desc:'AI applications — dashboards, anomaly detection, forecasting, risks',tags:'AI artificial intelligence performance management dashboard',section:'s8'},
  {title:'Cybersecurity KPIs',desc:'Security performance measures — MTTR, incident rates, patch compliance',tags:'cybersecurity kpi performance digital security',section:'s8'},
  {title:'Agency Theory',desc:'Principal-agent conflicts — aligning manager and shareholder interests through rewards',tags:'agency theory principal agent conflict reward',section:'s9'},
  {title:'Gaming & KPI Manipulation',desc:"Goodhart's Law — when measures become targets they cease to be good measures",tags:'gaming kpi manipulation goodhart dysfunctional',section:'s9'},
  {title:'Budgetary Slack',desc:'Managers underestimate revenue/overestimate costs to create easy targets',tags:'budgetary slack budget manipulation short termism',section:'s9'},
  {title:'Short-termism',desc:'Sacrificing long-term value for short-term metric performance',tags:'short termism long term sacrifice performance',section:'s9'},
  {title:'Sensitivity Analysis',desc:'How much can a variable change before the decision changes?',tags:'sensitivity analysis risk uncertainty variable',section:'s10'},
  {title:'Scenario Planning',desc:'Multiple futures — optimistic, base, pessimistic scenarios for performance',tags:'scenario planning risk uncertainty future',section:'s10'},
  {title:'Value for Money (3Es)',desc:'Economy, Efficiency, Effectiveness — NFP and public sector performance',tags:'value money vfm 3es economy efficiency effectiveness public sector NFP',section:'s11'},
  {title:'ESG & Sustainability',desc:'Environmental, Social, Governance performance — sustainability KPIs',tags:'ESG sustainability CSR environmental social governance',section:'s12'},
  {title:'Integrated Reporting',desc:'6 Capitals framework — financial and non-financial value creation',tags:'integrated reporting IR 6 capitals IIRC value',section:'s12'},
  {title:'Ethics in Performance Management',desc:'KPI manipulation, ethical reporting, professional skills marks',tags:'ethics kpi manipulation reporting professional skills',section:'s13'},
  {title:'APM Exam Technique',desc:'Answer structure, command verbs, time management, scoring 50+',tags:'exam technique command verbs answer structure time management pass',section:'s14'},
];

const searchInput=document.getElementById('search-input');
const searchResults=document.getElementById('search-results');

function jumpSearch(term){
  searchInput.value=term;
  performSearch(term);
  searchInput.focus();
}

searchInput.addEventListener('input',function(){
  performSearch(this.value);
});

searchInput.addEventListener('keydown',function(e){
  if(e.key==='Escape'){clearSearch();}
});

function performSearch(query){
  const q=query.toLowerCase().trim();
  if(!q){clearSearch();return;}
  const results=searchData.filter(item=>{
    return item.title.toLowerCase().includes(q)||
           item.desc.toLowerCase().includes(q)||
           item.tags.toLowerCase().includes(q);
  }).slice(0,8);
  
  if(results.length===0){
    searchResults.innerHTML='<div class="sr-item"><h5>No results found</h5><p>Try: BSC, EVA, Transfer Pricing, Kaizen…</p></div>';
  } else {
    searchResults.innerHTML=results.map(r=>`
      <div class="sr-item" onclick="navigateToSection('${r.section}');clearSearch();">
        <h5>${r.title}</h5>
        <p>${r.desc.substring(0,80)}…</p>
        <span class="sr-tag">${r.section.toUpperCase()}</span>
      </div>
    `).join('');
  }
  searchResults.classList.add('open');
}

function clearSearch(){
  searchResults.classList.remove('open');
  searchResults.innerHTML='';
}

function navigateToSection(sectionId){
  const el=document.getElementById(sectionId);
  if(el){
    el.scrollIntoView({behavior:'smooth',block:'start'});
    // Open first accordion in that section
    const firstAcc=el.querySelector('.acc');
    if(firstAcc&&!firstAcc.classList.contains('open')){
      firstAcc.classList.add('open');
    }
  }
}

document.addEventListener('click',function(e){
  if(!searchResults.contains(e.target)&&e.target!==searchInput){
    clearSearch();
  }
});

// ── PROGRESS BAR ──
window.addEventListener('scroll',function(){
  const scrollTop=window.scrollY;
  const docHeight=document.documentElement.scrollHeight-window.innerHeight;
  const progress=(scrollTop/docHeight)*100;
  document.getElementById('progress-fill').style.width=progress+'%';
  
  // Update nav active state
  const sections=document.querySelectorAll('.section[id]');
  let current='';
  sections.forEach(s=>{
    const sTop=s.offsetTop-80;
    if(scrollTop>=sTop) current=s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.classList.remove('active');
    if(a.getAttribute('href')==='#'+current) a.classList.add('active');
  });
});

// ── MODALS ──
const modalContent={
  crash:{
    title:'⚡ Exam Day Crash Notes',
    body:`
      <div class="callout callout-gold"><strong>The 5 Things to Remember</strong></div>
      <ol class="styled" style="list-style:decimal;padding-left:20px;margin-top:12px">
        <li style="font-size:.85rem;color:var(--text2);margin-bottom:12px"><strong>SCENARIO first, model second.</strong> Don't decide what model to use before reading. Read the scenario and let the CONTEXT tell you which model applies.</li>
        <li style="font-size:.85rem;color:var(--text2);margin-bottom:12px"><strong>Every point needs application.</strong> No generic theory. Reference the company name, the specific data, the specific industry.</li>
        <li style="font-size:.85rem;color:var(--text2);margin-bottom:12px"><strong>Non-financial matters.</strong> If you only talk about profit and ROI in APM, you're leaving marks on the table. Always consider quality, customer, people, sustainability.</li>
        <li style="font-size:.85rem;color:var(--text2);margin-bottom:12px"><strong>SMART KPIs always.</strong> Never say "improve customer satisfaction." Always say "achieve NPS of +40 by December 2025."</li>
        <li style="font-size:.85rem;color:var(--text2);margin-bottom:12px"><strong>Time management is survival.</strong> 1.95 mins per mark. Stick to it. Move on even if answer is incomplete. Blank = 0. Anything = possible marks.</li>
      </ol>
      <div class="callout callout-trap" style="margin-top:16px"><strong>⚠️ Most Dangerous Trap Today:</strong> Reading time is for PLANNING. Use it. Plan your Section A answer before you start writing. 5 minutes planning saves 15 minutes of confusion.</div>
    `
  },
  commands:{
    title:'🎯 APM Command Verbs',
    body:`
      <div class="cv-grid">
        <div class="cv-card"><div class="cv-verb">Evaluate</div><div class="cv-desc">Weigh up. Pros AND cons. Make a judgment. Need depth from BOTH sides.</div><div class="cv-depth">Depth: Highest</div></div>
        <div class="cv-card"><div class="cv-verb">Assess</div><div class="cv-desc">Consider strengths and weaknesses. Similar to evaluate but sometimes slightly less formal.</div><div class="cv-depth">Depth: High</div></div>
        <div class="cv-card"><div class="cv-verb">Advise</div><div class="cv-desc">Give actionable recommendation with reasoning. Write as a consultant.</div><div class="cv-depth">Depth: Practical</div></div>
        <div class="cv-card"><div class="cv-verb">Discuss</div><div class="cv-desc">Consider multiple perspectives. Show you understand complexity. Generally should conclude.</div><div class="cv-depth">Depth: High</div></div>
        <div class="cv-card"><div class="cv-verb">Recommend</div><div class="cv-desc">Clear, decisive recommendation. Say WHAT and WHY clearly.</div><div class="cv-depth">Depth: Decisive</div></div>
        <div class="cv-card"><div class="cv-verb">Explain</div><div class="cv-desc">Make something clear. WHY does this happen? What does it mean? Link to scenario.</div><div class="cv-depth">Depth: Medium</div></div>
        <div class="cv-card"><div class="cv-verb">Identify</div><div class="cv-desc">Spot and name. Still needs brief justification in APM context.</div><div class="cv-depth">Depth: Lower</div></div>
        <div class="cv-card"><div class="cv-verb">Calculate</div><div class="cv-desc">Numbers with workings, labels, units. ALWAYS comment on what the number means.</div><div class="cv-depth">Depth: Numerical</div></div>
      </div>
    `
  },
  tested:{
    title:'🔥 Most Tested APM Topics',
    body:`
      <p class="body">Based on ACCA examiner reports and past exam frequency:</p>
      <table class="tbl">
        <thead><tr><th>Rank</th><th>Topic</th><th>Frequency</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Balanced Scorecard (design, evaluate, critique)</td><td style="color:var(--accent5)">⬛⬛⬛⬛⬛ Very High</td></tr>
          <tr><td>2</td><td>KPI Design with SMART Targets</td><td style="color:var(--accent5)">⬛⬛⬛⬛⬛ Very High</td></tr>
          <tr><td>3</td><td>ROI, RI & EVA calculations + evaluation</td><td style="color:var(--accent5)">⬛⬛⬛⬛⬛ Very High</td></tr>
          <tr><td>4</td><td>Transfer Pricing (all methods + international)</td><td style="color:var(--accent4)">⬛⬛⬛⬛ High</td></tr>
          <tr><td>5</td><td>Behavioural aspects (gaming, short-termism, agency)</td><td style="color:var(--accent4)">⬛⬛⬛⬛ High</td></tr>
          <tr><td>6</td><td>Value for Money / Public Sector Performance</td><td style="color:var(--accent4)">⬛⬛⬛⬛ High</td></tr>
          <tr><td>7</td><td>Quality Management (TQM, Kaizen, Cost of Quality)</td><td style="color:var(--accent)">⬛⬛⬛ Medium-High</td></tr>
          <tr><td>8</td><td>ESG & Sustainability KPIs</td><td style="color:var(--accent)">⬛⬛⬛ Growing Fast</td></tr>
          <tr><td>9</td><td>Fitzgerald & Moon Building Block</td><td style="color:var(--accent)">⬛⬛⬛ Medium</td></tr>
          <tr><td>10</td><td>Strategic Analysis (PESTEL, Porter, Value Chain)</td><td style="color:var(--accent)">⬛⬛⬛ Medium</td></tr>
        </tbody>
      </table>
    `
  },
  traps:{
    title:'⚠️ High-Risk Exam Traps',
    body:`
      <div class="callout callout-trap"><strong>TRAP 1: Generic Theory Dumps</strong><br>Writing a textbook definition of BSC with no reference to the specific company in the scenario. Scores near zero in APM.</div>
      <div class="callout callout-trap"><strong>TRAP 2: ROI Goal Incongruence</strong><br>Forgetting to explain WHY a divisional manager would reject a project that adds value to the company. The ROI vs RI vs EVA comparison question ALWAYS needs this explanation.</div>
      <div class="callout callout-trap"><strong>TRAP 3: Transfer Price Without Opportunity Cost</strong><br>When the supplying division is AT FULL CAPACITY, the minimum transfer price MUST include the opportunity cost of lost external sales. Forgetting this loses calculation AND discussion marks.</div>
      <div class="callout callout-trap"><strong>TRAP 4: VFM Economy vs Efficiency Mix-up</strong><br>Economy = getting inputs cheaply. Efficiency = using inputs productively. Many students mix these up under exam pressure. Remember: Economy → buying, Efficiency → using.</div>
      <div class="callout callout-trap"><strong>TRAP 5: Non-SMART KPIs</strong><br>"Improve customer satisfaction" = 0 application marks. "Achieve NPS of +40 within 18 months" = full application marks. Always SMART.</div>
      <div class="callout callout-trap"><strong>TRAP 6: Ignoring Professional Skills Marks</strong><br>APM has professional skills marks. Write professionally (not as a student doing an exam). Address the reader (management/board). Be commercially aware. Avoid academic language.</div>
      <div class="callout callout-trap"><strong>TRAP 7: Describing Models Not Applying Them</strong><br>"The value chain has primary and support activities" tells the examiner you've memorised the textbook. "In [Company X]'s case, competitive advantage lies in the operations activity as evidenced by its industry-leading turnaround times" applies the model.</div>
    `
  },
  'model-select':{
    title:'🧭 Which Model Should I Use?',
    body:`
      <p class="body">Use this decision helper when you see the scenario:</p>
      <div class="dtree">
        <div class="dt-node q">What is the main issue in the scenario?</div>
        <div class="dt-indent">
          <div class="dt-node dt-yes">Measuring overall company/division performance → BSC, Building Block, Performance Prism</div>
          <div class="dt-node dt-yes">Divisional financial metrics → ROI, RI, EVA</div>
          <div class="dt-node dt-yes">Internal transfers between divisions → Transfer Pricing</div>
          <div class="dt-node dt-yes">Strategic positioning / competitive environment → PESTEL, Porter's 5 Forces, Value Chain, BCG, Ansoff</div>
          <div class="dt-node dt-yes">Quality problems / operational improvement → TQM, Kaizen, Lean, Six Sigma, Cost of Quality</div>
          <div class="dt-node dt-yes">Budgeting approach → Beyond Budgeting, Rolling Budgets, ZBB, ABB</div>
          <div class="dt-node dt-yes">Overhead cost accuracy → ABC Costing</div>
          <div class="dt-node dt-yes">Product pricing in competitive market → Target Costing</div>
          <div class="dt-node dt-yes">Bottleneck / production constraints → Throughput Accounting (TOC)</div>
          <div class="dt-node dt-yes">Public sector / charity → VFM (3Es), ZBB</div>
          <div class="dt-node dt-yes">Sustainability / ESG → ESG Framework, Integrated Reporting</div>
          <div class="dt-node dt-yes">Manager behaviour / rewards → Agency Theory, Gaming, Short-termism</div>
          <div class="dt-node dt-yes">Technology / data → Big Data, Analytics, AI framework</div>
          <div class="dt-node dt-yes">Stakeholder conflicts → Mendelow's Matrix, Performance Prism</div>
        </div>
      </div>
      <div class="callout callout-tip" style="margin-top:16px"><strong>💡 Tip:</strong> In a real APM question, multiple models usually apply. Pick 2-3 that are MOST RELEVANT and apply them DEEPLY rather than listing 6 models superficially.</div>
    `
  },
  scoring:{
    title:'📈 How to Score 50+ in APM',
    body:`
      <div class="callout callout-gold"><strong>The Reality About APM Pass Rates</strong><br>APM historically has a ~35-40% pass rate. Students who FAIL usually know the content — they fail on APPLICATION and TECHNIQUE. Students who PASS do the simple things consistently well.</div>
      <h4 style="font-family:'Syne',sans-serif;font-size:1rem;margin:16px 0 10px">The 5 Habits of Students Who Pass APM:</h4>
      <div style="display:grid;gap:10px">
        <div style="background:rgba(79,142,247,.06);border:1px solid rgba(79,142,247,.2);border-radius:8px;padding:12px">
          <strong style="color:var(--accent);font-size:.85rem">1. They practice APPLYING, not just reading.</strong>
          <p style="font-size:.8rem;color:var(--text2);margin-top:6px">They do past exam questions under timed conditions. They compare their answers to official ACCA answers. They identify exactly where they lost marks and why.</p>
        </div>
        <div style="background:rgba(0,212,170,.06);border:1px solid rgba(0,212,170,.2);border-radius:8px;padding:12px">
          <strong style="color:var(--accent3);font-size:.85rem">2. They read scenarios carefully and actively.</strong>
          <p style="font-size:.8rem;color:var(--text2);margin-top:6px">They underline relevant facts. They note what's wrong, what's missing, what's unusual. They treat the scenario like a real business problem, not exam text to skim.</p>
        </div>
        <div style="background:rgba(245,200,66,.06);border:1px solid rgba(245,200,66,.2);border-radius:8px;padding:12px">
          <strong style="color:var(--gold);font-size:.85rem">3. They answer the question asked.</strong>
          <p style="font-size:.8rem;color:var(--text2);margin-top:6px">They check the command verb. They structure their answer to match the requirement. They don't write a BSC essay when asked to "calculate ROI and evaluate its limitations."</p>
        </div>
        <div style="background:rgba(124,92,252,.06);border:1px solid rgba(124,92,252,.2);border-radius:8px;padding:12px">
          <strong style="color:var(--accent2);font-size:.85rem">4. They use professional language.</strong>
          <p style="font-size:.8rem;color:var(--text2);margin-top:6px">They write as if advising real senior management. "I would recommend that [Company X] implements..." not "BSC is good because..." They earn professional skills marks that weak candidates miss.</p>
        </div>
        <div style="background:rgba(247,168,79,.06);border:1px solid rgba(247,168,79,.2);border-radius:8px;padding:12px">
          <strong style="color:var(--accent4);font-size:.85rem">5. They manage time ruthlessly.</strong>
          <p style="font-size:.8rem;color:var(--text2);margin-top:6px">They never spend more than 2 mins per mark. They write brief answers on sections they know less well rather than brilliant answers on the first question and blanks on the last. Every blank = guaranteed 0.</p>
        </div>
      </div>
    `
  }
};

function openModal(type){
  const content=modalContent[type];
  if(!content) return;
  document.getElementById('modal-title').textContent=content.title;
  document.getElementById('modal-body').innerHTML=content.body;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeModal(){
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow='';
}

function closeModalOutside(e){
  if(e.target===document.getElementById('modal-overlay')) closeModal();
}

// ── KEYBOARD SHORTCUT ──
document.addEventListener('keydown',function(e){
  if(e.key==='/' && e.target.tagName!=='INPUT'){
    e.preventDefault();
    searchInput.focus();
  }
  if(e.key==='Escape') {
    closeModal();
    clearSearch();
  }
});

// screens-accounts.jsx — Accounts / Daybook: revenue, expenses, profit, GST + ledger

const { useState: useStateAc, useMemo: useMemoAc } = React;

const ACC_PERIODS = [
  { k: 'today', label: 'Today',    days: 1 },
  { k: '7d',    label: '7 days',   days: 7 },
  { k: '30d',   label: '30 days',  days: 30 },
  { k: 'all',   label: 'All',      days: 100000 },
];

function _acAgo(n){ const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-n); return d; }
function _acIso(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function _acFmt(iso){
  const [y,m,dd] = iso.split('-');
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1];
  return dd + ' ' + mon;
}

function AccountsScreen({ nav, ledger, addTxn }){
  const [period, setPeriod] = useStateAc('30d');
  const [type, setType]     = useStateAc('all');   // all | in | out
  const [q, setQ]           = useStateAc('');
  const [adding, setAdding] = useStateAc(false);

  const pdef = ACC_PERIODS.find(p => p.k === period);
  const startISO    = _acIso(_acAgo(pdef.days - 1));
  const prevStartISO = _acIso(_acAgo(pdef.days*2 - 1));
  const prevEndISO   = _acIso(_acAgo(pdef.days));

  const inPeriod = useMemoAc(() => ledger.filter(t => t.date >= startISO), [ledger, startISO]);
  const prevPeriod = useMemoAc(() =>
    period === 'all' ? [] : ledger.filter(t => t.date >= prevStartISO && t.date <= prevEndISO),
    [ledger, prevStartISO, prevEndISO, period]);

  function sums(list){
    let rev=0, exp=0, gst=0, pendIn=0, pendOut=0;
    list.forEach(t => {
      if (t.kind === 'in'){ rev += t.amount; if (/sales|orders/i.test(t.cat)) gst += t.amount*window.GST_RATE; if (t.status==='pending') pendIn += t.amount; }
      else { exp += t.amount; if (t.status==='pending') pendOut += t.amount; }
    });
    return { rev, exp, net: rev-exp, gst: Math.round(gst), pendIn, pendOut };
  }
  const S  = useMemoAc(() => sums(inPeriod),  [inPeriod]);
  const PV = useMemoAc(() => sums(prevPeriod), [prevPeriod]);

  const delta = (cur, prev) => (period === 'all' || !prev) ? null : Math.round((cur-prev)/Math.abs(prev)*100);

  // chart buckets (daily, or weekly when the window is long)
  const buckets = useMemoAc(() => {
    let days = pdef.days === 1 ? 7 : pdef.days;     // 'Today' still shows a week of context
    if (period === 'all') days = 63;
    const weekly = days > 34;
    const out = [];
    if (weekly){
      const weeks = Math.ceil(days/7);
      for (let w = weeks-1; w >= 0; w--)
        out.push({ label: _acFmt(_acIso(_acAgo(w*7+6))), s: _acIso(_acAgo(w*7+6)), e: _acIso(_acAgo(w*7)), rev:0, exp:0 });
    } else {
      for (let i = days-1; i >= 0; i--){ const d = _acAgo(i); out.push({ label: String(d.getDate()), s: _acIso(d), e: _acIso(d), rev:0, exp:0 }); }
    }
    ledger.forEach(t => { for (const b of out){ if (t.date >= b.s && t.date <= b.e){ if (t.kind==='in') b.rev += t.amount; else b.exp += t.amount; break; } } });
    return out;
  }, [ledger, period]);
  const chartMax = Math.max(1, ...buckets.map(b => Math.max(b.rev, b.exp)));
  const labelStep = Math.ceil(buckets.length / 12);

  // expense breakdown
  const expBreak = useMemoAc(() => {
    const m = {};
    inPeriod.forEach(t => { if (t.kind==='out') m[t.cat] = (m[t.cat]||0) + t.amount; });
    return Object.entries(m).map(([cat, amt]) => ({ cat, amt })).sort((a,b) => b.amt-a.amt).slice(0,5);
  }, [inPeriod]);
  const expMax = Math.max(1, ...expBreak.map(e => e.amt));

  // ledger view
  const view = useMemoAc(() => {
    const term = q.trim().toLowerCase();
    return inPeriod.filter(t => {
      const mt = type === 'all' || t.kind === type;
      const mq = !term || t.party.toLowerCase().includes(term) || t.cat.toLowerCase().includes(term);
      return mt && mq;
    });
  }, [inPeriod, type, q]);

  const kpis = [
    { k:'rev', ic:'trendUp',   tone:'in',  label:'Revenue',        val:S.rev, d:delta(S.rev,PV.rev) },
    { k:'exp', ic:'trendDown', tone:'out', label:'Expenses',       val:S.exp, d:delta(S.exp,PV.exp), invert:true },
    { k:'net', ic:'wallet',    tone:'net', label:'Net profit',     val:S.net, d:delta(S.net,PV.net) },
    { k:'gst', ic:'receipt',   tone:'gst', label:'GST collected',  val:S.gst, sub:'5% on taxable sales' },
  ];

  return (
    <div className="screen accounts">
      <div className="inv-head">
        <div>
          <h1 className="screen-title">Accounts <span>· daybook &amp; billing</span></h1>
          <p className="screen-lead">Track sales, expenses, profit and GST for your pharmacy. Switch the period to see live totals, review every transaction, and record new income or expense entries.</p>
        </div>
        <button className="acc-switch" onClick={() => nav('inventory')}>
          <Icon name="swap" size={16} /> Inventory
        </button>
      </div>

      {/* period switch */}
      <div className="acc-periods">
        {ACC_PERIODS.map(p => (
          <button key={p.k} className={"acc-pbtn " + (period===p.k?'on':'')} onClick={() => setPeriod(p.k)}>{p.label}</button>
        ))}
        <span className="acc-prange">{period==='all' ? 'All recorded entries' : _acFmt(startISO) + ' – ' + _acFmt(_acIso(_acAgo(0)))}</span>
      </div>

      {/* KPI cards */}
      <div className="acc-kpis">
        {kpis.map(k => (
          <div className={"acc-kpi " + k.tone} key={k.k}>
            <div className="acc-kpi-top">
              <span className="acc-kpi-ic"><Icon name={k.ic} size={18} /></span>
              {k.d != null && (
                <span className={"acc-delta " + ((k.invert ? k.d<=0 : k.d>=0) ? 'good' : 'bad')}>
                  <Icon name={k.d>=0 ? 'trendUp' : 'trendDown'} size={12} />{Math.abs(k.d)}%
                </span>
              )}
            </div>
            <b className="acc-kpi-val">{money(k.val)}</b>
            <span className="acc-kpi-label">{k.label}{k.sub && <i> · {k.sub}</i>}</span>
          </div>
        ))}
      </div>

      {/* chart + breakdown */}
      <div className="acc-grid2">
        <div className="acc-panel">
          <div className="acc-panel-head">
            <h3>Revenue vs expenses</h3>
            <div className="acc-legend">
              <span><i className="lg rev"></i>Revenue</span>
              <span><i className="lg exp"></i>Expenses</span>
            </div>
          </div>
          <div className="acc-chart">
            {buckets.map((b, i) => (
              <div className="acc-bcol" key={i} title={`${b.label} · Revenue ${money(b.rev)} · Expenses ${money(b.exp)}`}>
                <div className="acc-bpair">
                  <span className="acc-bar rev" style={{ height: (b.rev/chartMax*100)+'%' }}></span>
                  <span className="acc-bar exp" style={{ height: (b.exp/chartMax*100)+'%' }}></span>
                </div>
                <span className="acc-blabel">{i % labelStep === 0 ? b.label : ''}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="acc-panel">
          <div className="acc-panel-head"><h3>Where money goes</h3></div>
          {expBreak.length === 0 ? (
            <p className="acc-muted">No expenses in this period.</p>
          ) : (
            <div className="acc-break">
              {expBreak.map(e => (
                <div className="acc-brow" key={e.cat}>
                  <div className="acc-bmeta"><span>{e.cat}</span><b>{money(e.amt)}</b></div>
                  <div className="acc-btrack"><span style={{ width: (e.amt/expMax*100)+'%' }}></span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ledger toolbar */}
      <div className="acc-ledhead">
        <h3>Transaction ledger</h3>
        <button className="acc-add" onClick={() => setAdding(a => !a)}>
          <Icon name={adding ? 'close' : 'plusCircle'} size={16} /> {adding ? 'Cancel' : 'Add entry'}
        </button>
      </div>

      {adding && <AddEntryForm onAdd={(t) => { addTxn(t); setAdding(false); }} />}

      <div className="acc-toolbar">
        <div className="acc-typeseg">
          {[['all','All'],['in','Income'],['out','Expense']].map(([k,l]) => (
            <button key={k} className={type===k?'on':''} onClick={() => setType(k)}>{l}</button>
          ))}
        </div>
        <div className="inv-search">
          <Icon name="search" size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search party or category…" />
          {q && <button className="sb-clear" onClick={() => setQ('')}><Icon name="close" size={15} /></button>}
        </div>
      </div>

      {/* ledger table */}
      <div className="acc-table">
        <div className="acc-tr acc-th">
          <span>Date</span><span>Particulars</span><span>Method</span><span>Type</span><span className="acc-c-amt">Amount</span>
        </div>
        {view.length === 0 ? (
          <div className="empty"><span className="empty-ic"><Icon name="receipt" size={28} /></span><b>No transactions</b><p>Try a different period, type or search.</p></div>
        ) : view.map(t => (
          <div className="acc-tr acc-row" key={t.id}>
            <span className="acc-c-date">{_acFmt(t.date)}</span>
            <span className="acc-c-part">
              <b>{t.party}</b>
              <i>{t.cat}{t.status==='pending' && <em className="acc-pend">Pending</em>}</i>
            </span>
            <span className="acc-c-meth"><span className="acc-meth">{t.method}</span></span>
            <span className="acc-c-type"><span className={"acc-type " + t.kind}>{t.kind==='in'?'Income':'Expense'}</span></span>
            <span className={"acc-c-amt acc-amt " + t.kind}>{t.kind==='in'?'+':'−'}{money(t.amount)}</span>
          </div>
        ))}
      </div>

      <div className="demo-note">
        <Icon name="shield" size={14} /> Demo accounts · sample figures · entries you add are kept for this session
      </div>
    </div>
  );
}

function AddEntryForm({ onAdd }){
  const [kind, setKind]     = useStateAc('out');
  const [party, setParty]   = useStateAc('');
  const [cat, setCat]       = useStateAc('');
  const [amount, setAmount] = useStateAc('');
  const [method, setMethod] = useStateAc('UPI');
  const valid = party.trim() && cat.trim() && Number(amount) > 0;

  function submit(e){
    e.preventDefault();
    if (!valid) return;
    onAdd({ kind, party: party.trim(), cat: cat.trim(), amount: Math.round(Number(amount)), method });
  }

  return (
    <form className="acc-form" onSubmit={submit}>
      <div className="acc-form-kind">
        {[['out','Expense'],['in','Income']].map(([k,l]) => (
          <button type="button" key={k} className={kind===k?'on '+k:''} onClick={() => setKind(k)}>{l}</button>
        ))}
      </div>
      <div className="acc-form-grid">
        <label><span>Party / paid to</span><input value={party} onChange={e=>setParty(e.target.value)} placeholder={kind==='in'?'e.g. Walk-in customers':'e.g. Sun Pharma Depot'} /></label>
        <label><span>Category</span><input value={cat} onChange={e=>setCat(e.target.value)} placeholder={kind==='in'?'e.g. Counter sales':'e.g. Stock purchase'} /></label>
        <label><span>Amount (₹)</span><input type="text" inputMode="numeric" value={amount} onChange={e=>setAmount(e.target.value.replace(/[^\d]/g,''))} placeholder="0" /></label>
        <label><span>Method</span>
          <select value={method} onChange={e=>setMethod(e.target.value)}>
            <option>UPI</option><option>Cash</option><option>Card</option><option>Bank</option>
          </select>
        </label>
      </div>
      <button type="submit" className="acc-form-save" disabled={!valid}>Save {kind==='in'?'income':'expense'} entry</button>
    </form>
  );
}

Object.assign(window, { AccountsScreen });

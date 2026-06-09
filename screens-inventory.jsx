// screens-inventory.jsx — Inventory admin: maintain stock levels per product

const { useState: useStateI, useMemo: useMemoI } = React;

function InventoryScreen({ nav, products, stock, setStockFor, adjustStock }) {
  const [filter, setFilter] = useStateI('all');   // all | low | out | in
  const [q, setQ] = useStateI('');

  const rows = useMemoI(() => products.map(p => {
    const s = stock[p.id] ?? 0;
    return { p, s, info: window.stockInfo(s) };
  }), [products, stock]);

  const counts = useMemoI(() => {
    const c = { all: rows.length, in: 0, low: 0, out: 0 };
    rows.forEach(r => { c[r.info.level]++; });
    return c;
  }, [rows]);

  const stockValue = useMemoI(() =>
    rows.reduce((sum, r) => sum + r.s * r.p.price, 0), [rows]);

  const view = useMemoI(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(r => {
      const matchF = filter === 'all' || r.info.level === filter;
      const matchQ = !term || r.p.name.toLowerCase().includes(term)
        || r.p.brand.toLowerCase().includes(term);
      return matchF && matchQ;
    });
  }, [rows, filter, q]);

  const stats = [
    { k: 'all', ic: 'box',    label: 'Total SKUs',   val: counts.all,  tone: 'neutral' },
    { k: 'in',  ic: 'check',  label: 'In stock',     val: counts.in,   tone: 'in'  },
    { k: 'low', ic: 'tag',    label: 'Low in stock', val: counts.low,  tone: 'low' },
    { k: 'out', ic: 'close',  label: 'Out of stock', val: counts.out,  tone: 'out' },
  ];

  return (
    <div className="screen inventory">
      <div className="inv-head">
        <div>
          <h1 className="screen-title">Inventory <span>· stock management</span></h1>
          <p className="screen-lead">Maintain on-hand quantities for every product. Items under {window.LOW_STOCK} units are flagged <b>Low in stock</b>; zero units show as <b>Out of stock</b> across the store.</p>
        </div>
        <div className="inv-stockval">
          <span>Stock value (at selling price)</span>
          <b>{money(stockValue)}</b>
          <button className="acc-switch sm" onClick={() => nav('accounts')}><Icon name="swap" size={14} /> Accounts</button>
        </div>
      </div>

      {/* stat / filter tiles */}
      <div className="inv-stats">
        {stats.map(s => (
          <button key={s.k} className={"inv-stat " + s.tone + (filter===s.k?' on':'')}
            onClick={() => setFilter(s.k)}>
            <span className="inv-stat-ic"><Icon name={s.ic} size={18} /></span>
            <span className="inv-stat-meta">
              <b>{s.val}</b>
              <i>{s.label}</i>
            </span>
          </button>
        ))}
      </div>

      {/* search + active filter */}
      <div className="inv-toolbar">
        <div className="inv-search">
          <Icon name="search" size={18} />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by product or brand…" />
          {q && <button className="sb-clear" onClick={()=>setQ('')}><Icon name="close" size={15} /></button>}
        </div>
        {filter !== 'all' && (
          <button className="inv-clearfilter" onClick={()=>setFilter('all')}>
            Showing {filter==='out'?'out of stock':filter==='low'?'low in stock':'in stock'} · clear <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {/* table */}
      <div className="inv-table">
        <div className="inv-tr inv-th">
          <span className="inv-c-prod">Product</span>
          <span className="inv-c-cat">Category</span>
          <span className="inv-c-price">Price</span>
          <span className="inv-c-status">Status</span>
          <span className="inv-c-stock">On hand</span>
        </div>

        {view.length === 0 ? (
          <div className="empty"><span className="empty-ic"><Icon name="box" size={28} /></span><b>No products match</b><p>Try a different search or filter.</p></div>
        ) : view.map(({ p, s, info }) => {
          const cat = window.CATEGORIES.find(c => c.id === p.cat);
          return (
            <div className={"inv-tr inv-row level-" + info.level} key={p.id}>
              <span className="inv-c-prod">
                <span className="inv-thumb"><Thumb product={p} /></span>
                <span className="inv-prod-meta">
                  <b onClick={() => nav('product', { id: p.id })}>{p.name}</b>
                  <i>{p.brand} · {p.pack}{p.rx ? ' · Rx' : ''}</i>
                </span>
              </span>
              <span className="inv-c-cat"><span className="inv-catchip" style={{
                background:`oklch(0.95 0.045 ${cat?cat.tint:162})`, color:`oklch(0.45 0.12 ${cat?cat.tint:162})` }}>{cat ? cat.name : p.cat}</span></span>
              <span className="inv-c-price">{money(p.price)}</span>
              <span className="inv-c-status">
                <span className={"stock-badge " + info.level}><i className="sb-dot"></i>{info.label}</span>
              </span>
              <span className="inv-c-stock">
                <span className="inv-stepper">
                  <button onClick={() => adjustStock(p.id, -1)} disabled={s<=0} aria-label="decrease">−</button>
                  <input type="text" inputMode="numeric" value={s}
                    onChange={e => setStockFor(p.id, e.target.value.replace(/\D/g,''))} />
                  <button onClick={() => adjustStock(p.id, 1)} aria-label="increase">+</button>
                </span>
                <button className="inv-restock" onClick={() => adjustStock(p.id, 50)}>+50</button>
              </span>
            </div>
          );
        })}
      </div>

      <div className="demo-note">
        <Icon name="shield" size={14} /> Demo inventory · changes are kept for this session and reflect live across the store
      </div>
    </div>
  );
}

Object.assign(window, { InventoryScreen });

// ui.jsx — shared components, icons, logo for Vedant Medicals

const { useState, useRef, useEffect } = React;

// ---------- icons (single-stroke, currentColor) ----------
const ICONS = {
  pill: 'M10.5 13.5l3-3M8 13a3.5 3.5 0 010-5l2-2a3.5 3.5 0 015 5l-2 2a3.5 3.5 0 01-5 0z',
  droplet: 'M12 3s5 5.5 5 9a5 5 0 01-10 0c0-3.5 5-9 5-9z',
  leaf: 'M5 19c7 1 13-4 13-13 0 0-12-2-13 7-.3 2.6 0 6 0 6zm0 0l7-7',
  drop: 'M12 3s5 5.5 5 9a5 5 0 01-10 0c0-3.5 5-9 5-9zM9.5 12.5l2 2 3-3',
  heart: 'M12 20s-7-4.5-7-9.5A3.5 3.5 0 0112 8a3.5 3.5 0 017 2.5c0 5-7 9.5-7 9.5z',
  bottle: 'M9 3h6M10 3v3M14 3v3M9 6h6a2 2 0 012 2v11a2 2 0 01-2 2H9a2 2 0 01-2-2V8a2 2 0 012-2zM8 13h8',
  tube: 'M7 8h10M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M8 8h8v11a2 2 0 01-2 2h-4a2 2 0 01-2-2V8z',
  baby: 'M12 11a3 3 0 100-6 3 3 0 000 6zM6 21v-1a4 4 0 014-4h4a4 4 0 014 4v1M9 8.5c1.5 1 4.5 1 6 0',
  plus: 'M12 7v10M7 12h10',
  spark: 'M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  cart: 'M3 4h2l2.4 12.2A2 2 0 009.4 18H18a2 2 0 002-1.8L21 8H6M9 22a1 1 0 100-2 1 1 0 000 2zM18 22a1 1 0 100-2 1 1 0 000 2z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM5 21a7 7 0 0114 0',
  home: 'M4 11l8-7 8 7M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9',
  rx: 'M7 20V8a3 3 0 013-3h0a3 3 0 013 3c0 2-1.5 3-3 3H7m4 0l5 6m1-6l-6 6',
  upload: 'M12 16V6m0 0l-3.5 3.5M12 6l3.5 3.5M5 18h14',
  back: 'M15 19l-7-7 7-7',
  chevron: 'M9 6l6 6-6 6',
  star: 'M12 4l2.3 4.7 5.2.8-3.8 3.6.9 5.1L12 16.6 7.4 18.8l.9-5.1L4.5 9.5l5.2-.8L12 4z',
  truck: 'M3 7h11v8H3zM14 10h4l3 3v2h-7M7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  shield: 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zM9 12l2 2 4-4',
  pin: 'M12 21s6-5 6-10a6 6 0 10-12 0c0 5 6 10 6 10zM12 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  check: 'M5 13l4 4L19 7',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  close: 'M6 6l12 12M18 6L6 18',
  filter: 'M4 6h16M7 12h10M10 18h4',
  trash: 'M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13',
  tag: 'M3 12l9-9 9 9-9 9-9-9zM12 7v0',
  box: 'M3 8l9-5 9 5-9 5-9-5zM3 8v8l9 5 9-5V8M12 13v8',
  trendUp: 'M4 17l6-6 4 4 6-7M16 8h4v4',
  trendDown: 'M4 7l6 6 4-4 6 7M16 16h4v-4',
  wallet: 'M3 8h15a1 1 0 011 1v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 8V7a2 2 0 012-2h11M17 13h.5',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  chart: 'M5 20v-6M10 20V8M15 20v-9M20 20v-4M3 20h18',
  plusCircle: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 8.5v7M8.5 12h7',
  swap: 'M7 4L3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
};

function Icon({ name, size = 22, stroke = 2, fill = false, style }) {
  const d = ICONS[name] || ICONS.spark;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
      strokeLinejoin="round" style={style} aria-hidden="true">
      {d.split('M').filter(Boolean).map((seg, i) => (
        <path key={i} d={'M' + seg} fill={fill ? 'currentColor' : 'none'} />
      ))}
    </svg>
  );
}

// ---------- logo ----------
function Logo({ size = 30, withText = true }) {
  return (
    <div className="logo">
      <span className="logo-mark" style={{ width: size, height: size }}>
        <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
          <path d="M20 35C15.6 29.2 3.5 24 3.5 14.2 3.5 8.9 7.6 5.6 11.8 6.1 15.4 6.5 18.4 9.6 20 13.2c1.6-3.6 4.6-6.7 8.2-7.1 4.2-.5 8.3 2.8 8.3 8.1C36.5 24 24.4 29.2 20 35z"
            fill="var(--logo)"/>
          <path d="M7.5 19.4h5l2.6-5.2 3.8 10 2.8-5.2h8.3"
            fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {withText && (
        <span className="logo-text">
          <b>Vedant</b><span>Medicals</span>
        </span>
      )}
    </div>
  );
}

// ---------- helpers ----------
function money(n){ return '₹' + Number(n).toLocaleString('en-IN'); }

function Stars({ value = 4.5, reviews }) {
  return (
    <span className="stars">
      <Icon name="star" size={13} fill stroke={0} />
      <b>{value.toFixed(1)}</b>
      {reviews != null && <i>({reviews.toLocaleString('en-IN')})</i>}
    </span>
  );
}

function Pill({ children, tone = "brand", soft = true }) {
  return <span className={"vpill " + tone + (soft ? " soft" : "")}>{children}</span>;
}

function Btn({ children, kind = "primary", block, sm, onClick, type, disabled, style }) {
  const cls = ["btn", kind, block ? "block" : "", sm ? "sm" : ""].join(" ").trim();
  return (
    <button className={cls} onClick={onClick} type={type || "button"} disabled={disabled} style={style}>
      {children}
    </button>
  );
}

// product thumbnail — tinted tile with category icon + faux package
function Thumb({ product, size = "md" }) {
  const cat = (window.CATEGORIES || []).find(c => c.id === product.cat) || { icon: "pill", tint: 162 };
  // Standardised tile: near-neutral background with a whisper of category hue,
  // icon in the brand green. Calm, consistent, premium — not rainbow.
  return (
    <div className={"thumb " + size} style={{ "--tint": cat.tint }}>
      <div className="thumb-pack">
        <Icon name={cat.icon} size={size === "lg" ? 46 : 30} stroke={1.8} />
      </div>
      {product.rx && <span className="thumb-rx"><Icon name="rx" size={13} stroke={2.2} />Rx</span>}
    </div>
  );
}

// quantity stepper / add button
function QtyControl({ qty, onAdd, onInc, onDec, sm, disabled }) {
  if (!qty) {
    return <Btn kind="add" sm={sm} onClick={onAdd} disabled={disabled}>Add</Btn>;
  }
  return (
    <div className={"qty " + (sm ? "sm" : "")}>
      <button onClick={onDec} aria-label="decrease">−</button>
      <span>{qty}</span>
      <button onClick={onInc} aria-label="increase">+</button>
    </div>
  );
}

// stock status badge — driven by stockInfo() in data.jsx
function StockBadge({ stock, className = "" }) {
  const info = window.stockInfo(stock);
  if (info.level === "in") return null;
  return (
    <span className={"stock-badge " + info.level + " " + className}>
      <i className="sb-dot"></i>
      {info.level === "low" ? `Low in stock · ${stock} left` : "Out of stock"}
    </span>
  );
}

// product card (grid + list aware via parent class)
function ProductCard({ product, qty, stock, onOpen, onAdd, onInc, onDec }) {
  const off = Math.round((1 - product.price / product.mrp) * 100);
  const avail = stock == null ? product.stock : stock;
  const info = window.stockInfo(avail);
  const out = info.level === "out";
  return (
    <article className={"pcard" + (out ? " is-out" : "")}>
      <div className="pcard-media" onClick={onOpen}>
        <Thumb product={product} />
        {off > 0 && <span className="pcard-off">{off}% off</span>}
        {info.level !== "in" && <StockBadge stock={avail} className="on-thumb" />}
      </div>
      <div className="pcard-body">
        <div className="pcard-brand">{product.brand}</div>
        <h3 className="pcard-name" onClick={onOpen}>{product.name}</h3>
        <div className="pcard-pack">{product.pack}</div>
        <div className="pcard-foot">
          <div className="pcard-price">
            <b>{money(product.price)}</b>
            {off > 0 && <s>{money(product.mrp)}</s>}
          </div>
          {out
            ? <span className="oos-tag">Sold out</span>
            : <QtyControl qty={qty} sm onAdd={onAdd} onInc={onInc} onDec={onDec} />}
        </div>
      </div>
    </article>
  );
}

// shop-by-category mega-menu dropdown (sits under the search bar)
function CategoryBar({ onBrowse }) {
  const [open, setOpen] = useState(null);
  const isDesktop = () => window.matchMedia('(min-width:861px)').matches;
  const close = () => setOpen(null);
  const dept = window.DEPARTMENTS.find(d => d.id === open);
  function go(link){ onBrowse({ cat: link.cat, q: link.q }); close(); }

  return (
    <div className="catbar" onMouseLeave={() => { if (isDesktop()) close(); }}>
      <div className="catbar-inner">
        <span className="catbar-lead"><Icon name="filter" size={15} /> Shop by category</span>
        <div className="catbar-deps">
          {window.DEPARTMENTS.map(d => (
            <button key={d.id} className={"dep " + (open===d.id ? 'on' : '')}
              onMouseEnter={() => { if (isDesktop()) setOpen(d.id); }}
              onClick={() => setOpen(open===d.id ? null : d.id)}>
              <span className="dep-ic"><Icon name={d.icon} size={16} stroke={1.9} /></span>
              {d.name}
              <Icon name="chevron" size={13} style={{ transform:`rotate(${open===d.id?'-90':'90'}deg)`, opacity:.5, transition:'transform .2s' }} />
            </button>
          ))}
        </div>
      </div>

      {dept && <div className="catbar-scrim" onClick={close}></div>}
      {dept && (
        <div className="catpanel" onMouseLeave={() => { if (isDesktop()) close(); }}>
          <div className="catpanel-inner">
            {dept.cols.map((col, i) => {
              const sections = col.sections || [{ title: col.title, links: col.links }];
              return (
                <div className={"catcol" + (col.tint ? " tint" : "")} key={i}>
                  {sections.map((s, si) => (
                    <div className="catsec" key={si}>
                      {(s.cat || s.q)
                        ? <button className="catsec-head" onClick={() => go(s)}>{s.title}</button>
                        : <h4>{s.title}</h4>}
                      {(s.links || []).map((l, j) => (
                        <button key={j} className="catlink" onClick={() => go(l)}>{l.label}</button>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
            {dept.cols.length < 3 && (
              <div className="catcol cat-promo">
                <div className="catpromo-card">
                  <span className="catpromo-ic"><Icon name={dept.icon} size={24} stroke={1.8} /></span>
                  <b>{dept.name}</b>
                  <span>Genuine products · doorstep delivery.</span>
                  <button className="link-btn" onClick={() => { onBrowse({}); close(); }}>Browse everything <Icon name="chevron" size={14} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Icon, Logo, money, Stars, Pill, Btn, Thumb, QtyControl, ProductCard, StockBadge, CategoryBar });

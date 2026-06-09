// app.jsx — Vedant Medicals: router, global state, chrome (header + bottom nav)

const { useState: useApp, useRef: useAppRef, useEffect: useAppEffect, useMemo: useAppMemo } = React;

function VedantApp() {
  const [stack, setStack] = useApp([{ screen: 'home', params: {} }]);
  const cur = stack[stack.length - 1];
  const [cart, setCart] = useApp([]);            // [{id, qty}]
  const [stock, setStock] = useApp(() => {       // live inventory: { id: units }
    const m = {}; window.PRODUCTS.forEach(p => { m[p.id] = p.stock; }); return m;
  });
  const [ledger, setLedger] = useApp(() => window.LEDGER);  // accounts / daybook
  const [query, setQuery] = useApp('');          // search query (persists)
  const [user, setUser] = useApp(null);
  const [authOpen, setAuthOpen] = useApp(false);
  const [rxFile, setRxFile] = useApp(null);
  const [order, setOrder] = useApp(null);
  const [toast, setToast] = useApp(null);
  const pendingRef = useAppRef(null);
  const searchRef = useAppRef(null);
  const scrollRef = useAppRef(null);

  // ---- navigation ----
  function nav(screen, params = {}) {
    setStack(s => [...s, { screen, params }]);
  }
  function back() { setStack(s => s.length > 1 ? s.slice(0, -1) : s); }
  function go(screen, params = {}) { setStack([{ screen, params }]); }

  useAppEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [stack.length, cur.screen]);

  // ---- inventory ops ----
  const stockOf = (id) => stock[id] ?? 0;
  const setStockFor = (id, n) => setStock(s => ({ ...s, [id]: Math.max(0, Math.round(Number(n) || 0)) }));
  const adjustStock = (id, d) => setStock(s => ({ ...s, [id]: Math.max(0, (s[id] || 0) + d) }));

  // ---- cart ops (respect available stock) ----
  const qtyOf = (id) => { const it = cart.find(c => c.id === id); return it ? it.qty : 0; };
  function addItem(id) {
    const avail = stockOf(id);
    const p = window.PRODUCTS.find(x => x.id === id);
    if (avail <= 0) { showToast(`${p ? p.name : 'Item'} is out of stock`); return false; }
    if (qtyOf(id) >= avail) { showToast(`Only ${avail} left in stock`); return false; }
    setCart(c => c.find(x => x.id === id) ? c.map(x => x.id===id?{...x,qty:x.qty+1}:x) : [...c, { id, qty: 1 }]);
    showToast(`${p ? p.name : 'Item'} added to cart`);
    return true;
  }
  const incItem = (id) => {
    const avail = stockOf(id);
    if (qtyOf(id) >= avail) { showToast(`Only ${avail} left in stock`); return; }
    setCart(c => c.map(x => x.id===id?{...x,qty:x.qty+1}:x));
  };
  const decItem = (id) => setCart(c => c.flatMap(x => x.id===id ? (x.qty>1?[{...x,qty:x.qty-1}]:[]) : [x]));
  const removeItem = (id) => setCart(c => c.filter(x => x.id !== id));
  const cartCount = cart.reduce((s,x) => s + x.qty, 0);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(null), 1800);
  }

  // ---- auth gate ----
  function requireAuth(fn) {
    if (user) { fn(); } else { pendingRef.current = fn; setAuthOpen(true); }
  }
  function handleLogin(phone) {
    setUser({ phone }); setAuthOpen(false);
    showToast('Logged in successfully');
    if (pendingRef.current) { const fn = pendingRef.current; pendingRef.current = null; setTimeout(fn, 60); }
  }

  function placeOrder(summary) {
    const id = 'VM' + (2000 + Math.floor(Math.random()*7000));
    setOrder({ ...summary, id });
    setCart([]);
    go('order');
  }

  // ---- accounts ops ----
  function addTxn(t){
    const now = new Date();
    const date = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    const id = 'TXN' + Math.floor(10000 + Math.random()*89999);
    setLedger(L => [{ id, date, status:'settled', method:'UPI', ...t }, ...L]);
    showToast((t.kind==='in' ? 'Income' : 'Expense') + ' entry added');
  }

  // ---- shop by category ----
  function browse({ cat, q } = {}) {
    setQuery(q || '');
    nav('search', { cat: cat || 'all' });
  }

  // ---- current product ----
  const product = cur.screen === 'product'
    ? window.PRODUCTS.find(p => p.id === cur.params.id) : null;

  // ---- render screen ----
  function renderScreen() {
    const shared = { nav, addItem, incItem, decItem, qtyOf, stockOf };
    switch (cur.screen) {
      case 'home':
        return <HomeScreen {...shared} cart={cart}
          onSearchFocus={() => nav('search')} />;
      case 'search':
        return <SearchScreen {...shared} initialCat={cur.params.cat}
          query={query} setQuery={setQuery} searchRef={searchRef} />;
      case 'product':
        return <ProductScreen {...shared} product={product} />;
      case 'cart':
        return <CartScreen nav={nav} items={cart} products={window.PRODUCTS}
          incItem={incItem} decItem={decItem} removeItem={removeItem}
          user={user} requireAuth={requireAuth} />;
      case 'prescription':
        return <PrescriptionScreen nav={nav} hasUpload={rxFile}
          onUploaded={(f) => { setRxFile(f); showToast('Prescription uploaded'); }} />;
      case 'checkout':
        return <CheckoutScreen nav={nav} items={cart} products={window.PRODUCTS}
          user={user} hasUpload={rxFile} onPlaced={placeOrder} />;
      case 'order':
        return <OrderScreen nav={nav} order={order} />;
      case 'inventory':
        return <InventoryScreen nav={nav} products={window.PRODUCTS}
          stock={stock} setStockFor={setStockFor} adjustStock={adjustStock} />;
      case 'accounts':
        return <AccountsScreen nav={nav} ledger={ledger} addTxn={addTxn} />;
      default:
        return <HomeScreen {...shared} cart={cart} onSearchFocus={() => nav('search')} />;
    }
  }

  const showBackHeader = cur.screen !== 'home';

  return (
    <div className="app">
      {/* ---------- HEADER ---------- */}
      <header className="topbar">
        <div className="topbar-inner">
          {showBackHeader
            ? <button className="iconbtn back" onClick={back} aria-label="Back"><Icon name="back" size={20} /></button>
            : null}
          <button className="brand-btn" onClick={() => go('home')}>
            <Logo size={38} />
          </button>

          <button className="topsearch" onClick={() => nav('search')}>
            <Icon name="search" size={18} />
            <span>Search medicines &amp; health products</span>
          </button>

          <div className="topbar-actions">
            <button className="iconbtn rx-quick" onClick={() => nav('prescription')} title="Upload prescription">
              <Icon name="rx" size={20} /><span className="ib-label">Upload Rx</span>
            </button>
            <button className="iconbtn" onClick={() => requireAuth(() => showToast(user ? 'Already logged in' : ''))} title="Account">
              <Icon name="user" size={20} />
              <span className="ib-label">{user ? 'Account' : 'Login'}</span>
            </button>
            <button className="iconbtn cart-btn" onClick={() => nav('cart')} title="Cart">
              <Icon name="cart" size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              <span className="ib-label">Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------- SHOP BY CATEGORY ---------- */}
      <CategoryBar onBrowse={browse} />

      {/* ---------- SCROLL BODY ---------- */}
      <main className="appbody" ref={scrollRef}>
        {renderScreen()}
        <footer className="appfooter">
          <div className="af-grid">
            <div className="af-brand">
              <Logo size={34} />
              <p>Vedant Medicals — genuine medicines &amp; health essentials, delivered to your door. Sample demo storefront.</p>
            </div>
            <div className="af-col"><h4>Shop</h4><a onClick={()=>nav('search')}>All medicines</a><a onClick={()=>nav('prescription')}>Upload prescription</a><a onClick={()=>nav('order')}>Track order</a></div>
            <div className="af-col"><h4>Company</h4><a>About us</a><a onClick={()=>nav('inventory')}>Inventory dashboard</a><a onClick={()=>nav('accounts')}>Accounts &amp; billing</a></div>
            <div className="af-col"><h4>Help</h4><a>FAQs</a><a>Returns</a><a>Privacy</a></div>
          </div>
          <div className="af-base"><span>© 2026 Vedant Medicals · Demo prototype</span><span>Not a licensed pharmacy · sample data</span></div>
        </footer>
      </main>

      {/* ---------- BOTTOM NAV (mobile) ---------- */}
      <nav className="botnav">
        {[
          { k:'home', ic:'home', label:'Home' },
          { k:'search', ic:'search', label:'Search' },
          { k:'prescription', ic:'rx', label:'Upload' },
          { k:'cart', ic:'cart', label:'Cart', badge:cartCount },
        ].map(t => (
          <button key={t.k} className={"bn-item " + (cur.screen===t.k?'on':'')}
            onClick={() => t.k==='home'?go('home'):nav(t.k)}>
            <span className="bn-ic"><Icon name={t.ic} size={22} />
              {t.badge>0 && <span className="bn-badge">{t.badge}</span>}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* ---------- AUTH MODAL ---------- */}
      {authOpen && <AuthScreen onLogin={handleLogin} onClose={() => setAuthOpen(false)} />}

      {/* ---------- TOAST ---------- */}
      {toast && <div className="toast"><Icon name="check" size={16} /> {toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<VedantApp />);

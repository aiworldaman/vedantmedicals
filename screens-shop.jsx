// screens-shop.jsx — Home, Search, Product Detail

const { useState: useStateS, useMemo, useEffect: useEffectS } = React;

// ===================== HOME =====================
function HomeScreen({ nav, cart, addItem, incItem, decItem, qtyOf, stockOf, onSearchFocus }) {
  return (
    <div className="screen home">
      {/* hero / promo band */}
      <section className="hero-band">
        <div className="hero-copy">
          <span className="kicker"><Icon name="shield" size={14} stroke={2} /> Licensed online pharmacy</span>
          <h1>Medicines &amp; health<br/>essentials, <em>home-delivered.</em></h1>
          <p>Order genuine medicines, upload a prescription, and get it at your doorstep — usually within a day.</p>
          <div className="hero-search" onClick={onSearchFocus}>
            <Icon name="search" size={20} />
            <span>Search for medicines, brands &amp; health products</span>
          </div>
          <div className="hero-trust">
            <span><Icon name="truck" size={16} /> Same-day delivery</span>
            <span><Icon name="shield" size={16} /> 100% genuine</span>
            <span><Icon name="tag" size={16} /> Up to 25% off</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-card">
            <Logo size={26} />
            <div className="hero-card-row"><Icon name="check" size={16} /> Prescription saved</div>
            <div className="hero-card-row"><Icon name="truck" size={16} /> Arriving today, 6 PM</div>
            <div className="hero-card-bar"><i style={{width:'72%'}}></i></div>
            <div className="hero-card-foot"><span>Order #VM2381</span><b>On the way</b></div>
          </div>
          <div className="hero-blob b1"></div>
          <div className="hero-blob b2"></div>
        </div>
      </section>

      {/* quick actions */}
      <section className="quick">
        <button className="quick-tile" onClick={() => nav('prescription')}>
          <span className="qt-ic rx"><Icon name="rx" size={22} /></span>
          <b>Upload prescription</b><i>Pharmacist will review</i>
        </button>
        <button className="quick-tile" onClick={onSearchFocus}>
          <span className="qt-ic"><Icon name="search" size={22} /></span>
          <b>Order medicines</b><i>Search 1000s of products</i>
        </button>
        <button className="quick-tile" onClick={() => nav('order')}>
          <span className="qt-ic"><Icon name="truck" size={22} /></span>
          <b>Track order</b><i>Live delivery status</i>
        </button>
      </section>

      {/* categories */}
      <section className="block">
        <div className="block-head"><h2>Shop by category</h2></div>
        <div className="cat-row">
          {window.CATEGORIES.map(c => (
            <button key={c.id} className="cat-chip" onClick={() => nav('search', { cat: c.id })}>
              <span className="cat-ic" style={{ "--tint": c.tint }}>
                <Icon name={c.icon} size={24} stroke={1.9} />
              </span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* offers */}
      <section className="block">
        <div className="block-head"><h2>Offers for you</h2></div>
        <div className="offer-row">
          {window.OFFERS.map((o, i) => (
            <div key={o.id} className="offer" style={{ "--tint": o.tint }}>
              <span className="offer-ic"><Icon name={i===0?'tag':i===1?'truck':'rx'} size={20} stroke={1.9} /></span>
              <b>{o.title}</b><span>{o.sub}</span>
              <code>{o.code}</code>
            </div>
          ))}
        </div>
      </section>

      {/* bestsellers */}
      <section className="block">
        <div className="block-head">
          <h2>Bestsellers</h2>
          <button className="link-btn" onClick={() => nav('search')}>View all <Icon name="chevron" size={15} /></button>
        </div>
        <div className="grid">
          {window.PRODUCTS.slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} qty={qtyOf(p.id)} stock={stockOf(p.id)}
              onOpen={() => nav('product', { id: p.id })}
              onAdd={() => addItem(p.id)} onInc={() => incItem(p.id)} onDec={() => decItem(p.id)} />
          ))}
        </div>
      </section>

      <DemoNote />
    </div>
  );
}

// ===================== SEARCH =====================
function SearchScreen({ nav, query, setQuery, initialCat, addItem, incItem, decItem, qtyOf, stockOf, searchRef }) {
  const [cat, setCat] = useStateS(initialCat || 'all');
  const [sort, setSort] = useStateS('popular');
  const [rxOnly, setRxOnly] = useStateS(false);

  // sync the active-category chip when navigation supplies a new category
  // (the router keeps SearchScreen mounted, so the initializer alone is stale)
  useEffectS(() => { setCat(initialCat || 'all'); }, [initialCat]);

  const results = useMemo(() => {
    let list = window.PRODUCTS.filter(p => {
      const q = (query || '').trim().toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
        || p.salt.toLowerCase().includes(q) || p.use.toLowerCase().includes(q);
      const matchC = cat === 'all' || p.cat === cat;
      const matchRx = !rxOnly || p.rx;
      return matchQ && matchC && matchRx;
    });
    if (sort === 'low') list = [...list].sort((a,b)=>a.price-b.price);
    if (sort === 'high') list = [...list].sort((a,b)=>b.price-a.price);
    if (sort === 'rating') list = [...list].sort((a,b)=>b.rating-a.rating);
    return list;
  }, [query, cat, sort, rxOnly]);

  return (
    <div className="screen search">
      <div className="search-bar-wrap">
        <div className="search-bar">
          <Icon name="search" size={20} />
          <input ref={searchRef} value={query} placeholder="Search medicines, brands, symptoms…"
            onChange={e => setQuery(e.target.value)} autoFocus />
          {query && <button className="sb-clear" onClick={() => setQuery('')}><Icon name="close" size={16} /></button>}
        </div>
      </div>

      <div className="search-filters">
        <div className="chip-scroll">
          <button className={"fchip " + (cat==='all'?'on':'')} onClick={()=>setCat('all')}>All</button>
          {window.CATEGORIES.map(c => (
            <button key={c.id} className={"fchip " + (cat===c.id?'on':'')} onClick={()=>setCat(c.id)}>{c.name}</button>
          ))}
        </div>
        <div className="search-tools">
          <button className={"tool " + (rxOnly?'on':'')} onClick={()=>setRxOnly(v=>!v)}>
            <Icon name="rx" size={15} /> Rx only
          </button>
          <label className="tool sort">
            <Icon name="filter" size={15} />
            <select value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="popular">Popular</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>
      </div>

      <div className="search-count">{results.length} results{query ? <> for “<b>{query}</b>”</> : null}</div>

      {results.length === 0 ? (
        <div className="empty">
          <span className="empty-ic"><Icon name="search" size={30} /></span>
          <b>No medicines found</b>
          <p>Try a different name, brand or category.</p>
        </div>
      ) : (
        <div className="grid">
          {results.map(p => (
            <ProductCard key={p.id} product={p} qty={qtyOf(p.id)} stock={stockOf(p.id)}
              onOpen={() => nav('product', { id: p.id })}
              onAdd={() => addItem(p.id)} onInc={() => incItem(p.id)} onDec={() => decItem(p.id)} />
          ))}
        </div>
      )}
      <DemoNote />
    </div>
  );
}

// ===================== PRODUCT DETAIL =====================
function ProductScreen({ nav, product, addItem, incItem, decItem, qtyOf, stockOf }) {
  if (!product) return <div className="screen"><div className="empty"><b>Product not found</b></div></div>;
  const off = Math.round((1 - product.price / product.mrp) * 100);
  const qty = qtyOf(product.id);
  const avail = stockOf(product.id);
  const info = window.stockInfo(avail);
  const out = info.level === 'out';
  const similar = window.PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4);

  return (
    <div className="screen product">
      <div className="pd-grid">
        <div className="pd-media">
          <Thumb product={product} size="lg" />
          {off > 0 && <span className="pd-off">{off}% OFF</span>}
        </div>

        <div className="pd-info">
          <div className="pd-brand">{product.brand}</div>
          <h1 className="pd-name">{product.name}</h1>
          <div className="pd-meta">
            <Stars value={product.rating} reviews={product.reviews} />
            <span className="dot-sep">·</span>
            <span className="pd-pack">{product.pack}</span>
          </div>

          {product.rx && (
            <div className="rx-banner">
              <Icon name="rx" size={18} />
              <div><b>Prescription required</b><span>Add to cart, then upload your prescription at checkout.</span></div>
            </div>
          )}

          <div className="pd-price">
            <b>{money(product.price)}</b>
            {off > 0 && <><s>{money(product.mrp)}</s><span className="pd-save">You save {money(product.mrp - product.price)}</span></>}
          </div>

          <div className={"pd-stock " + info.level}>
            <i className="sb-dot"></i>
            {out
              ? <span><b>Out of stock</b> — currently unavailable, check back soon.</span>
              : info.level === 'low'
                ? <span><b>Low in stock</b> — only {avail} left, order soon.</span>
                : <span><b>In stock</b> — {avail} units available.</span>}
          </div>

          <div className="pd-actions">
            {out ? (
              <Btn kind="primary" disabled>Out of stock</Btn>
            ) : (
              <>
                <QtyControl qty={qty} onAdd={() => addItem(product.id)} onInc={() => incItem(product.id)} onDec={() => decItem(product.id)} />
                <Btn kind="primary" onClick={() => qty ? nav('cart') : addItem(product.id)}>
                  <Icon name="cart" size={18} /> {qty ? 'Go to cart' : 'Add to cart'}
                </Btn>
              </>
            )}
          </div>

          <div className="pd-assure">
            <span><Icon name="shield" size={16} /> 100% genuine</span>
            <span><Icon name="truck" size={16} /> Delivery by tomorrow</span>
            <span><Icon name="box" size={16} /> Easy returns</span>
          </div>
        </div>
      </div>

      <div className="pd-detail">
        <div className="pd-block">
          <h3>Description</h3>
          <p>{product.use}</p>
        </div>
        <div className="pd-facts">
          <div className="fact"><span>Composition</span><b>{product.salt}</b></div>
          <div className="fact"><span>Pack size</span><b>{product.pack}</b></div>
          <div className="fact"><span>Manufacturer</span><b>{product.brand}</b></div>
          <div className="fact"><span>Type</span><b>{product.rx ? 'Prescription medicine' : 'Over the counter'}</b></div>
        </div>
        <div className="pd-warn">
          <Icon name="shield" size={15} />
          Sample product for demo. Always read the label and consult a doctor or pharmacist before use.
        </div>
      </div>

      {similar.length > 0 && (
        <section className="block">
          <div className="block-head"><h2>Similar products</h2></div>
          <div className="grid">
            {similar.map(p => (
              <ProductCard key={p.id} product={p} qty={qtyOf(p.id)} stock={stockOf(p.id)}
                onOpen={() => nav('product', { id: p.id })}
                onAdd={() => addItem(p.id)} onInc={() => incItem(p.id)} onDec={() => decItem(p.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DemoNote(){
  return (
    <div className="demo-note">
      <Icon name="shield" size={14} /> Demo prototype · sample catalogue &amp; prices · not a real pharmacy
    </div>
  );
}

Object.assign(window, { HomeScreen, SearchScreen, ProductScreen, DemoNote });

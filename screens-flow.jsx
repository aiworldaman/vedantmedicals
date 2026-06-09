// screens-flow.jsx — Auth/OTP, Cart, Checkout, Prescription, Order tracking

const { useState: useStateF, useRef: useRefF, useEffect: useEffectF } = React;

// ===================== AUTH (mobile + OTP) =====================
function AuthScreen({ onLogin, onClose }) {
  const [step, setStep] = useStateF('phone');
  const [phone, setPhone] = useStateF('');
  const [otp, setOtp] = useStateF(['','','','']);
  const otpRefs = [useRefF(), useRefF(), useRefF(), useRefF()];
  const [resend, setResend] = useStateF(30);

  useEffectF(() => {
    if (step !== 'otp') return;
    setResend(30);
    const t = setInterval(() => setResend(r => r > 0 ? r - 1 : 0), 1000);
    setTimeout(() => otpRefs[0].current && otpRefs[0].current.focus(), 60);
    return () => clearInterval(t);
  }, [step]);

  const valid = phone.replace(/\D/g,'').length === 10;
  const otpFull = otp.every(d => d !== '');

  function setDigit(i, v) {
    v = v.replace(/\D/g,'').slice(-1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 3) otpRefs[i+1].current && otpRefs[i+1].current.focus();
  }

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <button className="auth-x" onClick={onClose}><Icon name="close" size={18} /></button>
        <div className="auth-brand"><Logo size={34} /></div>

        {step === 'phone' && (
          <>
            <h2>Login or sign up</h2>
            <p className="auth-sub">Enter your mobile number to continue. We&rsquo;ll send a one-time password.</p>
            <label className="field">
              <span>Mobile number</span>
              <div className="phone-input">
                <span className="cc">🇮🇳 +91</span>
                <input inputMode="numeric" maxLength={10} value={phone} placeholder="98765 43210"
                  onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} autoFocus />
              </div>
            </label>
            <Btn kind="primary" block disabled={!valid} onClick={() => setStep('otp')}>
              Send OTP
            </Btn>
            <p className="auth-fine">By continuing you agree to Vedant Medicals&rsquo; Terms &amp; Privacy Policy.</p>
          </>
        )}

        {step === 'otp' && (
          <>
            <button className="auth-back" onClick={() => setStep('phone')}><Icon name="back" size={16} /> Edit number</button>
            <h2>Verify your number</h2>
            <p className="auth-sub">Enter the 4-digit code sent to <b>+91 {phone}</b></p>
            <div className="otp-row">
              {otp.map((d,i) => (
                <input key={i} ref={otpRefs[i]} className={"otp-box " + (d?'filled':'')} inputMode="numeric"
                  maxLength={1} value={d}
                  onChange={e => setDigit(i, e.target.value)}
                  onKeyDown={e => { if (e.key==='Backspace' && !otp[i] && i>0) otpRefs[i-1].current.focus(); }} />
              ))}
            </div>
            <div className="otp-hint"><Icon name="shield" size={13} /> Demo: enter any 4 digits</div>
            <Btn kind="primary" block disabled={!otpFull} onClick={() => onLogin('+91 ' + phone)}>
              Verify &amp; continue
            </Btn>
            <div className="resend">
              {resend > 0 ? <span>Resend code in 0:{String(resend).padStart(2,'0')}</span>
                : <button onClick={() => setResend(30)}>Resend OTP</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===================== CART =====================
function CartScreen({ nav, items, products, incItem, decItem, removeItem, user, requireAuth }) {
  const lines = items.map(it => ({ ...it, p: products.find(p => p.id === it.id) })).filter(l => l.p);
  const subtotal = lines.reduce((s,l) => s + l.p.price * l.qty, 0);
  const mrpTotal = lines.reduce((s,l) => s + l.p.mrp * l.qty, 0);
  const saved = mrpTotal - subtotal;
  const delivery = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const total = subtotal + delivery;
  const hasRx = lines.some(l => l.p.rx);

  if (lines.length === 0) {
    return (
      <div className="screen cart">
        <h1 className="screen-title">Your cart</h1>
        <div className="empty tall">
          <span className="empty-ic"><Icon name="cart" size={32} /></span>
          <b>Your cart is empty</b>
          <p>Add medicines and health essentials to get started.</p>
          <Btn kind="primary" onClick={() => nav('search')}>Browse medicines</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="screen cart">
      <h1 className="screen-title">Your cart <span>({lines.length} items)</span></h1>
      <div className="cart-grid">
        <div className="cart-lines">
          {hasRx && (
            <div className="rx-banner inline">
              <Icon name="rx" size={18} />
              <div><b>Prescription needed for some items</b><span>You can upload it during checkout.</span></div>
            </div>
          )}
          {lines.map(l => (
            <div className="cline" key={l.id}>
              <div className="cline-media" onClick={() => nav('product', { id: l.id })}><Thumb product={l.p} /></div>
              <div className="cline-info">
                <div className="cline-brand">{l.p.brand}</div>
                <h3 onClick={() => nav('product', { id: l.id })}>{l.p.name}</h3>
                <div className="cline-pack">{l.p.pack}</div>
                <div className="cline-price"><b>{money(l.p.price)}</b><s>{money(l.p.mrp)}</s></div>
              </div>
              <div className="cline-side">
                <button className="cline-del" onClick={() => removeItem(l.id)}><Icon name="trash" size={16} /></button>
                <QtyControl qty={l.qty} sm onInc={() => incItem(l.id)} onDec={() => decItem(l.id)} />
              </div>
            </div>
          ))}
          <button className="add-more" onClick={() => nav('search')}><Icon name="plus" size={16} /> Add more items</button>
        </div>

        <aside className="cart-summary">
          <h3>Bill details</h3>
          <div className="bill">
            <div className="bill-row"><span>Item total (MRP)</span><span>{money(mrpTotal)}</span></div>
            <div className="bill-row save"><span>Discount</span><span>− {money(saved)}</span></div>
            <div className="bill-row"><span>Delivery fee</span><span>{delivery === 0 ? <em className="free">FREE</em> : money(delivery)}</span></div>
            <div className="bill-divider"></div>
            <div className="bill-row total"><span>To pay</span><span>{money(total)}</span></div>
          </div>
          <div className="save-badge"><Icon name="tag" size={14} /> You save {money(saved)} on this order</div>
          <Btn kind="primary" block onClick={() => requireAuth(() => nav('checkout'))}>
            {user ? 'Proceed to checkout' : 'Login & checkout'} <Icon name="chevron" size={18} />
          </Btn>
          {delivery > 0 && <p className="ship-hint">Add {money(499 - subtotal)} more for free delivery</p>}
        </aside>
      </div>
    </div>
  );
}

// ===================== PRESCRIPTION UPLOAD =====================
function PrescriptionScreen({ nav, onUploaded, hasUpload }) {
  const [file, setFile] = useStateF(hasUpload || null);
  const inputRef = useRefF();

  function pick(e) {
    const f = e.target.files && e.target.files[0];
    if (f) setFile({ name: f.name, size: Math.round(f.size/1024) });
  }

  return (
    <div className="screen rxscreen">
      <h1 className="screen-title">Upload prescription</h1>
      <p className="screen-lead">Upload a photo or PDF of your doctor&rsquo;s prescription. Our pharmacist verifies it before dispensing prescription medicines.</p>

      <div className="rx-grid">
        <div>
          {!file ? (
            <button className="dropzone" onClick={() => inputRef.current && inputRef.current.click()}>
              <span className="dz-ic"><Icon name="upload" size={30} /></span>
              <b>Tap to upload</b>
              <span>JPG, PNG or PDF · up to 10 MB</span>
            </button>
          ) : (
            <div className="rx-file">
              <span className="rxf-ic"><Icon name="check" size={22} /></span>
              <div className="rxf-info"><b>{file.name}</b><span>{file.size ? file.size + ' KB · ' : ''}Ready to submit</span></div>
              <button onClick={() => setFile(null)}><Icon name="trash" size={16} /></button>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*,.pdf" hidden onChange={pick} />
          <div className="rx-or"><span>or</span></div>
          <button className="rx-camera" onClick={() => inputRef.current && inputRef.current.click()}>
            <Icon name="phone" size={18} /> Use camera
          </button>
        </div>

        <aside className="rx-aside">
          <h3>How it works</h3>
          <ol className="rx-steps">
            <li><b>Upload</b><span>Add a clear photo of your prescription.</span></li>
            <li><b>Pharmacist review</b><span>We verify it within 30 minutes.</span></li>
            <li><b>We call you</b><span>To confirm medicines &amp; quantities.</span></li>
            <li><b>Delivered</b><span>Genuine medicines at your door.</span></li>
          </ol>
          <div className="rx-tip"><Icon name="shield" size={15} /> Make sure the doctor&rsquo;s details &amp; date are clearly visible.</div>
        </aside>
      </div>

      <div className="rx-cta">
        <Btn kind="primary" disabled={!file} onClick={() => { onUploaded(file); nav('cart'); }}>
          Submit prescription
        </Btn>
        <Btn kind="ghost" onClick={() => nav('home')}>Maybe later</Btn>
      </div>
    </div>
  );
}

// ===================== CHECKOUT =====================
function CheckoutScreen({ nav, items, products, user, hasUpload, onPlaced }) {
  const [addr, setAddr] = useStateF({ name:'', line:'', city:'', pin:'', type:'Home' });
  const [pay, setPay] = useStateF('upi');
  const lines = items.map(it => ({ ...it, p: products.find(p => p.id === it.id) })).filter(l => l.p);
  const subtotal = lines.reduce((s,l) => s + l.p.price * l.qty, 0);
  const delivery = subtotal >= 499 ? 0 : 40;
  const total = subtotal + delivery;
  const hasRx = lines.some(l => l.p.rx);
  const addrOk = addr.name && addr.line && addr.city && addr.pin.length === 6;
  const rxOk = !hasRx || hasUpload;

  return (
    <div className="screen checkout">
      <h1 className="screen-title">Checkout</h1>
      <div className="cart-grid">
        <div className="co-main">
          {/* delivery address */}
          <section className="co-card">
            <div className="co-card-head"><span className="co-step">1</span><h3>Delivery address</h3></div>
            <div className="addr-form">
              <label className="field"><span>Full name</span>
                <input value={addr.name} onChange={e=>setAddr({...addr,name:e.target.value})} placeholder="e.g. Aman Gupta" /></label>
              <label className="field"><span>Address</span>
                <input value={addr.line} onChange={e=>setAddr({...addr,line:e.target.value})} placeholder="House no, street, area" /></label>
              <div className="field-row">
                <label className="field"><span>City</span>
                  <input value={addr.city} onChange={e=>setAddr({...addr,city:e.target.value})} placeholder="City" /></label>
                <label className="field"><span>PIN code</span>
                  <input inputMode="numeric" maxLength={6} value={addr.pin}
                    onChange={e=>setAddr({...addr,pin:e.target.value.replace(/\D/g,'').slice(0,6)})} placeholder="560001" /></label>
              </div>
              <div className="addr-types">
                {['Home','Work','Other'].map(t => (
                  <button key={t} className={"atype " + (addr.type===t?'on':'')} onClick={()=>setAddr({...addr,type:t})}>
                    <Icon name={t==='Work'?'box':'pin'} size={14} /> {t}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* prescription */}
          {hasRx && (
            <section className="co-card">
              <div className="co-card-head"><span className="co-step">2</span><h3>Prescription</h3></div>
              {hasUpload ? (
                <div className="rx-file mini"><span className="rxf-ic"><Icon name="check" size={18} /></span>
                  <div className="rxf-info"><b>{hasUpload.name}</b><span>Uploaded · pending review</span></div></div>
              ) : (
                <div className="co-rx-needed">
                  <div><b>Prescription required</b><span>Some items need a valid prescription.</span></div>
                  <Btn kind="ghost" sm onClick={() => nav('prescription')}><Icon name="upload" size={15} /> Upload</Btn>
                </div>
              )}
            </section>
          )}

          {/* payment */}
          <section className="co-card">
            <div className="co-card-head"><span className="co-step">{hasRx?3:2}</span><h3>Payment method</h3></div>
            <div className="pay-list">
              {[
                {id:'upi', label:'UPI', sub:'GPay, PhonePe, Paytm'},
                {id:'card', label:'Credit / Debit card', sub:'Visa, Mastercard, RuPay'},
                {id:'cod', label:'Cash on delivery', sub:'Pay when it arrives'},
              ].map(m => (
                <button key={m.id} className={"pay-opt " + (pay===m.id?'on':'')} onClick={()=>setPay(m.id)}>
                  <span className="radio"></span>
                  <div><b>{m.label}</b><span>{m.sub}</span></div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="cart-summary">
          <h3>Order summary</h3>
          <div className="co-items">
            {lines.map(l => (
              <div className="co-item" key={l.id}>
                <span className="co-q">{l.qty}×</span>
                <span className="co-n">{l.p.name}</span>
                <span className="co-p">{money(l.p.price * l.qty)}</span>
              </div>
            ))}
          </div>
          <div className="bill">
            <div className="bill-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="bill-row"><span>Delivery</span><span>{delivery===0?<em className="free">FREE</em>:money(delivery)}</span></div>
            <div className="bill-divider"></div>
            <div className="bill-row total"><span>To pay</span><span>{money(total)}</span></div>
          </div>
          <Btn kind="primary" block disabled={!addrOk || !rxOk}
            onClick={() => onPlaced({ total, addr, pay, lines: lines.length })}>
            Place order · {money(total)}
          </Btn>
          {!rxOk && <p className="ship-hint warn">Upload a prescription to place this order</p>}
          <div className="co-assure"><Icon name="shield" size={14} /> Secure checkout · 100% genuine medicines</div>
        </aside>
      </div>
    </div>
  );
}

// ===================== ORDER TRACKING =====================
function OrderScreen({ nav, order }) {
  const steps = [
    { k:'Confirmed', s:'Order placed & paid', ic:'check', done:true },
    { k:'Packed', s:'Pharmacist verified & packed', ic:'box', done:true },
    { k:'Out for delivery', s:'On the way to you', ic:'truck', done:true, active:true },
    { k:'Delivered', s:'Estimated by 6:00 PM today', ic:'home', done:false },
  ];
  const id = order ? order.id : 'VM2381';
  const total = order ? order.total : 0;

  return (
    <div className="screen order">
      <div className="order-hero">
        <span className="order-tick"><Icon name="check" size={30} /></span>
        <h1>Order confirmed!</h1>
        <p>Thank you. Your order <b>#{id}</b> is being prepared.</p>
      </div>

      <div className="cart-grid">
        <div className="track-card">
          <div className="track-head">
            <div><span className="tk-label">Arriving</span><b className="tk-eta">Today, by 6:00 PM</b></div>
            <span className="tk-live"><i></i> Live</span>
          </div>
          <div className="track-steps">
            {steps.map((st,i) => (
              <div className={"tstep " + (st.done?'done ':'') + (st.active?'active':'')} key={i}>
                <span className="tstep-ic"><Icon name={st.done?'check':st.ic} size={16} /></span>
                <div className="tstep-info"><b>{st.k}</b><span>{st.s}</span></div>
                {st.active && <span className="tstep-now">Now</span>}
              </div>
            ))}
          </div>
          <div className="rider">
            <span className="rider-av"><Icon name="user" size={20} /></span>
            <div className="rider-info"><b>Rahul · Delivery partner</b><span>Vedant Medicals</span></div>
            <button className="rider-call"><Icon name="phone" size={18} /></button>
          </div>
        </div>

        <aside className="cart-summary">
          <h3>Order details</h3>
          <div className="od-row"><span>Order ID</span><b>#{id}</b></div>
          <div className="od-row"><span>Items</span><b>{order ? order.lines : 3} products</b></div>
          <div className="od-row"><span>Payment</span><b>{order ? (order.pay==='cod'?'Cash on delivery':order.pay==='upi'?'UPI':'Card') : 'UPI'}</b></div>
          {total > 0 && <div className="od-row"><span>Paid</span><b>{money(total)}</b></div>}
          <div className="od-addr">
            <Icon name="pin" size={15} />
            <span>{order && order.addr.line ? <>{order.addr.line}, {order.addr.city} {order.addr.pin}</> : 'Delivering to your saved address'}</span>
          </div>
          <Btn kind="ghost" block onClick={() => nav('home')}>Continue shopping</Btn>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { AuthScreen, CartScreen, PrescriptionScreen, CheckoutScreen, OrderScreen });

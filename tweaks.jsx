// tweaks.jsx — Vedant Medicals live controls
const VED_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#0e7eb8",
  "density": "regular",
  "layout": "card"
}/*EDITMODE-END*/;

const VED_ACCENTS = ["#17a673", "#0e7eb8", "#6d5ae6", "#e0633a", "#0f9d8f"];

function applyVed(t) {
  const r = document.documentElement;
  r.dataset.theme = t.theme;
  r.dataset.density = t.density;
  r.dataset.layout = t.layout;
  // derive accent ramp from chosen hex via oklch-ish: just set base, CSS handles soft/ink with color-mix
  r.style.setProperty('--brand', t.accent);
}

function VedTweaks() {
  const [t, setTweak] = useTweaks(VED_DEFAULTS);
  React.useEffect(() => { applyVed(t); }, [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Appearance" />
      <TweakRadio label="Theme" value={t.theme} options={["light","dark"]}
        onChange={v => setTweak("theme", v)} />
      <TweakColor label="Brand accent" value={t.accent} options={VED_ACCENTS}
        onChange={v => setTweak("accent", v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Density" value={t.density} options={["compact","regular","airy"]}
        onChange={v => setTweak("density", v)} />
      <TweakRadio label="Products" value={t.layout} options={["card","list"]}
        onChange={v => setTweak("layout", v)} />
    </TweaksPanel>
  );
}

applyVed(VED_DEFAULTS);
const _vt = document.getElementById('tweaks-root');
if (_vt) ReactDOM.createRoot(_vt).render(<VedTweaks />);

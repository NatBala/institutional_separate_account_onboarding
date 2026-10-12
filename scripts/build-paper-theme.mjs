// Builds prepared-release/theme-paper.css: the "Executive paper" theme.
// Every colour in the app's stylesheets is mapped into the paper palette and scoped to html[data-theme="paper"],
// then the hand-tuned finish (paper grain, serif headings, gold rules, navy sidebar) is appended.
// Run after changing any stylesheet: node scripts/build-paper-theme.mjs
import fs from 'node:fs';

const DIR='prepared-release',SOURCES=['agent-demo.css','system-view.css','agent-runner.css','workflow-risk.css','onboarding.css','theme.css'];
const SCOPE='html[data-theme="paper"]';
// Palette: warm ivory page, navy ink, accents moved from teal to deep blue.
const T={nh:38,ns:0.28,bgL:0.955,fgL:0.15,accent:212,blueTo:214};

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return [h,s,l];}
function hsl2rgb(h,s,l){h=((h%360)+360)%360/360;const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;const f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};return [f(h+1/3),f(h),f(h-1/3)].map(x=>Math.round(x*255));}
// Neutrals (dark surfaces, light text) swap ends of the lightness scale; coloured accents keep their meaning but darken to read on ivory.
function mapColor(r,g,b,a){let [h,s,l]=rgb2hsl(r,g,b);const chroma=(Math.max(r,g,b)-Math.min(r,g,b))/255;
 if(chroma<0.2||l<0.1){const t=clamp((l-0.03)/0.92);let nl=T.bgL-t*(T.bgL-T.fgL);if(a<1&&l>0.8)nl=0.1;return [...hsl2rgb(T.nh,T.ns*(t<0.15?0.6:1),clamp(nl)),a];}
 let nh=h;if(h>=150&&h<=195)nh=T.accent;else if(h>200&&h<235)nh=T.blueTo;
 let nl=l,ns=s;if(a<0.5)nl=Math.max(l,0.5);else if(l<0.3){nl=0.93;ns=Math.min(s,0.55);}else nl=l>0.5?0.2+(l-0.5)*0.5:l;
 return [...hsl2rgb(nh,clamp(ns),clamp(nl)),a];}
const fmt=([r,g,b,a])=>a>=1?`#${[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')}`:`rgba(${r},${g},${b},${+a.toFixed(3)})`;
const COLOR=/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)|\bwhite\b/g,HAS=new RegExp(COLOR.source);
function remap(v){return v.replace(COLOR,m=>{if(m==='white')return fmt(mapColor(255,255,255,1));
 if(m[0]==='#'){let hx=m.slice(1);if(hx.length===3)hx=hx.split('').map(c=>c+c).join('');return fmt(mapColor(...[0,2,4].map(i=>parseInt(hx.slice(i,i+2),16)),hx.length===8?parseInt(hx.slice(6),16)/255:1));}
 const n=m.match(/[\d.]+/g).map(Number);return fmt(mapColor(n[0],n[1],n[2],n[3]??1));});}

// A fill is "coloured" when it is a saturated, mostly opaque colour or one of the accent/status variables.
function colouredBg(v){if(/var\(--(wr-(low|med|high)|teal|red|amber|green|a-[a-z]+|sys-[a-z-]+)\)/.test(v))return true;
 return [...v.matchAll(new RegExp(COLOR.source,'g'))].some(([m])=>{if(m==='white')return false;let r,g,b,a=1;if(m[0]==='#'){let hx=m.slice(1);if(hx.length===3)hx=hx.split('').map(c=>c+c).join('');[r,g,b]=[0,2,4].map(i=>parseInt(hx.slice(i,i+2),16));if(hx.length===8)a=parseInt(hx.slice(6),16)/255;}else{const n=m.match(/[\d.]+/g).map(Number);[r,g,b]=n;a=n[3]??1;}return a>=0.6&&(Math.max(r,g,b)-Math.min(r,g,b))/255>=0.2;});}
function whiteish(v){const m=v.match(new RegExp(COLOR.source));if(!m)return false;if(m[0]==='white')return true;if(m[0][0]==='#'){let hx=m[0].slice(1);if(hx.length===3)hx=hx.split('').map(c=>c+c).join('');return [0,2,4].every(i=>parseInt(hx.slice(i,i+2),16)>=225);}return m[0].match(/[\d.]+/g).slice(0,3).every(x=>+x>=225);}
// Minimal CSS reader: rules, @media blocks (recursed); other at-rules are skipped.
function block(css,i){let d=0;for(let j=i;j<css.length;j++){if(css[j]==='{')d++;else if(css[j]==='}'&&--d===0)return j;}return css.length;}
function decls(body){const out=[];let cur='',par=0,q='';for(const c of body){if(q){cur+=c;if(c===q)q='';continue;}if(c==='"'||c==="'"){q=c;cur+=c;continue;}if(c==='(')par++;if(c===')')par--;if(c===';'&&par===0){out.push(cur);cur='';}else cur+=c;}if(cur.trim())out.push(cur);return out.map(x=>x.trim()).filter(Boolean);}
const scopeSel=sel=>sel.split(',').map(x=>x.trim()).filter(Boolean).map(x=>x===':root'||x==='html'?SCOPE:/^(:root|html)\b/.test(x)?SCOPE+x.replace(/^(:root|html)/,''):`${SCOPE} ${x}`).join(',');
function walk(css){let out='',i=0;css=css.replace(/\/\*[\s\S]*?\*\//g,'');
 while(i<css.length){const open=css.indexOf('{',i);if(open<0)break;const head=css.slice(i,open).trim(),end=block(css,open),body=css.slice(open+1,end);i=end+1;
  if(head.startsWith('@media')){const inner=walk(body);if(inner)out+=`${head}{${inner}}\n`;continue;}
  if(head.startsWith('@'))continue;
  const all=decls(body),bg=all.find(d=>/^background(-color)?\s*:/.test(d)),onColour=bg&&colouredBg(bg.slice(bg.indexOf(':')+1));
  // White text on a coloured fill (buttons, badges, active segments) stays white; everything else is remapped.
  // Colour declarations that use variables are re-emitted too, so the scoped rules keep the same cascade as the originals.
  const ds=all.filter(d=>HAS.test(d)||/^(background(-color)?|color|fill|stroke|border(-[a-z]+)*|outline|box-shadow)\s*:.*var\(--/.test(d)).map(d=>{const k=d.indexOf(':'),prop=d.slice(0,k).trim(),val=d.slice(k+1);return prop==='color'&&onColour&&whiteish(val)?`color:#fffdf8${/!important/.test(val)?'!important':''}`:prop+':'+remap(val);});
  if(ds.length)out+=`${scopeSel(head)}{${ds.join(';')}}\n`;}
 return out;}

const S=SCOPE,grain="url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.27 0 0 0 0 0.15 0 0 0 0.07 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";
const P={glow:'rgba(201,164,92,.16)',page:'#f6f0e3',rule:'#cdb88e',ink:'#1b2a44',muted:'#6b5d48',gold:'#9a7b3f',gold2:'#c9a45c',hair:'#e6dcc8',card:'#fffdf8',shadow:'rgba(80,55,15,.35)',rail:'linear-gradient(180deg,#17253d 0%,#0f1a2d 100%)',railrule:'rgba(201,164,92,.28)',railink:'#efe7d6',railmuted:'#b9ab90',railactive:'rgba(201,164,92,.12)',accent:'#1f3a63'};
const finish=`
@font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:400 700;font-display:swap;src:url(fonts/ibm-plex-sans.woff2) format('woff2')}
@font-face{font-family:'Source Serif 4';font-style:normal;font-weight:400 700;font-display:swap;src:url(fonts/source-serif-4.woff2) format('woff2')}
${S} body{background:${grain},radial-gradient(1200px 700px at 75% -10%,${P.glow},transparent 60%),${P.page}!important;background-attachment:fixed!important;color:${P.ink}}
${S} body,${S} button,${S} input,${S} select,${S} textarea{font-family:'IBM Plex Sans',system-ui,sans-serif}
${S} h1,${S} h2,${S} h3,${S} h4,${S} .brand,${S} .metric strong,${S} .fx-kpi strong,${S} .ob-big,${S} .st-kpi strong,${S} .vm-kpis b{font-family:'Source Serif 4',Georgia,serif}
${S} .topbar{background:transparent!important;border-bottom:3px double ${P.rule}!important;backdrop-filter:none!important}
${S} .topbar strong{font-family:'Source Serif 4',Georgia,serif;font-size:1.25rem;font-weight:600;color:${P.ink}!important}
${S} .method{font-family:'Source Serif 4',Georgia,serif;font-style:italic;letter-spacing:.02em;color:${P.muted}!important;border-bottom:1px solid ${P.hair}!important}
${S} .eyebrow,${S} .nav-group{letter-spacing:.18em;color:${P.gold}!important;font-weight:700}
${S} .pagehead h1{font-size:2.9rem;font-weight:600;letter-spacing:-.015em;color:${P.ink}!important;position:relative;padding-bottom:14px}
${S} .pagehead h1::after{content:'';position:absolute;left:0;bottom:0;width:72px;height:3px;background:linear-gradient(90deg,${P.gold},${P.gold2})}
${S} .pagehead p{font-family:'Source Serif 4',Georgia,serif;font-size:1.12rem;line-height:1.6;color:${P.muted}!important;max-width:820px}
${S} .panel,${S} .ob-card,${S} .sys-compact,${S} .fx-profile,${S} .vm,${S} .fx-run{background:${P.card}!important;border:1px solid ${P.hair}!important;border-radius:14px;box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 18px 40px -26px ${P.shadow}!important}
${S} .metric,${S} .fx-kpi{background:${P.card}!important;border:1px solid ${P.hair}!important;border-top:3px solid ${P.gold}!important;border-radius:12px;box-shadow:0 14px 30px -24px ${P.shadow}!important}
${S} .metric strong,${S} .fx-kpi strong{font-weight:600;color:${P.ink}!important;letter-spacing:-.02em;white-space:nowrap}
${S} .metric strong small{font-family:'IBM Plex Sans',sans-serif;font-size:.8rem;opacity:.75}
${S} .metric span,${S} .fx-kpi span{font-variant:small-caps;letter-spacing:.04em;color:${P.muted}!important}
${S} .panel h3,${S} .fx-mhead h3{font-weight:600;color:${P.ink}!important}
${S} thead th{background:transparent!important;font-variant:small-caps;letter-spacing:.05em;color:${P.gold}!important;border-bottom:1.5px solid ${P.rule}!important}
${S} .rail{background:${P.rail}!important;border-right:1px solid ${P.railrule}!important}
${S} .rail .brand{color:${P.railink}!important}${S} .rail .brand small{font-family:'IBM Plex Sans',sans-serif;font-style:italic;color:${P.railmuted}!important}
${S} .rail .nav{color:${P.railink}!important}${S} .rail .nav:hover{background:rgba(255,255,255,.06)!important}
${S} .rail .nav span{font-family:'Source Serif 4',Georgia,serif;font-style:italic;color:${P.gold2}!important;opacity:1}
${S} .rail .nav.active{background:${P.railactive}!important;border-left:3px solid ${P.gold2}!important;color:#fff!important}
${S} .rail .nav-group{color:${P.gold2}!important;opacity:.85}
${S} .rail .btn,${S} .rail-toggle{background:transparent!important;border-color:${P.railrule}!important;color:${P.railink}!important}
${S} .rail-note,${S} .rail-note *{color:${P.railmuted}}
${S} .btn.primary,${S} .sys-run,${S} .vm-toggle button.on,${S} .st-chip.on,${S} .fx-rl-tabs button.on,${S} .nx-tabs button.on,${S} .fx-stn,${S} .run-act h5 i{background:${P.accent}!important;border-color:${P.accent}!important;color:#fff!important}
${S} .fx-stepper .done span{color:#fff!important}
${S} .ob-drawer,${S} .fx-rl{background:${P.page}!important}${S} .ob-dhead,${S} .fx-rl-head{background:${P.card}!important;border-bottom:3px double ${P.rule}!important}
${S} .ob-backdrop,${S} .fx-rl-back{background:rgba(40,30,15,.35)!important}
${S} .sf-node em,${S} .sf-id{color:${P.accent}!important;border-color:${P.accent}!important}
${S} .sf-edge{stroke:#5b6b84!important}${S} #sf-arrow path{fill:#5b6b84}
${S} .cite{background:#f3ead6!important;border-color:${P.rule}!important;color:${P.ink}!important}
${S}{color-scheme:light}
${S} .run-mail-doc{background:${P.card}!important;color:${P.ink}!important;border:1px solid ${P.hair};box-shadow:0 10px 26px -18px ${P.shadow}!important}
${S} .run-mail-doc dt{color:${P.muted}!important}${S} .run-mail-doc dd,${S} .run-mail-body{color:${P.ink}!important}${S} .run-mail-doc dl{border-bottom-color:${P.hair}!important}
${S} .run-mail-doc .cite{background:#f3ead6!important;border-color:${P.rule}!important;color:${P.ink}!important}
${S} .st-chip.on b,${S} .nx-tabs button.on b{color:${P.ink}!important;background:#e9dfc9!important}
${S} .run-agent{background:${P.card}!important;color:${P.ink}!important;border:1px solid ${P.hair}!important;box-shadow:0 6px 16px -14px ${P.shadow}}
${S} .run-agent strong{color:${P.ink}!important}${S} .run-agent small{color:${P.muted}!important}
${S} .run-agent .run-avatar{background:#f3ead6!important;color:${P.ink}!important}
${S} .run-agent[data-status=active]{border-color:${P.accent}!important;background:#eef2f8!important;box-shadow:0 0 0 3px rgba(31,58,99,.15)!important}
${S} .run-agent[data-status=active] .run-avatar{background:${P.accent}!important;color:#fff!important}
${S} .run-agent[data-status=complete]{border-left:4px solid ${P.gold}!important}${S} .run-agent[data-status=complete] .run-avatar{background:${P.gold}!important;color:#fff!important}
${S} .run-human{background:${P.card}!important;color:${P.ink}!important;border-color:${P.rule}!important}
${S} .run-human.waiting{background:#fbf1dc!important;border-color:${P.gold2}!important;color:${P.ink}!important}${S} .run-human.done{background:#eaf3ee!important;border-color:#2e6b4f!important;color:${P.ink}!important}
${S} .fx-table th.sel button,${S} .fx-table th.sel small,${S} .fx-table th.sel b{color:#fffdf8!important}
${S} .theme-switch button.on{background:${P.gold2}!important;color:#1b2a44!important}
`;
let out=`/* Generated by scripts/build-paper-theme.mjs: the Executive paper theme. Do not edit by hand. */\n`;
for(const f of SOURCES)out+=`/* from ${f} */\n`+walk(fs.readFileSync(`${DIR}/${f}`,'utf8'));
out+=`/* finish */${finish}`;
fs.writeFileSync(`${DIR}/theme-paper.css`,out);
console.log(`Wrote ${DIR}/theme-paper.css (${Math.round(out.length/1024)} KB)`);

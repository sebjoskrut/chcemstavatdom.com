import React, { useState, useMemo } from 'react';

// Professional single-file React component (Tailwind + recharts + framer-motion)
// Copy into a React project (Vite/CRA) with Tailwind CSS, recharts and framer-motion installed.

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { motion } from 'framer-motion';

const defaultInputs = {
  newBuild: {
    purchaseCost: 220000, // EUR (pozemok + výstavba)
    annualRunning: 2000, // EUR ročne (energie, údržba)
    years: 30,
    resaleValue: 50000,
  },
  renovate: {
    purchaseCost: 120000, // EUR (kúpa staršieho domu)
    renovationCost: 60000, // EUR
    annualRunning: 3000, // EUR ročne (vyššie prevádzkové náklady)
    years: 30,
    resaleValue: 20000,
  },
  discountRate: 0.03,
};

function npv(costs, discountRate) {
  return costs.reduce((acc, c) => acc + c.amount / Math.pow(1 + discountRate, c.year), 0);
}

function buildCashflows({ purchaseCost, renovationCost = 0, annualRunning, years, resaleValue }) {
  const flows = [];
  flows.push({ year: 0, amount: -purchaseCost - (renovationCost || 0) });
  for (let y = 1; y <= years; y++) flows.push({ year: y, amount: -annualRunning });
  flows.push({ year: years + 1, amount: resaleValue });
  return flows;
}

function createChartData(newFlows, renFlows) {
  const maxYear = Math.max(newFlows[newFlows.length - 1].year, renFlows[renFlows.length - 1].year);
  const rows = [];
  let cumNew = 0;
  let cumRen = 0;
  for (let y = 0; y <= maxYear; y++) {
    const nf = newFlows.find(f => f.year === y)?.amount || 0;
    const rf = renFlows.find(f => f.year === y)?.amount || 0;
    cumNew += nf;
    cumRen += rf;
    rows.push({ year: y, new: Math.round(cumNew), ren: Math.round(cumRen) });
  }
  return rows;
}

export default function HomeInvestmentComparator() {
  const [inputs, setInputs] = useState(defaultInputs);

  const newFlows = useMemo(() => buildCashflows({
    purchaseCost: inputs.newBuild.purchaseCost,
    annualRunning: inputs.newBuild.annualRunning,
    years: inputs.newBuild.years,
    resaleValue: inputs.newBuild.resaleValue,
  }), [inputs]);

  const renFlows = useMemo(() => buildCashflows({
    purchaseCost: inputs.renovate.purchaseCost,
    renovationCost: inputs.renovate.renovationCost,
    annualRunning: inputs.renovate.annualRunning,
    years: inputs.renovate.years,
    resaleValue: inputs.renovate.resaleValue,
  }), [inputs]);

  const newNPV = useMemo(() => npv(newFlows, inputs.discountRate), [newFlows, inputs.discountRate]);
  const renNPV = useMemo(() => npv(renFlows, inputs.discountRate), [renFlows, inputs.discountRate]);

  const chartData = useMemo(() => createChartData(newFlows, renFlows), [newFlows, renFlows]);

  function updateField(path, value) {
    setInputs(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = Number(value);
      return copy;
    });
  }

  const recommendation = newNPV < renNPV ? 'Výstavba nového domu (nižšia diskontovaná cena)' : (newNPV > renNPV ? 'Rekonštrukcia existujúcej stavby (výhodnejšia z finančného hľadiska)' : 'Obidve možnosti sú finančne porovnateľné');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-8 rounded-3xl p-8 bg-gradient-to-r from-white via-slate-50 to-white shadow-lg" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight">Porovnanie: Výstavba nového domu vs. Rekonštrukcia</h1>
              <p className="mt-2 text-slate-600 max-w-xl">Interaktívna profesionálna kalkulačka nákladov a diskontovaných cashflowov — navrhnutá pre investorov, poradcov a majiteľov pri rozhodovaní o bývaní či investícii.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-slate-200 shadow-sm bg-white hover:shadow">Stiahnuť PDF (skoro)</button>
              <button className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:opacity-95">Export CSV</button>
            </div>
          </div>
        </motion.div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 p-6 rounded-2xl bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4">Scenáre — vstupy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl">
                <h3 className="font-medium mb-2">Nová výstavba</h3>
                <label className="text-sm">Cena (pozemok + stavba, EUR)</label>
                <input type="number" className="w-full p-2 mt-1 rounded-md border" value={inputs.newBuild.purchaseCost} onChange={e => updateField('newBuild.purchaseCost', e.target.value)} />
                <label className="text-sm mt-3">Ročné prevádzkové náklady (EUR)</label>
                <input type="number" className="w-full p-2 mt-1 rounded-md border" value={inputs.newBuild.annualRunning} onChange={e => updateField('newBuild.annualRunning', e.target.value)} />
                <label className="text-sm mt-3">Horizont (roky)</label>
                <input type="number" className="w-full p-2 mt-1 rounded-md border" value={inputs.newBuild.years} onChange={e => updateField('newBuild.years', e.target.value)} />
                <label className="text-sm mt-3">Zostatková hodnota po horizonte (EUR)</label>
                <input type="number" className="w-full p-2 mt-1 rounded-md border" value={inputs.newBuild.resaleValue} onChange={e => updateField('newBuild.resaleValue', e.target.value)} />
              </div>

              <div className="p-4 border rounded-xl">
                <h3 className="font-medium mb-2">Rekonštrukcia</h3>
                <label className="text-sm">Cena existujúcej nehnuteľnosti (EUR)</label>
                <input type="number" className="w-full p-2 mt-1 rounded-md border" value={inputs.renovate.purchaseCost} onChange={e => updateField('renovate.purchaseCost', e.target.value)} />
                <label className="text-sm mt-3">Náklady na rekonštrukciu (EUR)</label>
                <input type="number" className="w-full p-2 mt-1 rounded-md border" value={inputs.renovate.renovationCost} onChange={e => updateField('renovate.renovationCost', e.target.value)} />
                <label className="text-sm mt-3">Ročné prevádzkové náklady (EUR)</label>
                <input type="number" className="w-full p-2 mt-1 rounded-md border" value={inputs.renovate.annualRunning} onChange={e => updateField('renovate.annualRunning', e.target.value)} />
                <label className="text-sm mt-3">Zostatková hodnota po horizonte (EUR)</label>
                <input type="number" className="w-full p-2 mt-1 rounded-md border" value={inputs.renovate.resaleValue} onChange={e => updateField('renovate.resaleValue', e.target.value)} />
              </div>

              <div className="md:col-span-2 p-4 flex items-center gap-4 border rounded-xl">
                <div className="flex-1">
                  <label className="text-sm">Diskontná miera (ročná, desatinné číslo)</label>
                  <input type="number" step="0.01" className="w-full p-2 mt-1 rounded-md border" value={inputs.discountRate} onChange={e => setInputs(prev => ({ ...prev, discountRate: Number(e.target.value) }))} />
                </div>
                <div>
                  <button className="px-3 py-2 rounded-lg bg-slate-100" onClick={() => setInputs(defaultInputs)}>Reset</button>
                </div>
              </div>
            </div>
          </div>

          <aside className="p-6 rounded-2xl bg-gradient-to-b from-white to-slate-50 shadow-md">
            <h3 className="text-lg font-semibold mb-3">Rýchly prehľad</h3>
            <div className="space-y-3">
              <div className="text-sm text-slate-500">NPV (nová výstavba)</div>
              <div className="text-2xl font-bold">{Math.round(newNPV).toLocaleString()} €</div>
              <div className="text-sm text-slate-500 mt-3">NPV (rekonštrukcia)</div>
              <div className="text-2xl font-bold">{Math.round(renNPV).toLocaleString()} €</div>
              <div className="mt-4 p-3 rounded-lg bg-white border">
                <div className="text-xs text-slate-500">Odporúčanie</div>
                <div className="font-medium">{recommendation}</div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mb-8 p-6 rounded-2xl bg-white shadow-md">
          <h3 className="text-lg font-semibold mb-4">Vizualizácia kumulatívnych nákladov</h3>
          <div style={{ height: 360 }}>
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Rok', position: 'insideBottomRight', offset: -5 }} />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('sk-SK').format(value) + ' €'} />
                <Legend />
                <Line type="monotone" dataKey={'new'} name={'Nový dom (kumulatívne)'} stroke="#1f2937" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey={'ren'} name={'Rekonštrukcia (kumulatívne)'} stroke="#0ea5a4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-slate-600">Graf zobrazuje kumulatívne (nedezkonontované) náklady v čase. Pre úplnú správu vložte grafy do správy a uveďte predpoklady.</div>
        </section>

        <section className="mb-12 p-6 rounded-2xl bg-white shadow-md">
          <h3 className="text-lg font-semibold mb-3">Ako použiť túto kalkulačku</h3>
          <ol className="list-decimal pl-5 space-y-2 text-slate-700">
            <li>Preverte lokálne ceny m2, náklady na rekonštrukciu a predpoklady o životnosti.</li>
            <li>Vykonajte citlivostnú analýzu (±20 % pre kľúčové položky) a porovnajte výsledky.</li>
            <li>Zvážte nefinančné faktory: umiestnenie, energetická náročnosť, legislatíva, emocionálna hodnota.</li>
            <li>Exportujte výsledky pre konzultáciu s finančným poradcom alebo architektom.</li>
          </ol>
        </section>

        <footer className="text-center text-sm text-slate-500 pb-8">© {new Date().getFullYear()} Analytická kalkulačka — profesionálny nástroj pre hodnotenie nehnuteľností.</footer>
      </div>
    </div>
  );
}

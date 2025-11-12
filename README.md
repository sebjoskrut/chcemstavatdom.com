# chcemstavatdom.com
import React, { useState, useMemo } from 'react';
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

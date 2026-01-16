'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [income, setIncome] = useState('');
  const [debt, setDebt] = useState('');
  const [savings, setSavings] = useState('');
  const [dependents, setDependents] = useState('');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const incomeNum = Number(income) || 0;
    const debtNum = Number(debt) || 0;
    const savingsNum = Number(savings) || 0;
    const dependentsNum = Number(dependents) || 0;
    const yearsNum = Number(years) || 10;

    // Simple HGI-style logic: years of income + debts - savings
    const recommended =
      incomeNum * yearsNum + debtNum - savingsNum + dependentsNum * 50000;

    // Save to Supabase (anonymous for now)
    const { data, error } = await supabase
      .from('fna_sessions')
      .insert({
        household_income: incomeNum,
        debt_total: debtNum,
        savings_total: savingsNum,
        dependents: dependentsNum,
        goal_years_of_income: yearsNum,
      })
      .select()
      .single();

    if (!error && data) {
      await supabase.from('fna_recommendations').insert({
        fna_id: data.id,
        recommended_coverage: recommended,
        notes: 'Auto-calculated based on income, debt, savings, dependents.',
      });
    }

    setResult(recommended);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-xl bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-bold mb-4">
          HGI‑Style Financial Needs Analysis
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Annual Household Income ($)</label>
            <input
              type="number"
              value={income}
              onChange={e => setIncome(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Total Debt ($)</label>
            <input
              type="number"
              value={debt}
              onChange={e => setDebt(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Total Savings ($)</label>
            <input
              type="number"
              value={savings}
              onChange={e => setSavings(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Number of Dependents</label>
            <input
              type="number"
              value={dependents}
              onChange={e => setDependents(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Years of Income to Protect</label>
            <input
              type="number"
              value={years}
              onChange={e => setYears(e.target.value)}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold"
          >
            {loading ? 'Calculating…' : 'Run FNA'}
          </button>
        </form>

        {result !== null && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <h2 className="font-semibold mb-1">Recommended Life Insurance Coverage</h2>
            <p className="text-lg font-bold">
              ${result.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              This is a simplified estimate. Refine with product options, riders, and your agent’s advice.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

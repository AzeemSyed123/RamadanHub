'use client';

import { useState, useEffect } from 'react';
import charitiesData from '@/data/charities.json';
import { Charity, SadaqahEntry } from '@/lib/types';
import { calculateZakat, formatCurrency, generateId } from '@/lib/helpers';

export default function CharityTab() {
  const [activeTab, setActiveTab] = useState<'charities' | 'zakat' | 'sadaqah'>('charities');
  const [savings, setSavings] = useState('');
  const [zakatAmount, setZakatAmount] = useState(0);
  const [sadaqahLog, setSadaqahLog] = useState<SadaqahEntry[]>([]);
  const [newSadaqah, setNewSadaqah] = useState({
    amount: '',
    charity: '',
    notes: '',
  });

  const charities = charitiesData as Charity[];

  // Load Sadaqah log from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sadaqahLog');
    if (saved) {
      try {
        setSadaqahLog(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse sadaqah log', e);
      }
    }
  }, []);

  const calculateZakatAmount = () => {
    const amount = parseFloat(savings);
    if (!isNaN(amount) && amount > 0) {
      setZakatAmount(calculateZakat(amount));
    } else {
      setZakatAmount(0);
    }
  };

  const addSadaqahEntry = () => {
    const amount = parseFloat(newSadaqah.amount);
    if (!isNaN(amount) && amount > 0 && newSadaqah.charity) {
      const entry: SadaqahEntry = {
        id: generateId(),
        amount,
        charity: newSadaqah.charity,
        notes: newSadaqah.notes,
        date: new Date().toISOString(),
      };
      const updatedLog = [entry, ...sadaqahLog];
      setSadaqahLog(updatedLog);
      localStorage.setItem('sadaqahLog', JSON.stringify(updatedLog));
      setNewSadaqah({ amount: '', charity: '', notes: '' });
    }
  };

  const deleteSadaqahEntry = (id: string) => {
    const updatedLog = sadaqahLog.filter((entry) => entry.id !== id);
    setSadaqahLog(updatedLog);
    localStorage.setItem('sadaqahLog', JSON.stringify(updatedLog));
  };

  const totalSadaqah = sadaqahLog.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          💝 Charity & Giving
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your Zakat and Sadaqah, support trusted charities
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('charities')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              activeTab === 'charities'
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Charities
          </button>
          <button
            onClick={() => setActiveTab('zakat')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              activeTab === 'zakat'
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Zakat Calculator
          </button>
          <button
            onClick={() => setActiveTab('sadaqah')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              activeTab === 'sadaqah'
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Sadaqah Log
          </button>
        </div>
      </div>

      {/* Charities Tab */}
      {activeTab === 'charities' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            ℹ️ These are reputable 501(c)(3) organizations. Always verify charity credentials before donating.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charities.map((charity) => (
              <div
                key={charity.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {charity.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {charity.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {charity.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                             text-gray-900 dark:text-white rounded-lg font-medium transition"
                  >
                    Website
                  </a>
                  <a
                    href={charity.donateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
                  >
                    Donate
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zakat Calculator Tab */}
      {activeTab === 'zakat' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              📊 Calculate Your Zakat
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Zakat is 2.5% of your qualifying wealth (savings, investments, gold, silver, etc.) held for one lunar year.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Qualifying Wealth (USD)
            </label>
            <input
              type="number"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={calculateZakatAmount}
              className="w-full mt-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
            >
              Calculate Zakat
            </button>
          </div>

          {zakatAmount > 0 && (
            <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
                Your Zakat Amount
              </h4>
              <p className="text-4xl font-bold text-green-700 dark:text-green-300 mb-4">
                {formatCurrency(zakatAmount)}
              </p>
              <p className="text-sm text-green-800 dark:text-green-300">
                This is 2.5% of {formatCurrency(parseFloat(savings))}
              </p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
              💡 Zakat Guidelines
            </h4>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Calculate Zakat on wealth held for one full lunar year (Hawl)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Include cash, savings, investments, gold, silver, and business inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Deduct any debts owed before calculating</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>The Nisab (minimum threshold) is approximately $5,000-$6,000</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Consult a scholar for personalized guidance</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Sadaqah Log Tab */}
      {activeTab === 'sadaqah' && (
        <div className="space-y-6">
          {/* Add Sadaqah Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ➕ Log New Sadaqah
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={newSadaqah.amount}
                  onChange={(e) => setNewSadaqah({ ...newSadaqah, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Charity/Recipient
                </label>
                <input
                  type="text"
                  value={newSadaqah.charity}
                  onChange={(e) => setNewSadaqah({ ...newSadaqah, charity: e.target.value })}
                  placeholder="e.g., Islamic Relief USA"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={newSadaqah.notes}
                  onChange={(e) => setNewSadaqah({ ...newSadaqah, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                onClick={addSadaqahEntry}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
              >
                Add Entry
              </button>
            </div>
          </div>

          {/* Total Sadaqah */}
          {sadaqahLog.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
                Total Sadaqah Given
              </h4>
              <p className="text-4xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(totalSadaqah)}
              </p>
              <p className="text-sm text-green-800 dark:text-green-300 mt-2">
                {sadaqahLog.length} {sadaqahLog.length === 1 ? 'entry' : 'entries'} logged
              </p>
            </div>
          )}

          {/* Sadaqah Entries */}
          <div className="space-y-3">
            {sadaqahLog.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  No Sadaqah entries yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Add your first entry above to start tracking
                </p>
              </div>
            ) : (
              sadaqahLog.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(entry.amount)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium">{entry.charity}</p>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteSadaqahEntry(entry.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-4"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

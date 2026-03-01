'use client';

import { useState, useEffect } from 'react';
import type { HistoryEntry } from '@/lib/types';
import { loadHistory, deleteHistoryEntry, clearHistory } from '@/lib/storage';

const fmtCurrency = (val: number) =>
  `¥${Math.round(val).toLocaleString('ja-JP')}`;

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function HistoryList() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('この計算履歴を削除しますか？')) return;
    deleteHistoryEntry(id);
    setHistory(loadHistory());
  };

  const handleClearAll = () => {
    if (!confirm('全ての計算履歴を削除しますか？この操作は元に戻せません。')) return;
    clearHistory();
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div className="empty-state">
        <p>計算履歴がありません。</p>
        <a href="/" className="btn-primary">
          計算してみる
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="history-header">
        <p>{history.length}件の履歴</p>
        <button onClick={handleClearAll} className="btn-danger">
          全て削除
        </button>
      </div>

      <ul className="history-list">
        {history.map((entry) => (
          <li key={entry.id} className="history-card">
            <div className="history-card-top">
              <span className="history-date">{fmtDate(entry.timestamp)}</span>
              <button
                onClick={() => handleDelete(entry.id)}
                className="btn-delete"
                aria-label="この履歴を削除"
              >
                削除
              </button>
            </div>

            <div className="history-inputs">
              <span>ローン額: {fmtCurrency(entry.amount)}</span>
              <span>年利率: {entry.rate}%</span>
              <span>返済期間: {entry.years}年</span>
            </div>

            <div className="history-results">
              <div className="history-result-item history-result-item--primary">
                <span className="history-label">月々の返済額</span>
                <span className="history-value">
                  {fmtCurrency(entry.monthlyPayment)}
                </span>
              </div>
              <div className="history-result-item">
                <span className="history-label">総返済額</span>
                <span className="history-value">
                  {fmtCurrency(entry.totalPayment)}
                </span>
              </div>
              <div className="history-result-item">
                <span className="history-label">総利息額</span>
                <span className="history-value">
                  {fmtCurrency(entry.totalInterest)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

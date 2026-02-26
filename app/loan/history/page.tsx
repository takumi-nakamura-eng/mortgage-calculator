import type { Metadata } from 'next';
import HistoryList from '../../components/HistoryList';

export const metadata: Metadata = {
  title: '計算履歴 | ローン計算機',
  description:
    '過去に計算したローンシミュレーションの履歴を確認・管理できます。個別削除や一括削除が可能です。',
};

export default function LoanHistoryPage() {
  return (
    <main className="container">
      <h1 className="page-title">計算履歴</h1>
      <p className="page-description">
        過去の計算結果を確認できます。履歴はブラウザに保存されます。
      </p>
      <HistoryList />
    </main>
  );
}

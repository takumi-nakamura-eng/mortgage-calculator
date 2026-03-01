import type { Metadata } from 'next';
import EngHistoryList from '../components/EngHistoryList';

export const metadata: Metadata = {
  title: '計算履歴',
  description:
    '過去に計算した結果の履歴を確認・管理できます。個別削除や一括削除が可能です。',
};

export default function HistoryPage() {
  return (
    <main className="container">
      <h1 className="page-title">計算履歴</h1>
      <p className="page-description">
        過去の計算結果を確認できます。履歴はブラウザ（localStorage）に保存されます。
        ブラウザのデータをクリアすると履歴は消えます。
      </p>
      <EngHistoryList />
    </main>
  );
}

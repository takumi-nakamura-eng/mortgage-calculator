import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '免責事項',
  description: 'calcnaviの免責事項。計算結果の参考性・損害責任・リンク先について説明します。',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <main className="container">
      <h1 className="page-title">免責事項</h1>
      <div className="static-content">
        <ul>
          <li>
            当サイトの計算結果は参考値です。実際の設計値・施工条件・仕様等は必ず規格原文・メーカー仕様書・専門家にご確認ください。
          </li>
          <li>最終的な判断は利用者ご自身でお願いします。</li>
          <li>
            当サイトの利用により生じたいかなる損害についても、運営者は責任を負いません。
          </li>
          <li>リンク先の外部サイトの内容について、運営者は責任を負いません。</li>
          <li>サイトの内容は予告なく変更・削除する場合があります。</li>
        </ul>
      </div>
    </main>
  );
}

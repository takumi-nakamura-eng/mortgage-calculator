import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '免責事項',
  description: 'calcnaviの免責事項。計算結果の参考性・損害責任・リンク先について説明します。',
};

export default function DisclaimerPage() {
  return (
    <main className="container">
      <h1 className="page-title">免責事項</h1>
      <div className="static-content">
        <ul>
          <li>
            当サイトの計算結果は参考値です。実際の返済額・仕様は金融機関・メーカー等にご確認ください。
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

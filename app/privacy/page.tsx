import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'calcnaviのプライバシーポリシー。取得する情報・Cookie・第三者提供について説明します。',
};

export default function PrivacyPage() {
  return (
    <main className="container">
      <h1 className="page-title">プライバシーポリシー</h1>
      <div className="static-content">
        <h2>取得する情報</h2>
        <ul>
          <li>アクセス解析（Google Analytics）：IPアドレス・閲覧ページ・滞在時間など</li>
          <li>広告配信サービス：Cookieを用いた行動履歴</li>
          <li>お問い合わせ：メール送信により取得したメールアドレス・氏名など</li>
        </ul>

        <h2>Cookieについて</h2>
        <ul>
          <li>当サイトはGoogle Analytics・広告サービスのためにCookieを使用します。</li>
          <li>
            ブラウザ設定によりCookieを無効にできますが、一部機能が制限される場合があります。
          </li>
        </ul>

        <h2>第三者への提供</h2>
        <ul>
          <li>取得した情報は法令に基づく場合を除き、第三者へ提供しません。</li>
          <li>
            Google Analyticsのデータ利用については
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Googleのプライバシーポリシー
            </a>
            をご確認ください。
          </li>
        </ul>

        <h2>お問い合わせ情報</h2>
        <ul>
          <li>いただいたメールアドレスは返信のみに使用し、第三者に開示しません。</li>
        </ul>
      </div>
    </main>
  );
}

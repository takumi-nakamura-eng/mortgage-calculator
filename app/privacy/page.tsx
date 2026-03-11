import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'プライバシーポリシー',
  description:
    'calcnavi（計算ナビ）のプライバシーポリシー。Cookie・広告・アクセス解析・個人情報の取り扱いについて説明します。',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <main className="container">
      <h1 className="page-title">プライバシーポリシー</h1>
      <div className="static-content">
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          最終更新日：2026年3月3日
        </p>

        <h2>1. 取得する情報</h2>
        <ul>
          <li>
            <strong>アクセス解析（Google Analytics）</strong>：
            IPアドレス・閲覧ページ・滞在時間・ブラウザ情報など。個人を特定するものではありません。
          </li>
          <li>
            <strong>広告配信（Google AdSense など）</strong>：
            第三者広告サービスの利用時に、ユーザーの興味に応じた広告表示のためCookie等が使用されることがあります。
          </li>
          <li>
            <strong>お問い合わせ</strong>：
            メールにて送付いただいたメールアドレス・お名前・お問い合わせ内容。
          </li>
        </ul>

        <h2>2. Cookieについて</h2>
        <ul>
          <li>当サイトはGoogle Analytics・Google AdSense のためにCookieを使用します。</li>
          <li>ブラウザ設定からCookieを無効にすることができますが、一部機能が制限される場合があります。</li>
          <li>
            Google によるCookieの利用方法については、
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google の広告に関するポリシー
            </a>
            をご確認ください。
          </li>
          <li>
            Google Analytics のオプトアウトは
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google アナリティクス オプトアウト アドオン
            </a>
            からできます。
          </li>
        </ul>

        <h2>3. 広告について（Google AdSense）</h2>
        <ul>
          <li>
            当サイトは、Google AdSense などの第三者広告サービスを利用する場合があります。
          </li>
          <li>
            広告配信事業者は、ユーザーの興味に応じた広告を表示するため、Cookie 等を使用することがあります。
          </li>
          <li>
            パーソナライズ広告の設定変更やオプトアウトは
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google 広告設定
            </a>
            から行えます。
          </li>
          <li>
            詳細は
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google プライバシーポリシー
            </a>
            をご参照ください。
          </li>
        </ul>

        <h2>4. 第三者への情報提供</h2>
        <ul>
          <li>取得した情報は、法令に基づく場合を除き、第三者へ提供・開示しません。</li>
          <li>お問い合わせで取得したメールアドレスは、返信のみに使用し第三者に開示しません。</li>
        </ul>

        <h2>5. セキュリティ</h2>
        <ul>
          <li>当サイトは個人情報への不正アクセス防止に合理的な対策を講じます。</li>
          <li>ただし、インターネット経由の送受信における完全な安全性は保証できません。</li>
        </ul>

        <h2>6. ポリシーの変更</h2>
        <p>
          本ポリシーは必要に応じて更新することがあります。重要な変更はサイト上でお知らせします。
        </p>

        <h2>7. お問い合わせ</h2>
        <p>
          本ポリシーに関するお問い合わせは
          <a href="/contact">お問い合わせページ</a>よりご連絡ください。
        </p>
      </div>
    </main>
  );
}

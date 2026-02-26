import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'calcnaviへのお問い合わせはこちら。',
};

export default function ContactPage() {
  return (
    <main className="container">
      <h1 className="page-title">お問い合わせ</h1>
      <div className="static-content">
        <p>ご質問・ご意見は以下のメールアドレスまでご連絡ください。</p>
        <p>
          <a href="mailto:yourmail@example.com">yourmail@example.com</a>
        </p>
        <ul>
          <li>内容：サイトに関するご意見・誤りのご指摘など</li>
          <li>返信目安：数日以内（返信できない場合もございます）</li>
          <li>
            個人情報の取り扱いについては
            <a href="/privacy">プライバシーポリシー</a>をご参照ください。
          </li>
        </ul>
      </div>
    </main>
  );
}

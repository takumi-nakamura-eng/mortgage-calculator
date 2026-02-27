import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'calcnavi（計算ナビ）へのご意見・ご質問はこちら。メールにてお気軽にどうぞ。',
};

const MAIL = 'cantact.calcnavi@gmail.com';
const SUBJECT = encodeURIComponent('[calcnavi] お問い合わせ');
const BODY = encodeURIComponent(
  `【件名】\n\n【内容】\n\n【環境】\nOS: \nブラウザ: \n計算ツール名: \n入力した値: `
);

export default function ContactPage() {
  return (
    <main className="contact-wrap">
      <h1 className="page-title">お問い合わせ</h1>

      <div className="contact-card">
        <p style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>
          ご質問・ご意見・計算結果の誤りのご指摘など、お気軽にご連絡ください。
          メールソフトが起動しますので、内容を入力してお送りください。
        </p>

        <a
          href={`mailto:${MAIL}?subject=${SUBJECT}&body=${BODY}`}
          className="contact-mail-link"
        >
          ✉ メールで問い合わせる
        </a>

        <p className="contact-section-title">送信先アドレス</p>
        <p style={{ fontSize: '0.9375rem', fontFamily: 'monospace' }}>{MAIL}</p>

        <p className="contact-section-title">件名の例</p>
        <ul className="contact-info-list">
          <li>[calcnavi] ローン計算機について</li>
          <li>[calcnavi] 計算結果の誤りのご指摘</li>
          <li>[calcnavi] ご意見・ご要望</li>
        </ul>

        <p className="contact-section-title">お問い合わせ時に書いていただくと助かる情報</p>
        <ul className="contact-info-list">
          <li>お使いのOS（Windows / Mac / iOS / Android）</li>
          <li>お使いのブラウザ（Chrome / Safari / Firefox 等）</li>
          <li>ご利用のツール名</li>
          <li>入力した値と期待していた結果</li>
        </ul>

        <p className="contact-section-title">返信について</p>
        <ul className="contact-info-list">
          <li>返信目安：数日以内（内容によっては返信できない場合があります）</li>
          <li>
            個人情報の取り扱いは<Link href="/privacy">プライバシーポリシー</Link>をご参照ください。
          </li>
        </ul>
      </div>
    </main>
  );
}

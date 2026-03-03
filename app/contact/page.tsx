import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import ContactForm from './ContactForm';

export const metadata: Metadata = buildMetadata({
  title: 'お問い合わせ',
  description: 'calcnavi（計算ナビ）へのご意見・ご質問はこちら。フォームに入力してメールで送信できます。',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <main className="contact-wrap">
      <h1 className="page-title">お問い合わせ</h1>
      <ContactForm />
    </main>
  );
}

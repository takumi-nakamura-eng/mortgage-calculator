'use client';

import { useState } from 'react';
import Link from 'next/link';

const MAIL = 'contact.calcnavi@gmail.com';
const TYPES = ['不具合報告', '機能のご要望', 'その他'];

type F = { company: string; name: string; email: string; type: string; body: string };
type E = Partial<Record<keyof F, string>>;

export default function ContactForm() {
  const [f, setF] = useState<F>({ company: '', name: '', email: '', type: '', body: '' });
  const [errors, setErrors] = useState<E>({});
  const [ready, setReady] = useState(false);

  const set =
    (k: keyof F) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF((prev) => ({ ...prev, [k]: e.target.value }));

  const validate = (): E => {
    const e: E = {};
    if (!f.name.trim()) e.name = 'お名前を入力してください';
    if (!f.email.trim()) e.email = 'メールアドレスを入力してください';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      e.email = '正しいメールアドレスの形式で入力してください';
    if (!f.type) e.type = 'お問い合わせ種別を選択してください';
    if (!f.body.trim()) e.body = 'お問い合わせ内容を入力してください';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const subject = encodeURIComponent(`[calcnavi] お問い合わせ（${f.type}）`);
    const body = encodeURIComponent(
      `会社名：${f.company.trim() || '（なし）'}\nお名前：${f.name}\nメールアドレス：${f.email}\nお問い合わせ種別：${f.type}\n\n【お問い合わせ内容】\n${f.body}`
    );
    window.location.href = `mailto:${MAIL}?subject=${subject}&body=${body}`;
    setReady(true);
  };

  return (
    <div className="contact-card">
      <p style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>
        ご質問・ご意見・不具合報告などをフォームに入力して送信してください。
        送信ボタンを押すとメール作成画面が開きます。
      </p>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="company">会社名（任意）</label>
          <input id="company" type="text" value={f.company} onChange={set('company')} placeholder="例：株式会社〇〇" />
        </div>

        <div className="form-group">
          <label htmlFor="name">お名前 <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>必須</span></label>
          <input
            id="name"
            type="text"
            value={f.name}
            onChange={set('name')}
            placeholder="例：山田 太郎"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">メールアドレス <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>必須</span></label>
          <input
            id="email"
            type="email"
            value={f.email}
            onChange={set('email')}
            placeholder="例：your@email.com"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">お問い合わせ種別 <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>必須</span></label>
          <select
            id="type"
            value={f.type}
            onChange={set('type')}
            className={errors.type ? 'input-error' : ''}
          >
            <option value="">選択してください</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="body">お問い合わせ内容 <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>必須</span></label>
          <textarea
            id="body"
            value={f.body}
            onChange={set('body')}
            placeholder="お問い合わせの内容を入力してください"
            className={errors.body ? 'input-error' : ''}
          />
          {errors.body && <span className="error-message">{errors.body}</span>}
        </div>

        {ready && (
          <p className="saved-notice">
            メール作成画面を開きます。内容を確認して送信してください。
          </p>
        )}

        <div className="form-submit-row">
          <button type="submit" className="btn-primary">送信する</button>
        </div>
      </form>

      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
        個人情報の取り扱いは<Link href="/privacy">プライバシーポリシー</Link>をご参照ください。
        返信目安：数日以内（内容によっては返信できない場合があります）。
      </p>
    </div>
  );
}

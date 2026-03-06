'use client';

import { useState } from 'react';
import Link from 'next/link';

const MAIL = 'contact.calcnavi@gmail.com';
const TYPES = ['不具合報告', '機能のご要望', 'その他'];

type ContactFormValues = {
  company: string;
  name: string;
  email: string;
  type: string;
  body: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export default function ContactForm() {
  const [formValues, setFormValues] = useState<ContactFormValues>({ company: '', name: '', email: '', type: '', body: '' });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [ready, setReady] = useState(false);

  const setField =
    (k: keyof ContactFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormValues((prev) => ({ ...prev, [k]: e.target.value }));

  const validate = (): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};
    if (!formValues.name.trim()) nextErrors.name = 'お名前を入力してください';
    if (!formValues.email.trim()) nextErrors.email = 'メールアドレスを入力してください';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = '正しいメールアドレスの形式で入力してください';
    }
    if (!formValues.type) nextErrors.type = 'お問い合わせ種別を選択してください';
    if (!formValues.body.trim()) nextErrors.body = 'お問い合わせ内容を入力してください';
    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const subject = encodeURIComponent(`[calcnavi] お問い合わせ（${formValues.type}）`);
    const body = encodeURIComponent(
      `会社名：${formValues.company.trim() || '（なし）'}\nお名前：${formValues.name}\nメールアドレス：${formValues.email}\nお問い合わせ種別：${formValues.type}\n\n【お問い合わせ内容】\n${formValues.body}`
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
          <input id="company" type="text" value={formValues.company} onChange={setField('company')} placeholder="例：株式会社〇〇" />
        </div>

        <div className="form-group">
          <label htmlFor="name">お名前 <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>必須</span></label>
          <input
            id="name"
            type="text"
            value={formValues.name}
            onChange={setField('name')}
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
            value={formValues.email}
            onChange={setField('email')}
            placeholder="例：your@email.com"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">お問い合わせ種別 <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>必須</span></label>
          <select
            id="type"
            value={formValues.type}
            onChange={setField('type')}
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
            value={formValues.body}
            onChange={setField('body')}
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

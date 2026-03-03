import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '運営者情報',
  description:
    'calcnavi（計算ナビ）の運営者情報。運営目的・専門領域・サイト方針についてご案内します。',
  path: '/about',
});

export default function AboutPage() {
  return (
    <main className="container">
      <h1 className="page-title">運営者情報</h1>
      <div className="static-content">
        <h2>運営者プロフィール</h2>
        <ul>
          <li>
            <strong>専門領域</strong>：機械設計（鉄骨部材・設備架台・配管サポートなどの構造設計）
          </li>
          <li>
            <strong>実務経験</strong>：製造業にて設備設計・施工管理の実務経験あり
          </li>
          <li>
            <strong>技術領域</strong>：ボルト締結設計、梁・断面の強度計算、JIS規格に基づく部材選定
          </li>
        </ul>

        <h2>サイト開設の目的</h2>
        <p>
          機械設計の実務で繰り返し使う計算（ボルト長さ、梁のたわみ、断面性能など）を
          誰でも無料で使えるWebツールとして提供することを目的に、calcnaviを開設しました。
          計算ツールと合わせて、設計判断に必要な背景知識を解説記事として発信しています。
        </p>

        <h2>コンテンツ方針</h2>
        <ul>
          <li>計算ツールは JIS 規格・学協会規準に基づき、途中式と判定根拠を明示します。</li>
          <li>解説記事は一次資料（JIS・建築学会規準・メーカー技術資料）を最低3件引用し、参照日を付記します。</li>
          <li>すべての記事に SVG 図解・比較表・計算例・FAQ を含め、実務で即使える情報提供を目指します。</li>
          <li>
            詳細は<a href="/editorial-policy">編集ポリシー</a>をご覧ください。
          </li>
        </ul>

        <h2>お問い合わせ</h2>
        <p>
          ご質問・ご意見・不具合報告は<a href="/contact">お問い合わせページ</a>よりご連絡ください。
        </p>
      </div>
    </main>
  );
}

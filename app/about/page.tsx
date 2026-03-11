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
        <table className="about-profile-table">
          <tbody>
            <tr>
              <th>運営者名</th>
              <td>E. Pascal（ペンネーム）</td>
            </tr>
            <tr>
              <th>運営体制</th>
              <td>calcnavi 個人運営</td>
            </tr>
            <tr>
              <th>所在地</th>
              <td>日本</td>
            </tr>
            <tr>
              <th>専門領域</th>
              <td>上下水道設備のプラント設計、設備検討、設計実務で使う計算・一次判断の整理</td>
            </tr>
            <tr>
              <th>実務経験</th>
              <td>上下水道設備分野の設計実務をベースに運営</td>
            </tr>
            <tr>
              <th>専門資格</th>
              <td>公開可能な資格情報は順次整備中です。現時点では実務経験と一次資料に基づいて監修しています。</td>
            </tr>
            <tr>
              <th>主要実績</th>
              <td>設備設計で繰り返し使う計算・確認フローを Web ツールとして整理し、再利用しやすい形に運用</td>
            </tr>
          </tbody>
        </table>

        <p>
          E. Pascal は、設計・計算・実務に役立つ工学知を整理して届けることを意識したペンネームです。
          Work Shift Studio として、機械設計・施工実務に役立つ計算ツールと技術解説の提供を通じて、
          実務で使いやすく、根拠を確認しやすい情報発信を目指しています。
        </p>

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
          ご質問・ご意見・不具合報告は<a href="/contact">お問い合わせページ</a>よりご連絡ください。運営連絡用メールは
          {' '}<a href="mailto:contact.calcnavi@gmail.com">contact.calcnavi@gmail.com</a> です。
        </p>
      </div>
    </main>
  );
}

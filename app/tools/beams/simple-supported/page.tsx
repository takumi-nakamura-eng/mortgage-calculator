import type { Metadata } from 'next';
import SimpleSupportedCalculator from './SimpleSupportedCalculator';

export const metadata: Metadata = {
  title: '単純梁（単純支持）計算 | 曲げ応力・最大たわみ',
  description:
    '単純支持梁（ピン・ローラー）の曲げ応力とたわみを計算します。中央集中荷重・等分布荷重に対応。OK/NG判定つき。',
};

export default function SimpleSupportedPage() {
  return (
    <main className="container">
      <h1 className="page-title">単純梁（単純支持）計算</h1>
      <p className="page-description">
        ピン・ローラー支持の単純梁に対して、曲げ応力・最大たわみを計算し OK/NG 判定を行います。
        中央集中荷重・等分布荷重（総荷重入力）に対応。
      </p>
      <SimpleSupportedCalculator />
    </main>
  );
}

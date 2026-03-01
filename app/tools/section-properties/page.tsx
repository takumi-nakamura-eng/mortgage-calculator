import type { Metadata } from 'next';
import SectionPropertiesCalculator from './SectionPropertiesCalculator';

export const metadata: Metadata = {
  title: '断面性能計算ツール | I・Z・断面積・重量を計算',
  description:
    'H形鋼・角形鋼管・丸形鋼管・フラットバー・アングル・チャンネルの断面二次モーメント（I）・断面係数（Z）・断面積・重量を計算します。強軸・弱軸対応。',
};

export default function SectionPropertiesPage() {
  return (
    <main className="container">
      <h1 className="page-title">断面性能計算ツール</h1>
      <p className="page-description">
        断面形状と寸法を入力すると、断面二次モーメント（I）・断面係数（Z）・断面積・重量を計算します。
        強軸・弱軸の両方に対応。梁設計・柱設計の断面選定にご活用ください。
      </p>
      <SectionPropertiesCalculator />
    </main>
  );
}

interface ToolDisclaimerProps {
  text?: string;
}

const DEFAULT_DISCLAIMER =
  '本ツールの結果は参考値です。最終確認は規格・メーカー・専門家にお問い合わせください。';

export default function ToolDisclaimer({ text = DEFAULT_DISCLAIMER }: ToolDisclaimerProps) {
  return (
    <div className="tool-disclaimer" role="note" aria-label="免責事項">
      <span className="tool-disclaimer__icon" aria-hidden="true">⚠️</span>
      <p className="tool-disclaimer__text">{text}</p>
    </div>
  );
}

import type { ReactNode } from 'react';

type BeamCalculatorLayoutProps = {
  diagram: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
};

export default function BeamCalculatorLayout({ diagram, onSubmit, children }: BeamCalculatorLayoutProps) {
  return (
    <div>
      <div className="beam-diagram-wrapper">{diagram}</div>
      <form className="beam-form" onSubmit={onSubmit} noValidate>
        {children}
      </form>
    </div>
  );
}

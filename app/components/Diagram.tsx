import { DiagramRenderer, type DiagramProps } from '@/lib/diagrams/registry';

export default function Diagram(props: DiagramProps) {
  return <DiagramRenderer kind="article" {...props} />;
}

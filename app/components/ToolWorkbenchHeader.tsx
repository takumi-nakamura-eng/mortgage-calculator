interface ToolWorkbenchHeaderProps {
  title: string;
  icon?: string;
}

export default function ToolWorkbenchHeader({
  title,
  icon = '✍️',
}: ToolWorkbenchHeaderProps) {
  return (
    <div className="tool-workbench__header">
      <h2 className="tool-workbench__title">
        <span className="tool-workbench__title-icon" aria-hidden="true">{icon}</span>
        {title}
      </h2>
    </div>
  );
}

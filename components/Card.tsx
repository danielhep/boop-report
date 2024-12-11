export default function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`bg-background-secondary rounded-lg p-4 shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ 
  children, 
  rightContent 
}: { 
  children: React.ReactNode;
  rightContent?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-lg font-semibold mb-4">
      <div>{children}</div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
}

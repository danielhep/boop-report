export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-background-secondary rounded-lg p-4 shadow-sm">{children}</div>;
}

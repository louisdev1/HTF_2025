interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  subtitle?: string;
  gradient: string;
}

export default function StatsCard({ title, value, icon, subtitle, gradient }: StatsCardProps) {
  return (
    <div className={`card p-6 bg-gradient-to-br ${gradient} text-white animate-fade-in`}>
      <div className="text-5xl mb-3">{icon}</div>
      <div className="text-sm font-medium opacity-90 mb-1">{title}</div>
      <div className="text-4xl font-bold mb-1">{value}</div>
      {subtitle && <div className="text-sm opacity-80">{subtitle}</div>}
    </div>
  );
}

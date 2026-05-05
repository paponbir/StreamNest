interface SkeletonCardProps {
  className?: string;
}

export default function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`relative min-w-[160px] md:min-w-[200px] h-[240px] md:h-[300px] rounded-3xl overflow-hidden bg-slate-800 shadow-lg ${className}`}>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 opacity-90" />
      <div className="absolute inset-x-0 bottom-0 p-4 space-y-3">
        <div className="h-4 w-3/4 rounded-full bg-slate-700" />
        <div className="h-3 w-5/6 rounded-full bg-slate-700" />
        <div className="h-3 w-1/2 rounded-full bg-slate-700" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
    </div>
  );
}

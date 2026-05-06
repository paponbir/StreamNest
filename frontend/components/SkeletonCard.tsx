interface SkeletonCardProps {
  className?: string;
}

export default function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`snap-start relative min-w-[160px] md:min-w-[200px] h-[240px] md:h-[300px] rounded-lg overflow-hidden bg-[#141414] shadow-lg ${className}`}>
      <div className="absolute inset-0 animate-pulse bg-[#1f1f1f] duration-1000" />
      <div className="absolute inset-x-0 bottom-0 p-4 space-y-3 z-10">
        <div className="h-4 w-3/4 rounded-full bg-[#2a2a2a] animate-pulse duration-1000" />
        <div className="h-3 w-5/6 rounded-full bg-[#2a2a2a] animate-pulse duration-1000" />
        <div className="h-3 w-1/2 rounded-full bg-[#2a2a2a] animate-pulse duration-1000" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

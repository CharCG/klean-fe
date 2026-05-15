import SkeletonCard from './SkeletonCard';

export default function PageSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div
        className="h-8 rounded-lg w-1/3 animate-pulse"
        style={{ backgroundColor: 'var(--color-stroke)' }}
      />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

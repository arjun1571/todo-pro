export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded"
        />
      ))}
    </div>
  );
}

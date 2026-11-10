// StatGrid (MDX-callable,): number tiles (e.g. Fonds split).
export function StatGrid({
  items,
}: {
  items: readonly { value: string; label: string }[];
}) {
  return (
    <dl className="stat-grid">
      {items.map((item, i) => (
        <div key={i} className="stat-grid__tile">
          <dt className="stat-grid__label">{item.label}</dt>
          <dd className="stat-grid__value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
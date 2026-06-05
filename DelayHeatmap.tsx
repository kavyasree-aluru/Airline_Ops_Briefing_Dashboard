import { useOps } from '../context/OpsContext';

function level(value: number) {
  if (value >= 25) return 'hot';
  if (value >= 15) return 'warm';
  return 'cool';
}

export function DelayHeatmap() {
  const { delays } = useOps();
  return <section className="panel"><h3>Delay Heatmap</h3><table><thead><tr><th>Route</th><th>Morning</th><th>Afternoon</th><th>Evening</th></tr></thead><tbody>{delays.map(row => <tr key={row.route}><td>{row.route}</td><td className={level(row.morning)}>{row.morning}m</td><td className={level(row.afternoon)}>{row.afternoon}m</td><td className={level(row.evening)}>{row.evening}m</td></tr>)}</tbody></table></section>;
}

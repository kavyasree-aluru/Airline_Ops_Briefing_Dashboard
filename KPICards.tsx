import { useOps } from '../context/OpsContext';

export function KPICards() {
  const { kpis } = useOps();
  return <section className="grid cards">{kpis.map(kpi => <article className="card" key={kpi.label}><p>{kpi.label}</p><h2>{kpi.value}</h2><span>{kpi.trend}</span></article>)}</section>;
}

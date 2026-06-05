import { AlertTriangle } from 'lucide-react';
import { useOps } from '../context/OpsContext';

export function GateConflictAlert() {
  const { conflicts } = useOps();
  return <section className="panel"><h3>Gate Conflict Alerts</h3>{conflicts.map(item => <div className={`alert ${item.severity.toLowerCase()}`} key={item.gate}><AlertTriangle size={18} /><div><b>Gate {item.gate} · {item.severity}</b><p>{item.message}</p><small>Flights: {item.flights.join(', ')}</small></div></div>)}</section>;
}

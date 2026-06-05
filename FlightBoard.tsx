import { useOps } from '../context/OpsContext';

export function FlightBoard() {
  const { flights } = useOps();
  return <section className="panel"><h3>Departure Board</h3><table><thead><tr><th>Flight</th><th>Destination</th><th>Gate</th><th>Time</th><th>Status</th></tr></thead><tbody>{flights.map(flight => <tr key={flight.id}><td>{flight.id}</td><td>{flight.destination}</td><td>{flight.gate}</td><td>{flight.time}</td><td><span className="pill">{flight.status}</span></td></tr>)}</tbody></table></section>;
}

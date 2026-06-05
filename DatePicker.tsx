import { useOps } from '../context/OpsContext';

export function DatePicker() {
  const { date, setDate } = useOps();
  return <label className="date-picker">Briefing Date <input type="date" value={date} onChange={event => setDate(event.target.value)} /></label>;
}

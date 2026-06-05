import { useOps } from '../context/OpsContext';

export function SlotChart() {
  const { slots } = useOps();
  return <section className="panel"><h3>Slot Utilisation</h3>{slots.map(slot => {
    const percent = Math.round((slot.used / slot.capacity) * 100);
    return <div className="bar-row" key={slot.hour}><span>{slot.hour}</span><div className="bar"><div style={{ width: `${percent}%` }} /></div><b>{percent}%</b></div>;
  })}</section>;
}

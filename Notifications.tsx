import { Bell } from 'lucide-react';
import { useOps } from '../context/OpsContext';

export function Notifications() {
  const { notifications } = useOps();
  return <section className="panel"><h3>Notifications</h3>{notifications.map(note => <div className="note" key={note.id}><Bell size={16} /><div><b>{note.title}</b><p>{note.text}</p><small>{note.time}</small></div></div>)}</section>;
}

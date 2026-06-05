import { useState } from 'react';

export function AdminPanel() {
  const [threshold, setThreshold] = useState(() => localStorage.getItem('delayThreshold') || '20');
  const save = () => localStorage.setItem('delayThreshold', threshold);
  return <section className="panel"><h3>Admin Panel</h3><p>Configure operational thresholds used by managers.</p><label>Delay threshold<input value={threshold} onChange={event => setThreshold(event.target.value)} /></label><button onClick={save}>Save Settings</button></section>;
}

import { useOps } from '../context/OpsContext';

export function StaffTable() {
  const { staff } = useOps();
  return <section className="panel"><h3>Staff Table</h3><table><thead><tr><th>Name</th><th>Role</th><th>Shift</th><th>Status</th></tr></thead><tbody>{staff.map(member => <tr key={member.id}><td>{member.name}</td><td>{member.role}</td><td>{member.shift}</td><td><span className="pill">{member.status}</span></td></tr>)}</tbody></table></section>;
}

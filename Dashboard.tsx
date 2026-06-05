import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CloudSun,
  FileDown,
  Plane,
  RefreshCw,
  ShieldAlert,
  TicketCheck,
  Users,
} from "lucide-react";

type KpiColor = "blue" | "green" | "amber" | "cyan" | "red" | "purple" | "orange";

type Flight = {
  code: string;
  destination: string;
  gate: string;
  time: string;
  status: string;
  level: "ok" | "minor" | "major";
};

type StaffMember = {
  name: string;
  role: string;
  shift: string;
  status: string;
  level: "green" | "amber" | "red";
};

type Conflict = {
  gate: string;
  title: string;
  desc: string;
  level: "critical" | "high" | "medium";
};

type BriefingData = {
  totalFlights: number;
  onTimeRate: number;
  avgDelay: number;
  slotUse: number;
  gateConflicts: number;
  staffOnDuty: number;
  bagIssues: number;
  passengerLoad: number;
  temp: number;
  visibility: number;
  wind: number;
  humidity: number;
  slotHours: number[];
  heatmap: number[];
  flights: Flight[];
  staff: StaffMember[];
  conflicts: Conflict[];
};

const destinations = ["Delhi", "Mumbai", "Chennai", "Dubai", "Goa", "Kolkata", "Bengaluru"];
const flightPrefixes = ["AI", "6E", "UK", "SG", "IX", "QP"];
const staffNames = ["Priya Sharma", "Rahul Singh", "Kiran Rao", "Neha Gupta", "Arjun Menon", "Sara Khan"];
const roles = ["Gate Agent", "Ramp Supervisor", "ATC Officer", "Security Lead", "Load Controller"];
const shifts = ["Morning", "Afternoon", "Night"];
const conflictTitles = ["Double Booking Detected", "Turnaround Time Low", "Aircraft Size Conflict"];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function hashSeed(value: string) {
  return value.split("").reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function seededRandom(seedValue: string) {
  let seed = hashSeed(seedValue);

  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function between(random: () => number, min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick<T>(items: T[], random: () => number) {
  return items[Math.floor(random() * items.length)];
}

function makeBriefingData(date: string, refreshKey: number): BriefingData {
  const random = seededRandom(`${date}-${refreshKey}`);
  const totalFlights = between(random, 285, 345);
  const onTimeRate = between(random, 78, 93);
  const avgDelay = between(random, 9, 31);
  const gateConflicts = between(random, 2, 8);

  const flights: Flight[] = Array.from({ length: 6 }, () => {
    const delay = between(random, 0, 55);
    const hour = between(random, 6, 22).toString().padStart(2, "0");
    const minute = [0, 5, 10, 20, 30, 40, 50][between(random, 0, 6)].toString().padStart(2, "0");
    const level: Flight["level"] = delay > 30 ? "major" : delay > 8 ? "minor" : "ok";

    return {
      code: `${pick(flightPrefixes, random)}${between(random, 101, 989)}`,
      destination: pick(destinations, random),
      gate: `${String.fromCharCode(65 + between(random, 0, 3))}${between(random, 1, 24)}`,
      time: `${hour}:${minute}`,
      status: delay === 0 ? "ON TIME" : `+${delay} min`,
      level,
    };
  });

  const staff: StaffMember[] = Array.from({ length: 5 }, (_, index) => {
    const pressure = between(random, 1, 10);
    const level: StaffMember["level"] = pressure > 8 ? "red" : pressure > 5 ? "amber" : "green";

    return {
      name: staffNames[(index + between(random, 0, staffNames.length - 1)) % staffNames.length],
      role: pick(roles, random),
      shift: pick(shifts, random),
      status: level === "red" ? "Critical" : level === "amber" ? "Break" : "On Duty",
      level,
    };
  });

  const conflicts: Conflict[] = Array.from({ length: 3 }, (_, index) => {
    const level: Conflict["level"] = index === 0 ? "critical" : index === 1 ? "high" : "medium";
    const gate = flights[index]?.gate ?? `B${index + 10}`;

    return {
      gate,
      title: conflictTitles[index],
      desc:
        index === 0
          ? `${flights[0].code} and ${flights[1].code} need the same gate window.`
          : index === 1
            ? "Boarding buffer is below the recommended turnaround threshold."
            : "Stand allocation needs review before final release.",
      level,
    };
  });

  return {
    totalFlights,
    onTimeRate,
    avgDelay,
    slotUse: between(random, 82, 96),
    gateConflicts,
    staffOnDuty: between(random, 148, 182),
    bagIssues: between(random, 4, 15),
    passengerLoad: between(random, 76, 94),
    temp: between(random, 24, 34),
    visibility: between(random, 4, 10),
    wind: between(random, 8, 24),
    humidity: between(random, 52, 86),
    slotHours: Array.from({ length: 7 }, () => between(random, 54, 94)),
    heatmap: Array.from({ length: 84 }, () => between(random, 0, 3)),
    flights,
    staff,
    conflicts,
  };
}

export function Dashboard() {
  const [tab, setTab] = useState("ops");
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [refreshKey, setRefreshKey] = useState(0);
  const data = useMemo(() => makeBriefingData(selectedDate, refreshKey), [selectedDate, refreshKey]);

  const kpis: Array<[React.ReactNode, string, string, string, KpiColor]> = [
    [<Plane size={22} />, "Total Flights", String(data.totalFlights), "+12", "blue"],
    [<TicketCheck size={22} />, "On-Time Rate", `${data.onTimeRate}%`, "+2.1%", "green"],
    [<AlertTriangle size={22} />, "Avg Delay", `${data.avgDelay} min`, "-3 min", "amber"],
    [<BarChart3 size={22} />, "Slot Utilisation", `${data.slotUse}%`, "LIVE", "cyan"],
    [<ShieldAlert size={22} />, "Gate Conflicts", String(data.gateConflicts), "HIGH", "red"],
    [<Users size={22} />, "Staff On Duty", String(data.staffOnDuty), "+6", "purple"],
    [<BriefcaseBusiness size={22} />, "Bag Issues", String(data.bagIssues), "-2", "orange"],
    [<CalendarDays size={22} />, "Passenger Load", `${data.passengerLoad}%`, "+1.2%", "blue"],
  ];

  return (
    <div className="aero-shell">
      <div className="topnav">
        <div className="brand">
          <div className="logo"><Plane size={20} /></div>
          <div>
            <h2>AEROOPS</h2>
            <p>Command Center</p>
          </div>
        </div>

        <div className="tabs">
          {["ops", "flights", "staff", "slots", "admin"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={tab === t ? "active" : ""}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="live">LIVE</div>
      </div>

      <main className="main-content">
        <div className="date-bar">
          <span>Briefing Date</span>
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          <select>
            <option>All Shifts</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Night</option>
          </select>
          <select>
            <option>HYD / RGIA</option>
            <option>DEL / IGIA</option>
            <option>BOM / CSIA</option>
          </select>
          <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>
            <RefreshCw size={16} /> Refresh Data
          </button>
          <button type="button" className="export">
            <FileDown size={16} /> Export Briefing
          </button>
        </div>

        <section className="kpi-grid">
          {kpis.map(([icon, label, value, trend, color]) => (
            <div className={`kpi-card ${color}`} key={label}>
              <div className="kpi-top">
                <span>{icon}</span>
                <small>{trend}</small>
              </div>
              <h1>{value}</h1>
              <p>{label}</p>
            </div>
          ))}
        </section>

        {tab === "ops" && (
          <>
            <section className="grid-two">
              <div className="panel span2">
                <h3>Slot Utilisation Chart</h3>
                {["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"].map((h, i) => (
                  <div className="slot-row" key={h}>
                    <span>{h}</span>
                    <div className="slot-track">
                      <div className="used" style={{ width: `${data.slotHours[i]}%` }} />
                      <div className="delayed" style={{ width: `${Math.max(8, data.avgDelay / 2)}%` }} />
                      <div className="free" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="panel weather">
                <h3>METAR / Weather</h3>
                <div className="weather-main">
                  <CloudSun size={54} />
                  <h1>{data.temp}C</h1>
                </div>
                <p>Operational weather watch is active for the selected briefing date.</p>
                <div className="weather-grid">
                  <div>Visibility<br /><b>{data.visibility} km</b></div>
                  <div>Wind<br /><b>{data.wind} KT</b></div>
                  <div>QNH<br /><b>1012</b></div>
                  <div>Humidity<br /><b>{data.humidity}%</b></div>
                </div>
              </div>
            </section>

            <section className="grid-two">
              <div className="panel">
                <h3>Delay Heatmap</h3>
                <div className="heatmap">
                  {data.heatmap.map((level, i) => (
                    <span key={`${selectedDate}-${refreshKey}-${i}`} className={`h${level}`} />
                  ))}
                </div>
              </div>

              <div className="panel">
                <h3>Gate Conflict Alerts</h3>
                {data.conflicts.map((conflict) => (
                  <div className={`conflict ${conflict.level}`} key={`${conflict.gate}-${conflict.title}`}>
                    <b>GATE {conflict.gate}</b>
                    <h4>{conflict.title}</h4>
                    <p>{conflict.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === "flights" && (
          <div className="panel">
            <h3>Flight Departure Board</h3>
            <table>
              <thead>
                <tr>
                  <th>Flight</th>
                  <th>Destination</th>
                  <th>Gate</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.flights.map((flight) => (
                  <tr key={flight.code}>
                    <td>{flight.code}</td>
                    <td>{flight.destination}</td>
                    <td>{flight.gate}</td>
                    <td>{flight.time}</td>
                    <td><span className={`badge ${flight.level}`}>{flight.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "staff" && (
          <div className="panel">
            <h3>Staff & Roster</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Shift</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.staff.map((member) => (
                  <tr key={`${member.name}-${member.role}`}>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td>{member.shift}</td>
                    <td><span className={`badge ${member.level}`}>{member.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "slots" && (
          <div className="panel">
            <h3>Slot Analysis</h3>
            <p className="muted">
              Slot utilisation compares used, delayed, and available airport slots across operational hours.
            </p>
            {["Morning Peak", "Afternoon", "Evening Peak", "Night"].map((x, i) => (
              <div className="slot-row" key={x}>
                <span>{x}</span>
                <div className="slot-track">
                  <div className="used" style={{ width: `${Math.min(96, data.slotUse - 10 + i * 4)}%` }} />
                  <div className="delayed" style={{ width: `${Math.max(9, data.avgDelay / 2)}%` }} />
                  <div className="free" />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "admin" && (
          <div className="panel">
            <h3>Admin Panel</h3>
            <div className="admin-grid">
              <label><input type="checkbox" defaultChecked /> Auto Refresh</label>
              <label><input type="checkbox" defaultChecked /> Conflict Alerts</label>
              <label><input type="checkbox" /> Sound Alerts</label>
              <label><input type="checkbox" defaultChecked /> Weather Warnings</label>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

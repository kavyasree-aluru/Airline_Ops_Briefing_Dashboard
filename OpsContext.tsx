import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { getOpsBriefing } from '../services/opsService';
import { DelayCell, Flight, GateConflict, KPI, NotificationItem, SlotData, StaffMember } from '../types/ops';

interface OpsState {
  date: string;
  setDate: (date: string) => void;
  loading: boolean;
  kpis: KPI[];
  slots: SlotData[];
  delays: DelayCell[];
  staff: StaffMember[];
  flights: Flight[];
  conflicts: GateConflict[];
  notifications: NotificationItem[];
}

const OpsContext = createContext<OpsState | null>(null);

export function OpsProvider({ children }: { children: ReactNode }) {
  const [date, setDateState] = useState(() => localStorage.getItem('briefingDate') || new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Omit<OpsState, 'date' | 'setDate' | 'loading'>>({
    kpis: [], slots: [], delays: [], staff: [], flights: [], conflicts: [], notifications: []
  });

  const setDate = (nextDate: string) => {
    localStorage.setItem('briefingDate', nextDate);
    setDateState(nextDate);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOpsBriefing().then(result => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [date]);

  const value = useMemo(() => ({ date, setDate, loading, ...data }), [date, loading, data]);
  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps() {
  const context = useContext(OpsContext);
  if (!context) throw new Error('useOps must be used inside OpsProvider');
  return context;
}

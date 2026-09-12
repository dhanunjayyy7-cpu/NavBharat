function Stat({ label, value, sub, accent, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl bg-white px-4 py-3 text-left shadow-md transition hover:shadow-lg ${
        active ? 'ring-2 ring-[#2196F3] shadow-[#2196F3]/10' : 'ring-1 ring-black/5'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: accent }}>
        {value}
      </p>
      <p className="text-[11px] text-[#94a3b8]">{sub}</p>
    </button>
  )
}

export default function StatCards({ potholesToday, crowdToday, incidentsToday, highSeverity, activeBuses, activeCard, onCardClick }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat
        label="Road defects today"
        value={potholesToday}
        sub={`${highSeverity} high severity`}
        accent="#ea580c"
        icon="🛣️"
        active={activeCard === 'defects'}
        onClick={() => onCardClick('defects')}
      />
      <Stat
        label="Crowd alerts today"
        value={crowdToday}
        sub="threshold breaches"
        accent="#d97706"
        icon="👥"
        active={activeCard === 'crowd'}
        onClick={() => onCardClick('crowd')}
      />
      <Stat
        label="Passenger reports"
        value={incidentsToday}
        sub="incidents today"
        accent="#9333ea"
        icon="🚨"
        active={activeCard === 'reports'}
        onClick={() => onCardClick('reports')}
      />
      <Stat
        label="Fleet online"
        value={activeBuses}
        sub="vehicles streaming"
        accent="#2196F3"
        icon="🚌"
        active={activeCard === 'fleet'}
        onClick={() => onCardClick('fleet')}
      />
    </div>
  )
}

import { ROLES } from '../lib/mockData'
import { login } from '../lib/store'

export default function LoginScreen() {
  const handleLogin = (role) => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    login(role.id)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1B3A6B] shadow-lg shadow-[#1B3A6B]/20">
            <span className="text-2xl font-bold text-white">N</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-[#1B3A6B]">NavBharat Transit</h1>
          <p className="mt-1 text-sm text-[#64748b]">AI-Powered Urban Intelligence Platform · BMTC Bengaluru</p>
          <p className="mt-4 text-xs text-[#94a3b8] bg-white rounded-full px-4 py-1.5 shadow-sm ring-1 ring-black/5">
            Demo Mode — Select your role to enter
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => handleLogin(role)}
              className="group rounded-2xl bg-white p-6 text-left shadow-md ring-1 ring-black/5 transition hover:shadow-lg hover:ring-[#2196F3]/30 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B3A6B]/8 text-xl">
                  {role.icon}
                </span>
                <div>
                  <p className="font-bold text-[#1B3A6B]">{role.label}</p>
                  <p className="text-xs text-[#94a3b8]">{role.desc}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#2196F3] opacity-0 transition group-hover:opacity-100">
                Enter dashboard
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

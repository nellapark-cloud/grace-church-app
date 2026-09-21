import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { subscribePendingRegistrations } from '../lib/registrations'

const navItems = [
  { to: '/', label: '재적부' },
  { to: '/members/new', label: '교인 등록' },
  { to: '/approvals', label: '가입 승인' },
  { to: '/settings', label: '설정' },
]

export function Layout({ children }: { children: ReactNode }) {
  const { user, demo, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribePendingRegistrations(
      (regs) => setPendingCount(regs.length),
      () => {},
    )
    return unsubscribe
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <span className="text-base font-semibold tracking-tight text-gray-900">
              은혜교회 재적부
            </span>
            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.label}
                  {item.to === '/approvals' && pendingCount > 0 && (
                    <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-xs text-gray-400">{user?.email}</span>
            {!demo && (
              <button
                onClick={handleLogout}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                로그아웃
              </button>
            )}
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 sm:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="메뉴"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-2 sm:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
                {item.to === '/approvals' && pendingCount > 0 && (
                  <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            ))}
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 px-3 py-2">
              <span className="text-xs text-gray-400">{user?.email}</span>
              {!demo && (
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600"
                >
                  로그아웃
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {demo && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800 sm:px-6">
          데모 모드 · 이 브라우저에만 저장되며 기기 간 공유되지 않습니다. 실제
          운영하려면 README를 참고해 Firebase를 연결하세요.
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>

      <footer className="pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 text-center text-xs text-gray-400">
        기독교한국침례회 은혜교회
      </footer>
    </div>
  )
}

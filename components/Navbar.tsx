'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Heart, Menu, X, Home, LayoutDashboard, Sparkles, DollarSign, LogOut, Crown, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  user?: {
    id: string
    email?: string
  } | null
  userTier?: 'free' | 'premium' | 'pro'
}

export function Navbar({ user, userTier = 'free' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/', label: 'Home', icon: Home, show: true },
    { href: '/templates', label: 'Templates', icon: Sparkles, show: true },
    { href: '/pricing', label: 'Pricing', icon: DollarSign, show: true },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: !!user },
  ]

  // Don't show navbar on public page viewer
  if (pathname?.startsWith('/p/')) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Heart className="text-rose-500 group-hover:text-rose-600 transition-colors" size={28} fill="currentColor" />
              <div className="absolute inset-0 bg-rose-200 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
            </div>
            <span className="text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
              Heartful Pages
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks
              .filter(link => link.show)
              .map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 font-semibold'
                        : 'text-gray-700 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                )
              })}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-rose-200">
                {/* Tier Badge */}
                {userTier !== 'free' && (
                  <Link
                    href="/pricing"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:scale-105 transition-transform"
                  >
                    <Crown size={14} />
                    <span className="capitalize">{userTier}</span>
                  </Link>
                )}
                
                {/* Upgrade Button for Free Users */}
                {userTier === 'free' && (
                  <Link
                    href="/pricing"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold hover:scale-105 transition-transform"
                  >
                    <Crown size={14} />
                    <span>Upgrade</span>
                  </Link>
                )}

                {/* User Email */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 text-gray-700">
                  <User size={16} />
                  <span className="text-sm max-w-[120px] truncate">{user.email}</span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-4 px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-rose-50 active:bg-rose-100 transition-colors touch-manipulation"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-rose-100 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks
                .filter(link => link.show)
                .map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all touch-manipulation active:scale-95 ${
                        isActive(link.href)
                          ? 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 font-semibold'
                          : 'text-gray-700 hover:bg-rose-50 active:bg-rose-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}

              {/* Mobile User Menu */}
              {user ? (
                <div className="pt-4 mt-4 border-t border-rose-100 space-y-2">
                  {userTier !== 'free' && (
                    <Link
                      href="/pricing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                    >
                      <Crown size={18} />
                      <span className="capitalize">{userTier} Plan</span>
                    </Link>
                  )}
                  
                  {userTier === 'free' && (
                    <Link
                      href="/pricing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold"
                    >
                      <Crown size={18} />
                      <span>Upgrade to Premium</span>
                    </Link>
                  )}

                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-50 text-gray-700">
                    <User size={18} />
                    <span className="text-sm">{user.email}</span>
                  </div>

                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


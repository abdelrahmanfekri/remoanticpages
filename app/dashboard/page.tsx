import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Heart, Eye, BarChart3, Crown, Edit, Lock, Globe, Share2 } from 'lucide-react'
import { getUserTier } from '@/lib/subscription'
import { getTierDisplayName, getTierLimits, checkPageLimit, canUseFeature } from '@/lib/tiers'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const userTier = await getUserTier(user.id)
  const tierLimits = getTierLimits(userTier)

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const pageCount = pages?.length || 0
  const pageLimitCheck = checkPageLimit(userTier, pageCount)
  const canViewAnalytics = canUseFeature('analytics', userTier)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif text-rose-500 mb-2">My Love Pages</h1>
            <p className="text-gray-600">Create beautiful pages for the ones you love</p>
          </div>
          <div className="flex items-center gap-4">
            {userTier !== 'pro' && (
              <Link
                href={`/pricing?tier=${userTier === 'free' ? 'premium' : 'pro'}`}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:scale-105 transition-transform duration-200 font-semibold shadow-lg"
              >
                <Crown size={20} />
                {userTier === 'free' ? 'Upgrade to Premium' : 'Upgrade to Pro'}
              </Link>
            )}
            <Link
              href="/dashboard/create"
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full soft-glow hover:scale-105 transition-transform duration-200"
            >
              <Plus size={20} />
              Create New Page
            </Link>
          </div>
        </div>

        <div className="mb-8 inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-2 rounded-full">
          <Crown className="text-rose-600" size={18} />
          <span className="font-semibold text-rose-700">
            {getTierDisplayName(userTier)} Plan
          </span>
          {tierLimits.maxPages === Infinity ? (
            <span className="text-sm text-green-600">• Unlimited Pages</span>
          ) : (
            <span className="text-sm text-gray-600">
              • {pageCount}/{tierLimits.maxPages} pages
            </span>
          )}
        </div>

        {!pageLimitCheck.allowed && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="text-yellow-600 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">{pageLimitCheck.message}</p>
                <Link
                  href="/pricing?tier=premium"
                  className="text-sm text-yellow-700 underline mt-1 inline-block"
                >
                  Upgrade to Premium for unlimited pages
                </Link>
              </div>
            </div>
          </div>
        )}

        {pages && pages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <div
                key={page.id}
                className="glass-card soft-glow p-6 hover:scale-105 transition-transform duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-serif text-rose-500 mb-1">{page.title}</h3>
                    <p className="text-sm text-gray-600">For {page.recipient_name}</p>
                  </div>
                  <Heart className="text-rose-300 flex-shrink-0" size={24} />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    {page.is_public ? (
                      <>
                        <Globe size={14} className="text-green-600" />
                        <span className="text-green-600">Public</span>
                      </>
                    ) : (
                      <>
                        <Lock size={14} className="text-gray-400" />
                        <span className="text-gray-400">Private</span>
                      </>
                    )}
                  </div>
                  {page.password && (
                    <span className="flex items-center gap-1">
                      <Lock size={14} />
                      Protected
                    </span>
                  )}
                </div>
                  {/* Analytics from page data */}
                  {canViewAnalytics && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Eye size={14} className="text-blue-600" />
                          <span className="font-medium">{page.view_count || 0}</span>
                          <span className="text-gray-500">views</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Share2 size={14} className="text-green-600" />
                          <span className="font-medium">{page.share_count || 0}</span>
                          <span className="text-gray-500">shares</span>
                        </div>
                      </div>
                    </div>
                  )}

                <div className="flex items-center gap-2">
                  <Link
                    href={`/p/${page.slug}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 bg-rose-100 text-rose-600 py-2 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                  <Link
                    href={`/dashboard/edit/${page.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="mx-auto text-rose-300 mb-4" size={64} />
            <h2 className="text-2xl font-serif text-gray-700 mb-2">No pages yet</h2>
            <p className="text-gray-600 mb-6">Create your first love page to get started!</p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full soft-glow hover:scale-105 transition-transform duration-200"
            >
              <Plus size={20} />
              Create Your First Page
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}


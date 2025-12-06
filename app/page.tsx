import Link from 'next/link'
import { Heart, Sparkles, CheckCircle, ArrowRight, Eye, Wand2, Brain, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      redirect('/dashboard')
    }
  } catch {
    console.error('Supabase not configured')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <Heart className="text-rose-500" size={64} fill="currentColor" />
              <Sparkles className="absolute -top-1 -right-1 text-pink-400" size={24} />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-gray-900">Create Beautiful Pages</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                With AI in Minutes
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AI-powered page builder for birthdays, anniversaries, weddings, and special moments
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login?redirect=/create/prompt"
              className="group px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              Start Creating Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/examples"
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold text-lg hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Eye size={20} />
              View Examples
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              No credit card
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              Ready in 3 minutes
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-500" />
              AI-powered
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-rose-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              From idea to beautiful page in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: '1',
                icon: <Brain className="w-8 h-8" />,
                title: 'Describe',
                desc: 'Tell AI about your occasion, recipient, and what you want to create',
              },
              {
                step: '2',
                icon: <Wand2 className="w-8 h-8" />,
                title: 'AI Generates',
                desc: 'Our AI creates a personalized page with beautiful design in 30 seconds',
              },
              {
                step: '3',
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Customize & Share',
                desc: 'Fine-tune with our editor, then share your unique page instantly',
              },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-rose-500 mb-2">Step {item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-rose-50/30 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm mb-6">
              <Sparkles size={16} />
              AI-Powered
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Smart Features
            </h2>
            <p className="text-xl text-gray-600">
              AI assistance at every step
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: '✨',
                title: '3 AI Suggestions',
                desc: 'Get multiple options for every text field',
              },
              {
                emoji: '🎯',
                title: 'Context-Aware',
                desc: 'AI understands your occasion and tone',
              },
              {
                emoji: '⚡',
                title: 'Quick Actions',
                desc: 'One-click improvements for clarity and style',
              },
              {
                emoji: '🎨',
                title: 'Smart Themes',
                desc: 'AI-generated color schemes',
              },
              {
                emoji: '⏱️',
                title: 'Instant Results',
                desc: 'Complete pages in 30 seconds',
              },
              {
                emoji: '💝',
                title: 'Fully Personal',
                desc: 'Every page is unique to your story',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-rose-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perfect For Any Occasion
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { emoji: '🎂', title: 'Birthdays' },
              { emoji: '💍', title: 'Anniversaries' },
              { emoji: '💒', title: 'Weddings' },
              { emoji: '💝', title: 'Love Notes' },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-8 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-5xl mb-3">{item.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12 text-center border border-rose-100">
            <div className="mb-6">
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="text-rose-400" size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600">Loved by thousands worldwide</p>
            </div>

            <blockquote className="text-xl md:text-2xl text-gray-900 font-medium mb-6 italic">
              "Made an anniversary page in 5 minutes. My partner cried happy tears!"
            </blockquote>
            
            <p className="text-gray-600 font-semibold">Mary M.</p>
            <p className="text-sm text-gray-500">United States</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Ready to Create Something Special?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands creating unforgettable moments with AI
          </p>
          
          <Link
            href="/login?redirect=/create/prompt"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            <Sparkles size={24} />
            Start Creating Free
            <ArrowRight size={24} />
          </Link>

          <p className="text-sm text-gray-500">
            No credit card • No commitment • 3-minute setup
          </p>
        </div>
      </section>
    </div>
  )
}

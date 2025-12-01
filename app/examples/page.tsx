import Link from 'next/link'
import { Sparkles, Heart, ArrowRight, Eye, Cake, Calendar, Users, Gift } from 'lucide-react'

export default function ExamplesPage() {
  const examples = [
    {
      title: 'Birthday Celebration',
      occasion: 'Birthday',
      description: 'A joyful birthday page with photos, timeline, and heartfelt messages',
      icon: <Cake size={32} />,
      color: 'from-blue-500 to-cyan-500',
      features: ['Photo gallery', 'Timeline', 'Birthday wishes', 'Countdown'],
    },
    {
      title: 'Anniversary Love Story',
      occasion: 'Anniversary',
      description: 'Romantic anniversary page celebrating years of love and memories',
      icon: <Heart size={32} />,
      color: 'from-rose-500 to-pink-500',
      features: ['Love timeline', 'Couple photos', 'Memory moments', 'Future plans'],
    },
    {
      title: 'Wedding Celebration',
      occasion: 'Wedding',
      description: 'Beautiful wedding page with ceremony details and couple story',
      icon: <Users size={32} />,
      color: 'from-purple-500 to-pink-500',
      features: ['Event details', 'RSVP', 'Photo gallery', 'Love story'],
    },
    {
      title: 'Romantic Surprise',
      occasion: 'Romance',
      description: 'Special romantic page to express your love and appreciation',
      icon: <Gift size={32} />,
      color: 'from-red-500 to-rose-500',
      features: ['Love notes', 'Special memories', 'Future wishes', 'Personal touches'],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-6">
            <Eye className="text-purple-600" size={20} />
            <span className="text-purple-700 font-semibold">Example Pages</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-6">
            Get Inspired
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See what you can create with our AI-powered page builder. Each page is unique and personalized.
          </p>
          <Link
            href="/create/prompt"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-xl"
          >
            <Sparkles size={20} />
            Create Your Own with AI
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Example Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {examples.map((example, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-soft-rise"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`bg-gradient-to-r ${example.color} p-8 text-white`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-3">
                      {example.occasion}
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{example.title}</h3>
                    <p className="text-white/90">{example.description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4 opacity-80">
                    {example.icon}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Includes:</h4>
                <ul className="space-y-2 mb-6">
                  {example.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-700">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${example.color}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/create/prompt"
                  className={`block text-center py-3 rounded-lg bg-gradient-to-r ${example.color} text-white font-semibold hover:scale-105 transition-transform`}
                >
                  Create Similar with AI
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* How AI Creates These */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 text-center">
          <Sparkles className="mx-auto text-purple-500 mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI Creates Your Unique Page
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            These are just examples. When you use our AI, it creates a completely personalized page
            based on YOUR story, YOUR memories, and YOUR style. No two pages are the same!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create/prompt"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              <Sparkles size={20} />
              Start Creating Now
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-xl font-semibold border-2 border-rose-200 hover:border-rose-400 hover:scale-105 transition-all"
            >
              <Eye size={20} />
              View Pricing
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-rose-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}


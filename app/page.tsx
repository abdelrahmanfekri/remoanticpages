import Link from 'next/link'
import { Heart, Sparkles, Globe, Lock, Palette, Image, Zap, Shield, Clock, Star, Users, CheckCircle, ArrowRight } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="pointer-events-none fixed inset-0 opacity-30">
        {Array.from({ length: 15 }).map((_, i) => (
          <Heart
            key={i}
            className="floating-heart absolute text-rose-300"
            style={{
              left: `${(i * 7) % 100}%`,
              bottom: `${-20 - i * 8}px`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${12 + (i % 6)}s`,
              fontSize: `${20 + (i % 3) * 15}px`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8 animate-fade-up">
            {/* Animated Heart Icon */}
            <div className="flex justify-center mb-6 relative">
              <div className="relative">
                <Heart className="text-rose-500 animate-pulse" size={80} />
                <Sparkles className="absolute -top-2 -right-2 text-pink-400 animate-pulse" size={32} style={{ animationDelay: '0.5s' }} />
                <Sparkles className="absolute -bottom-1 -left-1 text-rose-300 animate-pulse" size={24} style={{ animationDelay: '1s' }} />
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 animate-breathe leading-tight">
                Create a Love Website
                <br />
                <span className="block mt-2 text-4xl md:text-6xl lg:text-7xl">For Your Special Someone</span>
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 mx-auto rounded-full"></div>
            </div>

            {/* Subheading */}
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
              The best platform to create beautiful love pages, romantic websites, and personalized digital gifts.
              <span className="block mt-3 text-lg md:text-xl text-rose-600 font-medium">
                Perfect for birthdays, anniversaries, proposals, and romantic surprises. ❤️
              </span>
            </p>

            {/* Social Proof Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-6 pb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Globe className="text-blue-500" size={20} />
                <span className="font-semibold">50+</span>
                <span className="text-gray-500">Countries</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                href="/login"
                className="group relative bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-10 py-5 rounded-xl soft-glow hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                  Create Free Love Page
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="/templates"
                className="group bg-white/90 backdrop-blur-sm text-rose-600 px-10 py-5 rounded-xl border-2 border-rose-200 hover:border-rose-400 hover:bg-white transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <Image size={20} />
                  Browse Templates
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span>Ready in 3 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-purple-500" />
                <span>100% Private & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Features Section */}
      <section className="py-20 px-4 relative z-10 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 mb-4">
              Popular Features
            </h2>
            <p className="text-lg text-gray-600">Everything you need to create the perfect romantic page</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎂', title: 'Birthday Website Creator', desc: 'Make stunning birthday celebration pages with photos, videos, and messages', color: 'from-blue-50 to-cyan-50', border: 'border-blue-200' },
              { icon: '💍', title: 'Anniversary Website Design', desc: 'Create romantic anniversary websites that tell your love story', color: 'from-rose-50 to-pink-50', border: 'border-rose-200' },
              { icon: '💒', title: 'Wedding Website Builder', desc: 'Beautiful wedding celebration sites with timeline and gallery', color: 'from-purple-50 to-pink-50', border: 'border-purple-200' },
              { icon: '💝', title: 'Romantic Gift Ideas', desc: 'Digital love gifts that last forever, perfect for any occasion', color: 'from-red-50 to-rose-50', border: 'border-red-200' },
              { icon: '📅', title: 'Relationship Timeline', desc: 'Share your love story timeline with beautiful memories', color: 'from-orange-50 to-amber-50', border: 'border-orange-200' },
              { icon: '✨', title: 'Personalized Love Pages', desc: 'Custom websites for your partner, completely unique and personal', color: 'from-pink-50 to-purple-50', border: 'border-pink-200' },
            ].map((feature, i) => (
              <div key={i} className={`bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl animate-soft-rise`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-up">
            <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 mb-4">
              Why Choose Romantic Website Pages?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The easiest way to create memorable digital celebrations for any special occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50',
                borderColor: 'border-blue-200',
                title: 'Ready in 3 Minutes',
                desc: 'No technical skills needed. Choose a template, customize, and share. It\'s that simple.',
              },
              {
                icon: Palette,
                color: 'from-rose-500 to-pink-500',
                bgColor: 'from-rose-50 to-pink-50',
                borderColor: 'border-rose-200',
                title: 'Beautifully Designed',
                desc: 'Modern, romantic templates created by professional designers. Every detail is pixel-perfect.',
              },
              {
                icon: Image,
                color: 'from-purple-500 to-pink-500',
                bgColor: 'from-purple-50 to-pink-50',
                borderColor: 'border-purple-200',
                title: 'Mobile-First Experience',
                desc: 'Looks stunning on every device. Your love page adapts perfectly to phones, tablets, and desktops.',
              },
              {
                icon: Zap,
                color: 'from-yellow-500 to-orange-500',
                bgColor: 'from-yellow-50 to-orange-50',
                borderColor: 'border-orange-200',
                title: 'Share Instantly',
                desc: 'Get a unique link to share with your loved one via text, email, or social media. No downloads required.',
              },
              {
                icon: Heart,
                color: 'from-red-500 to-rose-500',
                bgColor: 'from-red-50 to-rose-50',
                borderColor: 'border-red-200',
                title: 'Truly Personal',
                desc: 'Add photos, videos, messages, timelines, and special memories. Perfect for any occasion. Make it uniquely yours.',
              },
              {
                icon: Lock,
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50',
                borderColor: 'border-green-200',
                title: 'Private & Secure',
                desc: 'Your love story is safe with us. Bank-level encryption protects your precious memories.',
              },
            ].map((feature, i) => (
              <div key={i} className={`group bg-gradient-to-br ${feature.bgColor} border ${feature.borderColor} rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-soft-rise`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-md">
                  <feature.icon className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`} size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-4 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-fade-up">
            <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Creating your celebration page is easier than ordering a pizza</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                title: 'Choose Your Template',
                desc: 'Browse our collection of stunning templates for birthdays, weddings, anniversaries, romantic surprises, and more. Pick the perfect one for your occasion.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                step: '2',
                title: 'Customize Everything',
                desc: 'Add your photos, write heartfelt messages, create timelines, customize colors and themes. Make it perfect for your unique celebration. Our intuitive editor makes it effortless.',
                gradient: 'from-rose-500 to-pink-500',
              },
              {
                step: '3',
                title: 'Share & Celebrate',
                desc: 'Get your unique link instantly. Share it via text, email, or social media. Watch everyone light up when they see your beautiful creation.',
                gradient: 'from-purple-500 to-pink-500',
              },
            ].map((item, i) => (
              <div key={i} className="text-center animate-soft-rise" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className={`bg-gradient-to-br ${item.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-xl transform hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 text-gray-500">
            <p className="text-sm">Average creation time: 3-5 minutes • No credit card required</p>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 mb-4">
              Perfect for Every Occasion
            </h2>
            <p className="text-xl text-gray-600">Choose from our curated collection of celebration categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '💕', title: 'Romance', desc: 'Create romantic timelines and love stories with beautiful photo galleries', gradient: 'from-rose-50 to-pink-50', border: 'border-rose-200' },
              { emoji: '🎂', title: 'Birthday Surprise', desc: 'Create a personalized birthday celebration website with photos, videos, and messages', gradient: 'from-blue-50 to-cyan-50', border: 'border-blue-200' },
              { emoji: '💍', title: 'Wedding Invitation', desc: 'Design elegant digital wedding invitations with RSVP tracking and event details', gradient: 'from-purple-50 to-pink-50', border: 'border-purple-200' },
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-br ${item.gradient} border ${item.border} rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300 hover:shadow-xl animate-soft-rise`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-6xl mb-4">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="text-yellow-500 fill-yellow-500" size={32} />
              <span className="text-4xl font-bold text-gray-800">4.9</span>
            </div>
            <p className="text-xl text-gray-600 mb-4">★★★★★ (500+ reviews)</p>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 mb-4">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                location: 'United States',
                text: 'I created a birthday surprise page in literally 5 minutes! Everyone was SO amazed and kept sharing it. Best gift idea ever!',
                rating: 5,
              },
              {
                name: 'James K.',
                location: 'United Kingdom',
                text: 'We used Love Pages for our wedding website. Our guests loved it! Way better than those expensive, complicated alternatives.',
                rating: 5,
              },
              {
                name: 'Maria L.',
                location: 'Spain',
                text: 'Made an anniversary page for my partner who cried happy tears! It\'s so romantic and personal. Thank you Love Pages!',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-soft-rise" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="text-yellow-500 fill-yellow-500" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-soft-rise">
              <h2 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-6">
                Why It Makes Life Easier
              </h2>
              <div className="space-y-4">
                {[
                  'No more gift anxiety - Always have the perfect gift ready in minutes',
                  'Last-minute lifesaver - Forgot an occasion? Create something meaningful instantly',
                  'Budget-friendly romance - Show you care without breaking the bank',
                  'Zero technical stress - No coding, no design skills, no hassle',
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-soft-rise" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-6">
                Better Than Traditional Gifts
              </h2>
              <div className="space-y-4">
                {[
                  'More meaningful than a physical card',
                  'Lasts forever (unlike flowers or cake)',
                  'More creative than traditional gifts',
                  'Perfect for any special occasion',
                  'Modern, memorable, and shareable',
                  'Recipients can revisit it anytime',
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Heart className="text-rose-500 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white via-pink-50 to-purple-50 border border-rose-200 rounded-3xl p-12 md:p-16 text-center space-y-8 animate-soft-rise relative overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <Heart className="mx-auto text-rose-500 mb-6 animate-pulse" size={64} />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 mb-6">
                Ready to Create Something Special?
              </h2>
              <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
                Start creating your celebration page now. It takes only 3 minutes and will make everyone smile.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={18} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={18} />
                  <span>Free templates included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={18} />
                  <span>Share instantly</span>
                </div>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-12 py-6 rounded-xl soft-glow hover:scale-105 transition-all duration-300 font-semibold text-xl shadow-2xl group"
              >
                <Sparkles size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                Create Your First Romantic Website Page
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <p className="text-sm text-gray-500 mt-6">
                Join people who&apos;ve created unforgettable celebrations
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

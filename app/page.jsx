"use client";

import React, { useState, useRef, useEffect } from "react";
import { Heart, Music, Upload, X } from "lucide-react";

const memories = [
  {
    date: "First Photo, First Love",
    description:
      "It all started when I heard about you and saw your photo for the first time – from that moment, I quietly fell in love with you. من أول صورة شوفتها ليكي وقلبي حس إن في حاجة مختلفة وإن في حب جاي في الطريق."
  },
  {
    date: "Cairo → Luxor → Aswan",
    description:
      "I travelled all the way from Cairo to Luxor to Aswan just to finally meet you in person, and every kilometer felt worth it the second I saw you. سفرة طويلة عشان بس أشوفك لدقيقة كانت عندي أحلى من ألف يوم من غيرك."
  },
  {
    date: "Math, Data & Linear Algebra & Long Talks",
    description:
      "I stayed with your dad talking for hours about linear algebra, data and mathematics, but I was just waiting to see you. قعدنا نتكلم عن أرقام وحسابات، بس جوايا كنت فرحان اني خلاص هقابلك ."
  },
  {
    date: "Seeing You With Your Mom",
    description:
      "When you walked in with your mom and tried to hide your shyness, I knew deep inside: this is the one. لما دخلتي مع مامتك وخجلِك بان في عينيكي، وقتها قلبي قاللي «هي دي» بدون أي تردد."
  },
  {
    date: "The First Yes",
    description:
      "I said yes to you immediately in my heart, and after I left, the hours passed so slowly while I waited for your acceptance. حاولت أوصل ليكي بس كان في عوائق، ومع ذلك كنت حاسس إني مش هرتاح غير لما اسمع منك كلمة القبول."
  },
  {
    date: "Our Engagement & After",
    description:
      "The day I came to get engaged to you was the happiest day of my life, and meeting you again just two days later turned into one of my favorite trips ever. من أول لحظة شوفتك فيها وإحنا مخطوبين لحد الليلة اللي فضّلنا فيها صاحيين بنتكلم في أي حاجة وكل حاجة، حاسس إني عايز عمري كله يعدّي بالطريقة دي جنبك. Thank you for every message, every late-night talk, and every small moment we shared."
  }
];

// You can set some default media (images / videos) here (you will place files in /public/images)
const initialMediaPaths = [
  "/images/WhatsApp Image 2025-11-16 at 19.56.49.jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.52 (2).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.52 (3).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.52 (4).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.52.jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.53 (1).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.53 (2).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.53 (3).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.53 (4).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.53.jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.54 (1).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.54 (2).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.54 (3).jpeg",
  "/images/WhatsApp Image 2025-11-16 at 19.56.54.jpeg",
  "/images/WhatsApp Video 2025-11-16 at 19.56.49.mp4",
  "/images/WhatsApp Video 2025-11-16 at 19.56.51.mp4",
  "/images/WhatsApp Video 2025-11-16 at 19.56.52.mp4"
];

// Simple hard-coded password for the whole page
const PASSWORD = "saroura-birthday-gift-by-abdelrahman-secret-dont-hack-me";

export default function BirthdayWebsite() {
  const [media, setMedia] = useState(initialMediaPaths);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Restore auth from previous visit
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("birthday_auth");
    if (stored === "true") {
      setIsAuthorized(true);
    }
  }, []);

  // Try to start the music softly on first load (only after auth)
  useEffect(() => {
    if (!isAuthorized || !audioRef.current) return;
    audioRef.current.volume = 0.25; // calm volume
    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        // Browser blocked autoplay; user will press the button
      }
    };
    playAudio();
  }, [isAuthorized]);

  useEffect(() => {
    if (media.length > 0) {
      const interval = setInterval(() => {
        setCurrentMediaIndex(prev => (prev + 1) % media.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [media.length]);

  const handlePhotoUpload = e => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = index => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const currentHeroItem =
    media.length > 0 ? media[currentMediaIndex % media.length] : null;

  const isVideo = src =>
    typeof src === "string" &&
    (src.toLowerCase().endsWith(".mp4") ||
      src.toLowerCase().endsWith(".webm") ||
      src.toLowerCase().startsWith("data:video"));

  const handlePasswordSubmit = e => {
    e.preventDefault();
    const normalized = passwordInput.trim().toLowerCase();
    const expected = PASSWORD.toLowerCase();
    if (normalized && expected.includes(normalized)) {
      setIsAuthorized(true);
      setAuthError("");
      if (typeof window !== "undefined") {
        window.localStorage.setItem("birthday_auth", "true");
      }
    } else {
      setAuthError("Wrong word, habibti. Try again ♥");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 relative overflow-hidden">
        <div className="pointer-events-none fixed inset-0 opacity-30">
          {Array.from({ length: 10 }).map((_, i) => (
            <Heart
              key={i}
              className="floating-heart absolute text-rose-300"
              style={{
                left: `${8 + (i * 9) % 80}%`,
                bottom: `${-30 - i * 10}px`,
                animationDelay: `${i * 0.7}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 glass-card soft-glow max-w-md w-full mx-4 p-8 space-y-6 animate-soft-rise">
          <p className="text-center text-sm uppercase tracking-[0.25em] text-rose-400 font-semibold">
            Private – for Sarora only
          </p>
          <h1 className="text-3xl md:text-4xl font-serif text-rose-500 text-center">
            Just for you, سرورتي
          </h1>
          <p className="text-gray-700 text-center text-sm md:text-base font-arabic">
            دي صفحة معمولة مخصوص ليكي. لو إنتِ سرورتي العسلية، اكتبّي الكلمة
            السحرية اللي بينا علشان ندخل على المفاجأة.
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Our secret word"
              className="w-full rounded-full border border-rose-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white/80 text-center"
            />
            {authError && (
              <p className="text-sm text-center text-rose-500 font-english">
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-full soft-glow hover:scale-105 transition-transform duration-200 font-medium"
            >
              Open my gift
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 font-english">
            P.S. Abdelrahman can help you if you forget our little secret.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 relative overflow-hidden">
      {/* Background floating hearts */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <Heart
            key={i}
            className="floating-heart absolute text-rose-500"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              bottom: `${-20 - i * 8}px`,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${10 + (i % 5)}s`
            }}
          />
        ))}
      </div>

      {/* Background Music */}
      {/* Put your audio file in public/music/song.mp3 and update the src below if needed */}
      <audio ref={audioRef} loop>
        <source src="/music/song.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-md p-3 rounded-full soft-glow hover:scale-110 transition-all duration-300 flex items-center gap-2"
      >
        <Music
          className={isPlaying ? "text-rose-500" : "text-gray-400"}
          size={22}
        />
        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {isPlaying ? "Pause our song" : "Play our song"}
        </span>
      </button>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-center md:text-left relative z-10 animate-fade-up">
            <p className="text-sm md:text-base tracking-[0.3em] uppercase text-rose-400/80 font-serif font-semibold italic font-english">
              For <span className="font-arabic not-italic text-rose-500">سروره</span>, with all my love
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 leading-tight animate-breathe">
              Happy Birthday,
              <span className="block font-display font-arabic text-4xl md:text-5xl mt-4 text-rose-500" style={{ fontFamily: "'Great Vibes', 'Cairo', serif" }}>
                سرورتي العسلية
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Today is not just another day. It&apos;s the day the love of my
              life came into this world. Thank you for filling my life with
              warmth, laughter, and a kind of love I didn&apos;t know existed.
            </p>
            <p className="text-base md:text-lg text-gray-500">
              Scroll down to travel through our story, our memories, and a small
              part of how deeply I adore you.
            </p>
            <p className="text-base md:text-lg text-rose-700 font-arabic leading-relaxed">
              إحنا الاتنين مهندسين بس متواضعين علشان المبرمجين اجمد من المهندسين. دي هديتي البسيطة
              ليكي في يوم ميلادِك، عشان أقولك إني فخور بيكي وبكل اللي إنتِ
              عليه يا أجمل بشمهندسة بتخليني فخور بيكي كل يوم. ❤️
            </p>
          </div>

          <div className="relative z-10 flex justify-center animate-soft-rise">
            <div className="glass-card soft-glow p-4 md:p-6 w-full max-w-md relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-200/40 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-200/60 rounded-full blur-3xl" />

              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/60">
                {currentHeroItem ? (
                  isVideo(currentHeroItem) ? (
                    <video
                      src={currentHeroItem}
                      className="w-full h-80 object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={currentHeroItem}
                      alt="Our memory"
                      className="w-full h-80 object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-80 flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-white to-pink-100">
                    <Heart className="text-rose-300 mb-4 animate-pulse" size={52} />
                    <p className="text-gray-500 text-center px-4">
                      When you add our photos below, they will appear here like
                      a soft slideshow of our love.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center space-y-1">
                <p className="text-sm uppercase tracking-[0.2em] text-rose-400">
                  Us, together
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section
        id="photos"
        className="py-20 px-4 bg-white/70 backdrop-blur-sm relative"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-center text-rose-500 mb-3 animate-fade-up">
            Our Beautiful Moments
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            Every picture is a quiet love letter written in smiles and stolen
            glances.
          </p>

          {/* Upload Button */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-10">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-7 py-3 rounded-full soft-glow hover:scale-105 transition-all duration-300"
            >
              <Upload size={20} />
              Upload Photos / Videos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Media Display */}
          {media.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {media.map((item, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-black/5 animate-soft-rise"
                >
                  {isVideo(item) ? (
                    <video
                      src={item}
                      className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      controls
                    />
                  ) : (
                    <img
                      src={item}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-3 right-3 bg-white/95 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <X size={18} className="text-gray-700" />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-4 border-dashed border-rose-200 rounded-3xl bg-rose-50/40">
              <Heart className="mx-auto text-rose-300 mb-4" size={60} />
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                Upload our photos or videos to
                build our little gallery of happiness.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why You're Special Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-rose-500 mb-10 animate-fade-up">
            Why You Are My Everything
          </h2>
          <div className="glass-card soft-glow p-8 md:p-12 space-y-6 text-left animate-soft-rise">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              From the moment you stepped into my life, everything became softer
              and brighter. Your laughter fills the empty spaces in my heart,
              and your kindness constantly reminds me how lucky I am to walk
              this life by your side.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              You are my safe place, my favorite story, and my most beautiful
              dream. The way you care, the way you love, the way you simply
              exist—every little detail of you is a reason I fall deeper in love
              with you every day.
            </p>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-arabic">
              من أول لحظة دخلتي فيها حياتي وأنا حاسس إن ربنا عوّضني بيكي عن كل
              حاجة. ضحكتِك بتملا قلبي، وطريقتك في التفكير  
              بتخليني فخور بيكي كل يوم. إنتِ حضني وراحتي وبيتي.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              I&apos;m endlessly grateful for your heart, your patience, and
              your warmth. You are not just part of my life—you are the best
              part of it.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-rose-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-center text-rose-500 mb-16 animate-fade-up">
            Our Love Story
          </h2>

          <div className="relative">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-rose-200 hidden md:block" />

            <div className="space-y-12">
              {memories.map((memory, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className={`flex flex-col md:flex-row items-center gap-6 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="flex-1" />
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-4 bg-rose-400 rounded-full border-4 border-rose-100 z-10" />
                      {index !== memories.length - 1 && (
                        <div className="hidden md:block w-px h-24 bg-rose-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="glass-card p-6 shadow-lg animate-fade-up">
                        <h3 className="text-2xl font-serif text-rose-500 mb-2">
                          {memory.date}
                        </h3>
                        <p className="text-gray-600 text-lg">
                          {memory.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final Love Note Section */}
      <section className="py-20 px-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <Heart
            className="mx-auto text-rose-500 mb-8 animate-pulse"
            size={80}
          />
          <h2 className="text-4xl md:text-6xl font-serif text-rose-500 mb-8 animate-fade-up">
            Forever Yours
          </h2>
          <div className="glass-card soft-glow p-8 md:p-12 space-y-8 animate-soft-rise">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic">
              “I can&apos;t wait to build a lifetime of little moments with you
              — morning coffees, late-night talks, shared dreams, and
              countless birthdays where I get to celebrate the miracle of you.”
            </p>
            <p className="text-xl md:text-2xl text-rose-700 leading-relaxed italic font-arabic">
              «يا أحلى حاجة حصلتلي، في يوم ميلادِك بحب أقولك إن وجودِك في
              حياتي هو أحلى هدية من ربنا. مستني كل التفاصيل اللي جايّة معاك:
              قهوتنا الصبح، ضحكتِك، وأبسط لحظة جنبك.»
            </p>
            <p className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
              Happy Birthday, my forever love. ❤️ يبقى معاك حتى الأبد.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}



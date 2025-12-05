import {
    CheckCircle2,
    Globe2,
    MessageCircle,
    Shield,
    Sparkles,
    Star,
    Users,
    Zap
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col font-sans selection:bg-primary selection:text-primary-content overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <MessageCircle className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
              TalkBridge
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="btn btn-ghost hover:bg-base-content/5">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 border-none">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] opacity-60 mix-blend-multiply" />
          <div className="absolute -bottom-32 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] opacity-60 mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 border border-base-content/10 text-sm mb-8 animate-fade-in-up hover:border-primary/30 transition-colors cursor-default backdrop-blur-sm">
            <Sparkles className="size-4 text-secondary fill-secondary" />
            <span className="opacity-80 font-medium">#1 Ranked Language Exchange Platform</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-base-content to-base-content/60 bg-clip-text text-transparent max-w-5xl mx-auto leading-[1.1]">
            Global Connections, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Limitless Conversations</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-base-content/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Break down language barriers with AI-powered translations and real-time video calls. 
            Connect with native speakers instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="btn btn-primary btn-lg px-10 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all border-none hover:-translate-y-1"
            >
              Start Learning Free
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium opacity-80 mt-4 sm:mt-0 sm:ml-6">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className={`size-8 rounded-full border-2 border-base-100 bg-base-300 overflow-hidden`}>
                     <img src={`https://i.pravatar.cc/100?img=${10+i}`} alt="user" className="w-full h-full object-cover" />
                   </div>
                 ))}
              </div>
              <span>Trusted by 50,000+ users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y border-base-content/5 bg-base-200/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-base-content/10">
            {[
              { label: "Active Learners", value: "50K+" },
              { label: "Countries", value: "120+" },
              { label: "Languages", value: "60+" },
              { label: "Daily Minutes", value: "1M+" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-3xl lg:text-4xl font-bold text-primary mb-1">{stat.value}</span>
                <span className="text-sm font-medium text-base-content/60 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 1: Matching */}
      <section className="py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 relative">
               <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2rem] blur-2xl opacity-50" />
               <div className="relative bg-base-200 rounded-3xl p-8 border border-base-content/10 shadow-2xl">
                 {/* Mock UI for Matching */}
                 <div className="bg-base-100 rounded-2xl p-6 shadow-inner mb-4">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="size-12 rounded-full bg-base-300 overflow-hidden">
                       <img src="https://i.pravatar.cc/150?img=32" alt="Match" />
                     </div>
                     <div>
                       <div className="h-4 w-32 bg-base-300 rounded mb-2" />
                       <div className="h-3 w-20 bg-base-300 rounded" />
                     </div>
                     <span className="ml-auto text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">98% Match</span>
                   </div>
                   <div className="space-y-2">
                      <div className="h-2 w-full bg-base-300/50 rounded" />
                      <div className="h-2 w-5/6 bg-base-300/50 rounded" />
                   </div>
                 </div>
                 <div className="flex justify-center">
                   <div className="inline-flex items-center gap-2 bg-primary text-primary-content px-6 py-3 rounded-xl font-medium shadow-lg">
                     <Sparkles className="size-5" />
                     Finding your partner...
                   </div>
                 </div>
               </div>
            </div>
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-6">
                <span className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Users className="size-6" />
                </span>
                <span className="text-primary font-bold tracking-wide uppercase text-sm">Smart Matching</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Connect with the <br /> Perfect Partner
              </h2>
              <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
                Stop wasting time searching. Our AI algorithm analyzes your language level, interests, and goals to pair you with the ideal conversation partner instantly.
              </p>
              <ul className="space-y-4">
                {['Interest-based matching', 'Native speaker verification', 'Time-zone synchronization'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="size-6 text-success flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Translation */}
      <section className="py-24 lg:py-32 bg-base-200/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 relative">
               <div className="absolute -inset-4 bg-gradient-to-bl from-secondary/20 to-primary/20 rounded-[2rem] blur-2xl opacity-50" />
               <div className="relative bg-base-100 rounded-3xl p-8 border border-base-content/10 shadow-2xl">
                 {/* Mock UI for Translation */}
                 <div className="space-y-4">
                   <div className="flex gap-4">
                     <div className="size-10 rounded-full bg-base-300 shrink-0 overflow-hidden"><img src="https://i.pravatar.cc/150?img=11" /></div>
                     <div className="bg-base-200 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                       <p className="mb-2">Hola! ¿Cómo estás hoy?</p>
                       <div className="flex items-center gap-2 text-xs text-primary font-medium border-t border-base-content/10 pt-2 mt-1">
                         <Globe2 className="size-3" />
                         <span>Translated: Hello! How are you today?</span>
                       </div>
                     </div>
                   </div>
                   <div className="flex gap-4 flex-row-reverse">
                     <div className="size-10 rounded-full bg-base-300 shrink-0 overflow-hidden"><img src="https://i.pravatar.cc/150?img=59" /></div>
                     <div className="bg-primary text-primary-content rounded-2xl rounded-tr-none p-4 max-w-[80%] shadow-md">
                       <p>I'm doing great, thanks for asking!</p>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-6">
                <span className="p-2 rounded-lg bg-secondary/10 text-secondary">
                  <Zap className="size-6" />
                </span>
                <span className="text-secondary font-bold tracking-wide uppercase text-sm">Live Translation</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Never Get Lost in <br /> Translation
              </h2>
              <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
                Struggling with vocabulary? Our built-in translation tools bridge the gap instantly. Click on any message to translate it or see live captions during video calls.
              </p>
              <div className="flex flex-wrap gap-3">
                 {['Real-time chat translation', 'Interactive vocabulary saving', 'Context-aware suggestions'].map(tag => (
                   <span key={tag} className="px-4 py-2 rounded-lg bg-base-200 border border-base-content/10 text-sm font-medium">
                     {tag}
                   </span>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Start Speaking in Minutes</h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Our streamlined onboarding gets you into your first conversation faster than ever.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-base-content/10 to-transparent hidden md:block -z-10 -translate-y-1/2" />
            
            {[
              { title: "Create Profile", desc: "Set your native language and the one you want to learn.", icon: Users },
              { title: "Get Matched", desc: "Our AI pairs you with compatible partners worldwide.", icon: Sparkles },
              { title: "Start Talking", desc: "Jump into video or text chat and practice instantly.", icon: MessageCircle },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="size-20 rounded-2xl bg-base-100 border border-base-content/10 shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <step.icon className="size-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-base-content/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-base-200/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16">Loved by Learners</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah J.", role: "Learning Spanish", text: "TalkBridge changed my life. I went from zero to conversational in 3 months just by talking to people here.", img: "38" },
              { name: "David K.", role: "Learning Japanese", text: "The matching is incredibly accurate. I found a partner who shares my love for anime and coding.", img: "12" },
              { name: "Elena R.", role: "Learning English", text: "The translation tools are a lifesaver. I feel so much more confident speaking knowing I have a safety net.", img: "45" },
            ].map((review, idx) => (
              <div key={idx} className="card bg-base-100 shadow-xl border border-base-content/5 p-8">
                <div className="flex gap-1 text-warning mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="size-4 fill-warning" />)}
                </div>
                <p className="text-lg mb-8 leading-relaxed opacity-80">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={`https://i.pravatar.cc/150?img=${review.img}`} alt={review.name} className="size-12 rounded-full" />
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <span className="text-xs opacity-60 uppercase tracking-wide">{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
           <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16">Frequently Asked Questions</h2>
           <div className="space-y-4">
             {[
               { q: "Is TalkBridge really free?", a: "Yes! The core features of matching and chatting are completely free. We believe education should be accessible to everyone." },
               { q: "How does the verification process work?", a: "We verify user profiles through email and community reporting to ensure a safe learning environment." },
               { q: "Can I use it on mobile?", a: "TalkBridge is fully responsive and works perfectly on your phone's browser. A dedicated app is coming soon!" },
               { q: "What languages are supported?", a: "We support over 50 languages including English, Spanish, French, German, Mandarin, Japanese, and many more." },
             ].map((faq, idx) => (
               <div key={idx} className="collapse collapse-plus bg-base-200 rounded-xl">
                 <input type="radio" name="my-accordion-3" checked={openFaq === idx} onChange={() => toggleFaq(idx)} /> 
                 <div className="collapse-title text-xl font-medium p-6">
                   {faq.q}
                 </div>
                 <div className="collapse-content px-6"> 
                   <p className="pb-6 opacity-70">{faq.a}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary text-primary-content">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-white">Ready to break the barrier?</h2>
          <p className="text-xl text-primary-content/80 mb-12 max-w-2xl mx-auto">
            Join thousands of learners mastering new languages today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/signup" className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none shadow-2xl">
               Get Started for Free
             </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="size-5 text-primary" />
                </div>
                <span className="text-xl font-bold">TalkBridge</span>
              </div>
              <p className="opacity-60 leading-relaxed mb-6">
                Making language learning accessible, effective, and fun through global connection.
              </p>
              <div className="flex gap-4">
                 {[Globe2, CheckCircle2, Shield].map((Icon, i) => (
                   <span key={i} className="size-10 rounded-full bg-base-100 flex items-center justify-center hover:text-primary transition-colors cursor-pointer">
                     <Icon className="size-5" />
                   </span>
                 ))}
              </div>
            </div>
            
            {[
              { head: "Product", links: ["Features", "Pricing", "Enterprise", "Safety"] },
              { head: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
              { head: "Legal", links: ["Terms", "Privacy", "Guidelines", "Cookie Policy"] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-bold mb-6">{col.head}</h4>
                <ul className="space-y-4 opacity-70">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-base-content/10 flex flex-col md:flex-row justify-between items-center gap-4 opacity-60 text-sm">
            <p>© {new Date().getFullYear()} TalkBridge Inc. All rights reserved.</p>
            <p>Made with ❤️ for learners everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

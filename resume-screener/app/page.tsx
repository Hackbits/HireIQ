import Link from "next/link";
import React from "react";
export default function HomePage() {
  return (
    <div className="flex flex-col selection:bg-sky-500/30">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-36 pb-24 md:pt-52 md:pb-32 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-sky-300 mb-8 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              The future of hiring is here
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Screen Resumes in <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-pink-400 drop-shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                Seconds with AI
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
              Upload your job description and candidate resumes. HireIQ instantly scores, summarizes, and identifies skill gaps using advanced AI so you can focus on interviewing the best candidates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/login" className="px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-lg hover:shadow-[0_0_40px_rgba(14,165,233,0.5)] hover:scale-[1.02] transition-all w-full sm:w-auto relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform rounded-xl"></div>
                <span className="relative z-10">Start Screening for Free</span>
              </Link>
              <Link href="#features" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 backdrop-blur-md transition-all w-full sm:w-auto shadow-lg hover:shadow-xl">
                See Features
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-400">No credit card required. Free plan includes 20 screens/month.</p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative border-t border-white/5 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-sm">Everything you need <br/> to find the perfect fit</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Our AI-powered platform gives you deep insights into every candidate before you even schedule an interview.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <FeatureCard 
                icon={
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                }
                title="Instant AI Scoring"
                description="Get a 0-100 match score for every resume based on your specific job description. Instantly identify top tier talent."
              />
              <FeatureCard 
                icon={
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                }
                title="Skill Gap Analysis"
                description="Clearly see which required skills a candidate possesses and which ones are completely missing from their resume."
              />
              <FeatureCard 
                icon={
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                }
                title="Executive Summaries"
                description="Read a concise, 2-sentence AI-generated summary of the candidate's background and suitability for the role."
              />
              <FeatureCard 
                icon={
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                }
                title="Batch Uploads"
                description="Upload up to 50 resumes at once in our Pro plan. Our system processes them in parallel to save you hours of work."
              />
              <FeatureCard 
                icon={
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                }
                title="Secure & Private"
                description="Your data is safely stored with enterprise-grade security. We never share your candidate data with third parties."
              />
              <FeatureCard 
                icon={
                  <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                }
                title="Bias Reduction"
                description="Focus purely on skills and experience matching. AI helps reduce unconscious bias in the initial screening phase."
              />
            </div>
          </div>
        </section>

        {/* Products / ATS Scanner Checks Section */}
        <section id="products" className="py-24 relative bg-[#030712] border-t border-white/5">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-sm">What Our ATS Resume Scanner Checks</h2>
              <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                HireIQ&apos;s ATS checker analyzes key criteria in the following categories and offers actionable recommendations to optimize your hiring process.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Card 1: Content */}
              <div className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-sky-500/50 transition-colors shadow-lg">
                <div className="flex flex-col items-center mb-8 border-b border-white/10 pb-6">
                  <div className="w-16 h-16 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Content</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sky-400 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0ea5e9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      Customization
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-slate-300 list-disc list-outside marker:text-slate-600">
                      <li>Relevant qualifications</li>
                      <li>Industry-specific skills</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-sky-400 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0ea5e9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      Spelling & Grammar
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-slate-300 list-disc list-outside marker:text-slate-600">
                      <li>Correct spelling and grammar</li>
                      <li>Consistent punctuation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-sky-400 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0ea5e9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      Word Choice
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-slate-300 list-disc list-outside marker:text-slate-600">
                      <li>Use of strong action verbs</li>
                      <li>Professional language and tone</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 2: Key Sections */}
              <div className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-yellow-500/50 transition-colors shadow-lg">
                <div className="flex flex-col items-center mb-8 border-b border-white/10 pb-6">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Key Sections</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      Contact Information
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-slate-300 list-disc list-outside marker:text-slate-600">
                      <li>Relevant contact details</li>
                      <li>Organized resume header</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      Professional Summary
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-slate-300 list-disc list-outside marker:text-slate-600">
                      <li>Clear and focused summary</li>
                      <li>Core qualifications included</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-yellow-500 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      Measurable Results
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-slate-300 list-disc list-outside marker:text-slate-600">
                      <li>Highlights quantified results</li>
                      <li>Job-relevant work experience</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 3: Structure */}
              <div className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-teal-500/50 transition-colors shadow-lg">
                <div className="flex flex-col items-center mb-8 border-b border-white/10 pb-6">
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Structure</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-teal-400 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#14b8a6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      Formatting
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-slate-300 list-disc list-outside marker:text-slate-600">
                      <li>File format and size</li>
                      <li>ATS-friendly layout</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-teal-400 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#14b8a6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      Optimal Length
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-slate-300 list-disc list-outside marker:text-slate-600">
                      <li>Concise content</li>
                      <li>Organized sections</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-teal-400 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#14b8a6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      Comprehensiveness
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-slate-300 list-disc list-outside marker:text-slate-600">
                      <li>Key sections included</li>
                      <li>Complete work history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">Ready to transform your hiring?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join modern HR teams and recruiters who use HireIQ to find the best talent faster.
            </p>
            <Link href="/login" className="px-10 py-5 rounded-xl bg-white text-slate-900 font-bold text-lg hover:bg-slate-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all inline-block shadow-xl">
              Create Your Free Account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#030712]/80 backdrop-blur-md py-12 text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-bold text-white text-[10px] shadow-[0_0_10px_rgba(14,165,233,0.3)]">
              HQ
            </div>
            <span className="font-bold text-white tracking-tight">HireIQ</span>
          </div>
          <p>© {new Date().getFullYear()} HireIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-sky-500/50 transition-all duration-300 group backdrop-blur-md shadow-lg hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-blue-600/0 group-hover:from-sky-500/5 group-hover:to-blue-600/5 transition-colors"></div>
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-sky-500/30 group-hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

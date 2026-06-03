import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="planner-bg relative pt-36 pb-24 md:pt-52 md:pb-32 overflow-hidden">
          <div className="amber-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="teal-orb top-0 right-0"></div>
          <div className="violet-glow bottom-0 left-0"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge variant="default" className="mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2"></span>
              The future of hiring is here
            </Badge>

            <h1 className="text-5xl md:text-7xl font-display-family font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Screen Resumes in <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-violet-400 drop-shadow-[0_0_30px_rgba(199,155,55,0.4)]">
                Seconds with AI
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your job description and candidate resumes. HireIQ instantly scores, summarizes, and identifies skill gaps using advanced AI so you can focus on interviewing the best candidates.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/login">
                <Button variant="primary" size="lg">
                  Start Screening for Free
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  See Features
                </Button>
              </Link>
            </div>

            <p className="mt-8 micro-label">No credit card required. Free plan includes 20 screens/month.</p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative border-t border-border">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-display-family font-bold text-foreground mb-6 tracking-tight">
                Everything you need <br /> to find the perfect fit
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our AI-powered platform gives you deep insights into every candidate before you even schedule an interview.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <FeatureCard
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                }
                iconBg="bg-primary/10"
                title="Instant AI Scoring"
                description="Get a 0-100 match score for every resume based on your specific job description. Instantly identify top tier talent."
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                }
                iconBg="bg-accent/10"
                title="Skill Gap Analysis"
                description="Clearly see which required skills a candidate possesses and which ones are completely missing from their resume."
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                }
                iconBg="bg-violet-500/10"
                title="Executive Summaries"
                description="Read a concise, 2-sentence AI-generated summary of the candidate&apos;s background and suitability for the role."
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                }
                iconBg="bg-primary/10"
                title="Batch Uploads"
                description="Upload up to 50 resumes at once in our Pro plan. Our system processes them in parallel to save you hours of work."
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                }
                iconBg="bg-accent/10"
                title="Secure & Private"
                description="Your data is safely stored with enterprise-grade security. We never share your candidate data with third parties."
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                }
                iconBg="bg-violet-500/10"
                title="Bias Reduction"
                description="Focus purely on skills and experience matching. AI helps reduce unconscious bias in the initial screening phase."
              />
            </div>
          </div>
        </section>

        {/* ATS Scanner Section */}
        <section id="products" className="py-24 relative border-t border-border planner-bg">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display-family font-bold text-foreground mb-6 tracking-tight">
                What Our ATS Resume Scanner Checks
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                HireIQ&apos;s ATS checker analyzes key criteria in the following categories and offers actionable recommendations to optimize your hiring process.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Card 1: Content - Amber */}
              <Card className="p-8">
                <div className="flex flex-col items-center mb-8 border-b border-border pb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-display-family font-bold text-foreground">Content</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-primary font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      Customization
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-muted-foreground list-disc list-outside marker:text-border">
                      <li>Relevant qualifications</li>
                      <li>Industry-specific skills</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-primary font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      Spelling & Grammar
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-muted-foreground list-disc list-outside marker:text-border">
                      <li>Correct spelling and grammar</li>
                      <li>Consistent punctuation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-primary font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      Word Choice
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-muted-foreground list-disc list-outside marker:text-border">
                      <li>Use of strong action verbs</li>
                      <li>Professional language and tone</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Card 2: Key Sections - warm amber */}
              <Card className="p-8">
                <div className="flex flex-col items-center mb-8 border-b border-border pb-6">
                  <div className="w-16 h-16 rounded-full bg-chart-4/10 flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-chart-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <h3 className="text-2xl font-display-family font-bold text-foreground">Key Sections</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-chart-4 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      Contact Information
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-muted-foreground list-disc list-outside marker:text-border">
                      <li>Relevant contact details</li>
                      <li>Organized resume header</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-chart-4 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      Professional Summary
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-muted-foreground list-disc list-outside marker:text-border">
                      <li>Clear and focused summary</li>
                      <li>Core qualifications included</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-chart-4 font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      Measurable Results
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-muted-foreground list-disc list-outside marker:text-border">
                      <li>Highlights quantified results</li>
                      <li>Job-relevant work experience</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Card 3: Structure - Teal */}
              <Card className="p-8">
                <div className="flex flex-col items-center mb-8 border-b border-border pb-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <h3 className="text-2xl font-display-family font-bold text-foreground">Structure</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-accent font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      Formatting
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-muted-foreground list-disc list-outside marker:text-border">
                      <li>File format and size</li>
                      <li>ATS-friendly layout</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-accent font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      Optimal Length
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-muted-foreground list-disc list-outside marker:text-border">
                      <li>Concise content</li>
                      <li>Organized sections</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-accent font-bold mb-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      Comprehensiveness
                    </h4>
                    <ul className="pl-6 space-y-2 text-sm text-muted-foreground list-disc list-outside marker:text-border">
                      <li>Key sections included</li>
                      <li>Complete work history</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-display-family font-bold text-foreground mb-6">
              Ready to transform your hiring?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join modern HR teams and recruiters who use HireIQ to find the best talent faster.
            </p>
            <Link href="/login">
              <Button variant="primary" size="lg">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/60 backdrop-blur-md py-12 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded command-strip flex items-center justify-center font-bold text-black text-[10px] shadow-[0_0_10px_rgba(199,155,55,0.3)]">
              HQ
            </div>
            <span className="font-display-family font-bold text-foreground tracking-tight">HireIQ</span>
          </div>
          <p>&copy; {new Date().getFullYear()} HireIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, iconBg, title, description }: { icon: React.ReactNode; iconBg: string; title: string; description: string }) {
  return (
    <Card className={cn("p-8 hover:-translate-y-0.5 transition-all duration-300 group")}>
      <div className="relative z-10">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300", iconBg)}>
          {icon}
        </div>
        <h3 className="text-xl font-display-family font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </Card>
  );
}

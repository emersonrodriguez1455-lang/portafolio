import { SiteHeader } from '@/components/site-header'
import { ProjectsSection } from '@/components/projects-section'
import { AboutSection } from '@/components/about-section'
import { AiSection } from '@/components/ai-section'
import { SkillsSection } from '@/components/skills-section'
import { ContactSection } from '@/components/contact-section'
import { Reveal } from '@/components/reveal'

export default function Home() {
  return (
    <>
      <div aria-hidden="true" className="scroll-progress" />
      <SiteHeader />
      <main className="container-page flex flex-col gap-16 pb-[calc(7rem+env(safe-area-inset-bottom))] md:gap-24 md:pb-24 2xl:gap-32">
        <ProjectsSection />
        <Reveal>
          <AboutSection />
        </Reveal>
        <Reveal>
          <AiSection />
        </Reveal>
        <Reveal>
          <SkillsSection />
        </Reveal>
        <Reveal>
          <ContactSection />
        </Reveal>
      </main>
    </>
  )
}

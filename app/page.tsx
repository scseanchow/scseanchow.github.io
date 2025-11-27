import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { Card } from "@/components/card";
import { profile, projects, experiences, stats } from "@/data/content";

const MotionCard = motion(Card);

const codeSnippet = `const marketplaceLaunch = {
  owner: "Sean Chow",
  partnersOnboarded: 80,
  stack: ["Go", "React", "Terraform"],
  telemetry: "datadog.marketplace",
  decisionLog: () => {
    return "Ship the smallest experiment that proves value";
  }
};`;

const heroLinks = [
  { label: "View Resume", href: "/resume.pdf", primary: true },
  { label: "Email Sean", href: "mailto:me@seanchow.com", primary: false, external: true }
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-10 lg:grid-cols-[3fr_2fr]"
        aria-labelledby="hero-title"
      >
        <div className="space-y-6">
          <span className="inline-flex -rotate-2 border-2 border-border-heavy bg-accent-yellow px-3 py-1 font-mono text-xs uppercase tracking-wide shadow-posthog">
            {profile.status}
          </span>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-text-secondary">{profile.role}</p>
          <h1 id="hero-title" className="text-5xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
            {profile.headline}
          </h1>
          <p className="max-w-2xl text-lg text-text-secondary">{profile.summary}</p>
          <div className="flex flex-wrap gap-4">
            {heroLinks.map((action) => {
              const classes = action.primary
                ? "border-2 border-border-heavy bg-accent-orange px-6 py-3 text-sm font-semibold uppercase shadow-posthog transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                : "border-2 border-border-heavy bg-white px-6 py-3 text-sm font-semibold uppercase shadow-posthog transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none";

              if (action.external) {
                return (
                  <a key={action.label} href={action.href} className={classes}>
                    {action.label}
                  </a>
                );
              }

              return (
                <Link key={action.label} href={action.href} className={classes}>
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>

        <MotionCard
          className="bg-white"
          whileHover={{ rotate: -1.5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase text-text-secondary">
            <span>Status Console</span>
            <span>rev 2025.11</span>
          </div>
          <pre className="overflow-x-auto rounded-md border-2 border-border-heavy bg-accent-blue p-4 font-mono text-sm text-white shadow-posthog">
            {codeSnippet}
          </pre>
        </MotionCard>
      </motion.section>

      <section id="projects" aria-labelledby="projects-title" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">Projects & Experience</p>
            <h2 id="projects-title" className="text-3xl font-semibold">Building with measurable physics</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MotionCard
            className="md:col-span-2"
            whileHover={{ rotate: 0.75 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <header className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Shipping logs</h3>
              <span className="font-mono text-xs uppercase text-text-secondary">Latest</span>
            </header>
            <div className="mt-4 space-y-4">
              {projects.map((project) => (
                <article key={project.name} className="border-t-2 border-dashed border-border-heavy pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{project.name}</p>
                      <p className="text-sm text-text-secondary">{project.description}</p>
                    </div>
                    <Link
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center border-2 border-border-heavy bg-white shadow-posthog transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                      aria-label={`Open ${project.name}`}
                    >
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2 font-mono text-xs uppercase">
                    {project.stack.map((item) => (
                      <li key={item} className="rounded-md border-2 border-border-heavy bg-bg-beige px-2 py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </MotionCard>

          {experiences.map((experience) => (
            <MotionCard
              key={experience.company}
              className="flex flex-col justify-between"
              whileHover={{ rotate: -0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div>
                <p className="font-mono text-xs uppercase text-text-secondary">{experience.timeframe}</p>
                <h3 className="mt-2 text-xl font-semibold">{experience.role}</h3>
                <p className="font-mono text-sm uppercase tracking-wide">{experience.company}</p>
                <p className="text-sm text-text-secondary">{experience.location}</p>
              </div>
              <p className="mt-4 text-sm text-text-primary">{experience.summary}</p>
            </MotionCard>
          ))}

          {stats.map((stat) => (
            <MotionCard
              key={stat.label}
              className="bg-accent-yellow"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <p className="font-mono text-xs uppercase text-text-primary">{stat.label}</p>
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="text-sm text-text-primary">{stat.detail}</p>
            </MotionCard>
          ))}
        </div>
      </section>

      <section id="about" aria-labelledby="about-title">
        <div className="rounded-md border-2 border-border-heavy bg-accent-blue p-8 text-white shadow-posthog">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-yellow">About</p>
          <h2 id="about-title" className="mt-3 text-3xl font-semibold">Engineer-first philosophy</h2>
          <p className="mt-4 max-w-3xl text-lg">
            I think like an IC while directing product strategy: whiteboard the job-to-be-done, prototype the fuzziest
            step, ship an experiment, instrument the hell out of it, then scale. I bias toward simple systems with heavy
            guard-rails, and I keep a build log so every teammate understands the why behind the release.
          </p>
        </div>
      </section>
    </div>
  );
}

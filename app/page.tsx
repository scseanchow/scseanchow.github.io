"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { Card } from "@/components/card";
import { profile, projects, experiences, stats } from "@/data/content";

const MotionCard = motion(Card);

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
        className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start"
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

        <div className="flex h-full items-center justify-center lg:justify-start">
          <div className="relative aspect-square w-full max-w-full lg:max-w-md">
            <div className="relative h-full w-full rounded-full border-2 border-border-heavy p-1 shadow-posthog">
              <Image
                src="/images/me.png"
                alt="Sean Chow"
                fill
                className="rounded-full object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </motion.section>

      <section id="experience" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">Experience</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Detailed cards with descriptions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experiences.map((experience, index) => {
              // Find the index of the Datadog Product Manager role
              const datadogPMIndex = experiences.findIndex(
                (exp) => exp.company === "Datadog" && exp.role === "Product Manager"
              );
              // Show summary for jobs up to and including the Datadog PM role
              const showSummary = index <= datadogPMIndex;
              
              if (!showSummary) return null;
              
              return (
                <MotionCard
                  key={experience.company}
                  className="flex flex-col"
                  whileHover={{ rotate: -0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <div>
                    <p className="font-mono text-xs uppercase text-text-secondary">{experience.timeframe}</p>
                    <h3 className="mt-2 text-xl font-semibold">{experience.role}</h3>
                    <p className="font-mono text-sm uppercase tracking-wide">{experience.company}</p>
                    <p className="text-sm text-text-secondary">{experience.location}</p>
                  </div>
                  {experience.summary && (
                    <p className="mt-4 text-sm text-text-primary leading-relaxed">{experience.summary}</p>
                  )}
                </MotionCard>
              );
            })}
          </div>

          {/* Compact stacked cards without descriptions */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((experience, index) => {
              // Find the index of the Datadog Product Manager role
              const datadogPMIndex = experiences.findIndex(
                (exp) => exp.company === "Datadog" && exp.role === "Product Manager"
              );
              // Hide summary for jobs after the Datadog PM role
              const showSummary = index <= datadogPMIndex;
              
              if (showSummary) return null;
              
              return (
                <MotionCard
                  key={experience.company}
                  className="flex flex-col"
                  whileHover={{ rotate: -0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <div>
                    <p className="font-mono text-xs uppercase text-text-secondary">{experience.timeframe}</p>
                    <h3 className="mt-2 text-lg font-semibold">{experience.role}</h3>
                    <p className="font-mono text-xs uppercase tracking-wide">{experience.company}</p>
                    <p className="text-xs text-text-secondary">{experience.location}</p>
                  </div>
                </MotionCard>
              );
            })}
          </div>
        </div>
      </section>

      <section id="projects" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">Projects</p>
          </div>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <MotionCard
              key={project.name}
              whileHover={{ rotate: 0.75 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold">{project.name}</h3>
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
                  <p className="text-sm text-text-secondary">{project.description}</p>
                  <ul className="mt-3 flex flex-wrap gap-2 font-mono text-xs uppercase">
                    {project.stack.map((item) => (
                      <li key={item} className="rounded-md border-2 border-border-heavy bg-bg-beige px-2 py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      </section>

    </div>
  );
}

export const profile = {
  name: "Sean Chow",
  role: "Product-first PM & Engineer",
  headline: "Designing measurable product impact with an engineer's toolkit.",
  summary:
    "Software Engineering graduate turned product leader—currently at Two Sigma—who still writes code to prototype, validate, and launch the tools teams need.",
  status: "Open to advisory opportunities"
};

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/scseanchow" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sean-chow/" },
  { label: "Email", href: "mailto:me@seanchow.com" },
  { label: "Resume", href: "/resume.pdf" }
];

export const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" }
];

export const experiences = [
  {
    role: "Product Manager",
    company: "Two Sigma",
    timeframe: "Jan 2023 — Present",
    location: "New York, NY",
    summary: "Overseeing platform strategy for data observability and monetization programs."
  },
  {
    role: "Sr. Product Manager",
    company: "Kong",
    timeframe: "Oct 2021 — Nov 2022",
    location: "New York, NY",
    summary: "Shipped API gateway capabilities that aligned enterprise security + developer velocity."
  },
  {
    role: "Product Manager",
    company: "Datadog",
    timeframe: "May 2020 — Sep 2021",
    location: "New York, NY",
    summary: "Launched the Datadog Marketplace, onboarding 80+ partner integrations from spec to GTM."
  }
];

export const projects = [
  {
    name: "Just A Bit",
    description:
      "Beacon-powered tipping for street performers with a Coinbase-backed crypto checkout flow.",
    stack: ["React Native", "Coinbase API", "Firebase"],
    href: "https://devpost.com/software/justabit-final"
  },
  {
    name: "Veil",
    description: "Mesh-network health briefs for rural communities built during Guelph Hacks.",
    stack: ["Android", "RightMesh", "P2P"],
    href: "https://github.com/weihanli101/veil"
  },
  {
    name: "Inbox Marketer Research",
    description:
      "Applied TensorFlow models to predict send windows for an email marketing cohort in Guelph.",
    stack: ["TensorFlow", "Python", "Data Science"],
    href: "https://www.inboxmarketer.com/"
  }
];

export const stats = [
  { label: "Years shipping", value: "8", detail: "across PM + engineering" },
  { label: "Integrations launched", value: "80+", detail: "Datadog Marketplace" },
  { label: "Hackathon wins", value: "2", detail: "Coinbase + RightMesh awards" },
  { label: "Commits this year", value: "320", detail: "side-car prototypes" }
];

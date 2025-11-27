export const profile = {
  name: "Sean Chow",
  role: "Product-first PM & Engineer",
  headline: "Building AI/ML infrastructure at scale with product-first thinking.",
  summary:
    "Software Engineering graduate turned product leader, passionate about AI/ML infrastructure and Kubernetes. Still writes production ready code, delivers measurable product impact and launches the tools teams need.",
  status: "Open to consulting/advisory"
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
  { label: "Contact", href: "#contact" }
];

export const experiences = [
  {
    role: "Senior Product Manager",
    company: "CoreWeave",
    timeframe: "Mar 2025 — Present",
    location: "New York, NY",
    summary: "",
    logo: "https://logo.clearbit.com/coreweave.com"
  },
  {
    role: "Product Manager",
    company: "Two Sigma",
    timeframe: "Jan 2023 — Jan 2025",
    location: "New York, NY",
    summary: "Responsible for product suite maintained across 25+ engineers for the Compute, Service Infrastructure and Process Orchestration Workflow teams. Managed product road map and engineering engagements for the Kubernetes platform hosting over 4,000 services and 1,000,000+ of batch jobs a week, supporting data ingestion, low latency live trading, and modeling teams focusing on developer experience, efficiency and reliability. Collaborated with engineering on technical specifications to enable efficient, scalable and reliable compute to support modelling engineering teams and simulations. Secured alignment from 10+ business units across engineering, product, and modeling teams on yearly platform strategy, resulting in a unified road map.",
    logo: "https://logo.clearbit.com/twosigma.com"
  },
  {
    role: "Sr. Product Manager",
    company: "Kong",
    timeframe: "Oct 2021 — Dec 2022",
    location: "New York, NY",
    summary: "Executed comprehensive stakeholder engagement for the Kubernetes product roadmap, open source involvement and shipping of features through agile development for the Kubernetes team; gathering insights from 100+ enterprise users. Created multiple new products from identified problems, ultimately bringing new products from idea to creation and ultimately go-to-market which included sales/technical enablement, developer advocacy and blog posts. Collaborated with engineering on technical specifications for marquee features such as the Kong Gateway Operator, Gateway API support and Kubernetes support for Kong's SaaS product.",
    logo: "https://logo.clearbit.com/konghq.com"
  },
  {
    role: "Product Manager",
    company: "Datadog",
    timeframe: "May 2020 — Sep 2021",
    location: "New York, NY",
    summary: "Led strategic planning for the Marketplace team, owning the product strategy, road map and shipping of features, through creation of product specifications and agile development. Grew the partner integration ecosystem by overseeing the on-boarding and development of 80+ technology partner contributions from product ideation phase to release, including go-to-market activities. Brought the Datadog Marketplace from ideation to go-to-market, launching an ecosystem of partner created integrations and products that grew from $0 to > $1.5m ARR.",
    logo: "https://imgix.datadoghq.com/img/about/presskit/logo-v/logo_vertical_white.png"
  },
  {
    role: "Product Manager Intern",
    company: "Datadog",
    timeframe: "May 2019 — Aug 2019",
    location: "New York, NY",
    summary: "Led strategic planning for the containers integration team, focusing on instrumentation and visibility of the Datadog agent on platforms such as Kubernetes, GKE and EKS, growing adoption by 21%.",
    logo: "https://imgix.datadoghq.com/img/about/presskit/logo-v/logo_vertical_white.png"
  },
  {
    role: "Software Engineer Intern",
    company: "Wave",
    timeframe: "Jan 2019 — May 2019",
    location: "Toronto, ON",
    summary: "Part of the developer systems team, creating tools to increase developer efficiency. Developed a command line tool in TypeScript to monitor local developer systems and reduced local Docker development build time by 120%.",
    logo: "https://www.waveapps.com/assets/images/logos/wave-logo.svg"
  },
  {
    role: "Software Developer Intern",
    company: "Zenreach",
    timeframe: "May 2018 — Aug 2018",
    location: "Waterloo, Canada",
    summary: "A late stage startup which modernizes marketing for the offline world. Made the 2017 break out list, backed by venture capatalists of the likes of Peter Thiel and Kevin Durant. Work includes fulfilling product iniatives through creating front end features coded in Javascript/HTML/CSS leveraging the React framework and backend services in Django."
  },
  {
    role: "Software Developer Intern",
    company: "Freshbooks",
    timeframe: "Sept 2017 — Dec 2017",
    location: "Toronto, Canada",
    summary: "A cloud accounting software as a service which makes accounting accessible and easy for small businesses. Work includes implementing product functionality and performing experiments via A/B (split) testing. Engineered front end functionality using Javascript/HTML/CSS in the EmberJS framework and backend functions in Python in the Flask framework. Automatic tests were created using the Cucumber mark down language and Selenium.",
    logo: "https://logo.clearbit.com/freshbooks.com"
  },
  {
    role: "Software Developer Intern",
    company: "Tulip",
    timeframe: "May 2017 — Aug 2017",
    location: "Waterloo, Canada",
    summary: "Tulip is an application which puts power into the sales associate's hand to assist brick and mortar stores. Used PHP to transform client data and write SQL queries to insert them as defined objects to be used by the application. Also focused on the creation of dashboards to display key metrics and analytics on the application in vanilla Javascript.",
    logo: "https://logo.clearbit.com/tulip.com"
  },
  {
    role: "Software Developer Intern",
    company: "VSETA",
    timeframe: "Apr 2016 — Aug 2016",
    location: "Toronto, Canada",
    summary: "VSETA aimed at using IOT technologies, specifically iBeacons, to solve inefficiences in everyday life. Created the mobile app using the Apache Cordova framework written in Javascript/HTML/CSS. Provided an unique and end user focused experience through innovative mobile design patterns."
  }
];

export const projects = [
  {
    name: "Music Game",
    description:
      "A Jackbox-style multiplayer game where players join a common lobby and compete to guess songs the fastest. Real-time gameplay with synchronized audio playback and instant scoring.",
    stack: ["TypeScript", "React", "Node.js"],
    href: "https://musicgame.seanchow.com"
  },
  {
    name: "Just A Bit",
    description:
      "Created for Hack the North 2016, at the University of Waterloo. The application detects nearby iBeacons and gives the user the option to donate a custom amount towards the street performer. Using Coinbase's API, we were able to create a secure, private and effective POS system.",
    stack: ["React Native", "Coinbase API", "Firebase"],
    href: "https://devpost.com/software/justabit-final"
  },
  {
    name: "Veil",
    description: "Created for Guelph Hacks 2018, at the University of Guelph. Veil was a mobile application was made to solve the problem of providing health care information for inviduals or populations with poor or no internet access. This was achieved did this by using the Right Mesh API to allow P2P data transfer through a mesh network.",
    stack: ["Android", "RightMesh", "P2P"],
    href: "https://github.com/weihanli101/veil"
  },
  {
    name: "Inbox Marketer Research",
    description:
      "Under the supervision of Dr. Daniel Gillis, I worked closely with a local e-mail marketing company to investigate their data set and generate actionable insights. Using Tensorflow and iPython I was able to groom the dataset, and train a machine learning model (Linear Regression & Recursive Neural Network) to predic the best times to send an email during the day, per industry.",
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

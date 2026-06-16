import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import {
  Boxes,
  CalendarDays,
  Compass,
  GitBranch,
  GraduationCap,
  Layers3,
  ListChecks,
  X,
  type LucideIcon,
} from 'lucide-react';
const FluidCanvas = lazy(() =>
  import('./FluidCanvas').then((module) => ({ default: module.FluidCanvas })),
);
import fluidityMark from './assets/fluidity-labs-standalone-icon.svg?url';
import airByLexvorLogo from './assets/trusted/air-by-lexvor-clean.png';
import cointelegraphLogo from './assets/trusted/cointelegraph-muted.svg?url';
import csgLogo from './assets/trusted/csg-muted.svg?url';
import kerousLogo from './assets/trusted/kerous-old-muted.png';
import tMobileLogo from './assets/trusted/t-mobile-muted.svg?url';
import uminersLogo from './assets/trusted/uminers-muted.svg?url';
import vapeRepublicLogo from './assets/trusted/vape-republic-logo.png';
import aiLeverageMapImage from './assets/what-we-do-ai-leverage-map.webp';
import aiUseCasesImage from './assets/what-we-do-ai-use-cases.webp';
import buildSystemsImage from './assets/what-we-do-build-systems.webp';
import trainTeamImage from './assets/what-we-do-train-team.webp';
import workflowAuditCallImage from './assets/workflow-audit-live-call.webp';
import processBuildLaunchImage from './assets/process-build-and-launch.webp';
import processOngoingImprovementImage from './assets/process-ongoing-improvement.webp';
import agentRobotImage from './assets/agent-robot.png';
import homeHeroBackground from './assets/home-hero-background.webp';
import aboutHeroWorkflowImage from './assets/about-hero-workflow.webp';
import aboutWorkflowCloseImage from './assets/about-workflow-close.webp';
import davidNguyenPortrait from './assets/team/david-nguyen.webp';
import filipArambasicPortrait from './assets/team/filip-arambasic.webp';
import karimNasreddinePortrait from './assets/team/karim-nasreddine.webp';

type LenisRuntime = {
  raf: (time: number) => void;
  on: (event: 'scroll', callback: (...args: unknown[]) => void) => void;
  stop: () => void;
  start: () => void;
  destroy: () => void;
  scrollTo: (target: number | string | HTMLElement, options?: { duration?: number; immediate?: boolean; offset?: number }) => void;
};

let lenisInstance: LenisRuntime | null = null;

const TESTIMONIAL_VIDEO_SOURCE = '/assets/um-testimonial.m4v';
const CAL_BOOKING_URL = 'https://cal.com/david.nguyen/intro-call';
const CAL_EMBED_URL = `${CAL_BOOKING_URL}?embed=true&theme=light`;

type Page = 'home' | 'services' | 'about';
type PageNavigate = (page: Page, hash?: string) => void;
type BookingOpen = () => void;

/* ---------------------------------- content --------------------------------- */

const content = {
  brand: 'Fluidity AI',
  nav: [
    { label: 'Approach', href: '#approach' },
    { label: 'Sprint', href: '#sprint' },
    { label: 'What we build', href: '#build' },
    { label: 'Process', href: '#process' },
    { label: 'FAQ', href: '#faq' },
  ],
  trusted: [
    { name: 'T-Mobile', logo: tMobileLogo, slug: 't-mobile' },
    { name: 'Cointelegraph', logo: cointelegraphLogo, slug: 'cointelegraph' },
    { name: 'CSG Forte', logo: csgLogo, slug: 'csg-forte' },
    { name: 'Uminers', logo: uminersLogo, slug: 'uminers' },
    { name: 'Air by Lexvor', logo: airByLexvorLogo, slug: 'air-by-lexvor' },
    { name: 'Kerous', logo: kerousLogo, slug: 'kerous' },
    { name: 'Vape Republic', logo: vapeRepublicLogo, slug: 'vape-republic' },
  ],
  problem: {
    title: 'Most of the work AI could handle is still being done manually.',
    body:
      'Your team may already use AI for writing, research, and one-off tasks. But across the business, people are still chasing updates, moving data, checking work, creating reports, and coordinating next steps by hand.',
    cards: [
      {
        title: 'Teams repeat the same tasks',
        body: 'Every department has recurring follow-ups, checks, updates, reports, and handoffs that still depend on someone doing them manually.',
        icon: ListChecks,
      },
      {
        title: 'Work lives in too many places',
        body: 'Tasks, data, and decisions are spread across inboxes, CRMs, spreadsheets, docs, project boards, and meetings.',
        icon: Boxes,
      },
      {
        title: 'No one knows what AI can take over',
        body: 'Manual steps become normal, so teams miss where AI, automation, or better tools could handle the work.',
        icon: 'thought' as const,
      },
      {
        title: 'AI is used outside the workflow',
        body: 'People use AI for one-off help, then still copy, check, route, approve, and turn the output into action themselves.',
        icon: 'venn' as const,
      },
    ],
  },
  sprint: {
    title: 'One focused sprint. One working system.',
    body: 'Two weeks to identify, build, and launch the first system your team will actually use.',
    cards: [
      {
        title: 'Map the bottleneck',
        body: 'We audit the workflow, tools, handoffs, and decisions slowing your team down.',
        icon: Compass,
        image: aiLeverageMapImage,
        imageAlt: 'AI leverage workflow being mapped on a whiteboard',
        tone: 'blue',
      },
      {
        title: 'Prioritize ROI',
        body: 'We rank opportunities by ROI, complexity, risk, adoption, and speed to launch.',
        icon: GitBranch,
        image: aiUseCasesImage,
        imageAlt: 'AI workflow use cases being presented to a team',
        tone: 'blue',
      },
      {
        title: 'Build the first system',
        body: 'We create the workflow, automation, internal tool, dashboard, or AI agent needed to solve the bottleneck.',
        icon: Layers3,
        image: buildSystemsImage,
        imageAlt: 'Team reviewing a launched product workflow across laptop and mobile screens',
        tone: 'blue',
      },
      {
        title: 'Train the team',
        body: 'We document the workflow, train users, and make sure the system fits into daily work.',
        icon: GraduationCap,
        image: trainTeamImage,
        imageAlt: 'AI systems training session with a team',
        tone: 'blue',
      },
    ],
  },
  build: {
    title: "We don't just advise. We build.",
    body: 'Systems and tools your team will actually use — designed around the workflows, data, and handoffs that already exist.',
    rows: [
      {
        title: 'AI Workflows',
        kicker: 'Automate repeatable business processes',
        body: 'We design and build AI-powered workflows that connect tools, teams, and tasks so work moves faster with less manual effort.',
      },
      {
        title: 'Internal Tools',
        kicker: 'Give your team better ways to work',
        body: 'We build custom dashboards, portals, and operational tools that centralize information and make day-to-day work easier to manage.',
      },
      {
        title: 'AI Agents',
        kicker: 'Let AI handle work between the steps',
        body: 'We build AI agents that support recurring business tasks such as research, writing, analysis, communication, and coordination.',
        robot: true,
      },
    ],
  },
  testimonial: {
    quote:
      'Fluidity helped us find the automation opportunities that actually mattered. We cut project turnaround times by roughly 33%, trimmed weekly check-ins from five hours to two, and freed up the equivalent of a full work-day of capacity across the team.',
    attribution: 'Batyr Hydyrov',
    detail: 'CEO at Uminers',
  },
  process: {
    title: 'From first call to launch.',
    steps: [
      {
        number: '01',
        time: 'Day 0',
        title: 'Workflow audit',
        body: 'A free session to understand the workflow, identify bottlenecks, and spot where AI or automation could move the needle.',
        image: workflowAuditCallImage,
        imageAlt: 'Live Fluidity AI workflow audit call with a team member',
      },
      {
        number: '02',
        time: '48 hours later',
        title: 'Proposal',
        body: 'You get a clear recommendation: what to build first, why it matters, what it will cost, and what success looks like.',
        image: aiUseCasesImage,
        imageAlt: 'AI workflow use cases being presented to a team',
      },
      {
        number: '03',
        time: '2-week sprint',
        title: 'Build and launch',
        body: 'We design, build, test, and deploy the first working system with weekly updates.',
        image: processBuildLaunchImage,
        imageAlt: 'Two teammates building an AI system together on a laptop',
      },
      {
        number: '04',
        time: 'After launch',
        title: 'Ongoing improvement',
        body: 'Optional retainer where we monitor usage, refine the workflow, train the team, and decide what to improve next.',
        image: processOngoingImprovementImage,
        imageAlt: 'Team reviewing dashboard metrics for ongoing AI workflow improvement',
      },
    ],
  },
  faq: [
    {
      question: 'What do we get from the growth mapping call?',
      answer:
        'You’ll leave with a clearer view of where AI may create leverage, which workflow is worth prioritizing first, and what the next practical step should be.',
    },
    {
      question: 'Do we need to know what we want to build first?',
      answer:
        'No. That’s usually the problem. We help identify where AI can create the most leverage, then recommend the first workflow worth building.',
    },
    {
      question: 'Do you only advise, or do you build too?',
      answer:
        'We do both. We map the opportunity, design the workflow, build the first working solution, and help your team adopt it.',
    },
    {
      question: 'Can you work with our existing tools?',
      answer:
        'Yes. The goal is usually not to replace your stack. We look at the tools your team already uses, then build around the workflows, data, and handoffs that matter.',
    },
    {
      question: 'What kinds of workflows can you help with?',
      answer:
        'Common starting points include sales follow-up, operations handoffs, admin tasks, reporting, internal knowledge, customer support, and decision support.',
    },
    {
      question: 'How long does it take to launch the first workflow?',
      answer:
        'Most first workflows can be mapped, prioritized, built, and launched within about two weeks, depending on scope, access, and complexity.',
    },
    {
      question: 'Will this disrupt our current operations?',
      answer:
        'The goal is the opposite. We start with one high-leverage workflow, keep scope tight, and build around how your team already works.',
    },
    {
      question: 'What happens after launch?',
      answer:
        'We train your team, monitor adoption, improve the workflow, and help decide whether to refine it, expand it, or move to the next opportunity.',
    },
    {
      question: 'What if AI is not the right solution for our problem?',
      answer:
        'Then we’ll say so. Sometimes the highest-leverage fix is process clarity, better handoffs, or cleaner data before automation.',
    },
    {
      question: 'What kind of companies do you work with?',
      answer:
        'Teams that know AI could help but are unsure where to start, what to build, or how to get adoption beyond experiments and disconnected tools.',
    },
  ],
  cta: {
    title: 'Feel like your business is falling behind on AI?',
    body: 'Book a free 30-minute growth mapping call. We’ll audit your funnel, find the bottlenecks, and show you exactly where AI moves the needle.',
    button: 'Book an intro call',
  },
  services: {
    intro: {
      title: 'What should stop being manual first?',
      body:
        'We map the current workflow, estimate ROI, define the risk and adoption requirements, then build the first useful version. You leave with a working system, documentation, and a clear path for what to automate next.',
    },
    verticals: [
      {
        title: 'Healthcare operations',
        body: 'Patient intake, referral routing, appointment follow-up, recall campaigns, and practice reporting that reduce administrative drag.',
        tags: ['Patient follow-up', 'Intake workflows', 'Practice reporting'],
      },
      {
        title: 'E-commerce teams',
        body: 'Support triage, inventory alerts, product data cleanup, retention workflows, and customer communication across growing catalogs.',
        tags: ['Support triage', 'Retention flows', 'Catalog ops'],
      },
      {
        title: 'Finance and investment teams',
        body: 'Portfolio reporting, document intake, investor updates, CRM hygiene, and internal dashboards for faster visibility.',
        tags: ['Reporting', 'Investor CRM', 'Dashboards'],
      },
      {
        title: 'Local service businesses',
        body: 'Lead response, booking, estimate follow-up, review requests, and field-to-office handoffs for service teams.',
        tags: ['Booking', 'Lead response', 'Reviews'],
      },
      {
        title: 'Marketing agencies',
        body: 'Client onboarding, campaign reporting, scope generation, research workflows, and delivery systems that make account teams sharper.',
        tags: ['Onboarding', 'Reporting', 'Delivery ops'],
      },
      {
        title: 'Creative and production teams',
        body: 'Brief creation, asset review, approval routing, version tracking, and production coordination across clients and stakeholders.',
        tags: ['Creative briefs', 'Approvals', 'Asset routing'],
      },
      {
        title: 'Content and media operations',
        body: 'Editorial calendars, research assistance, draft workflows, quality checks, and publishing handoffs that keep output consistent.',
        tags: ['Editorial ops', 'Research', 'Publishing'],
      },
      {
        title: 'AI and automation agencies',
        body: 'Reusable delivery systems, partner portals, white-label workflow infrastructure, and internal tools for shipping client work faster.',
        tags: ['White-label systems', 'Partner ops', 'Delivery tools'],
      },
      {
        title: 'Paid acquisition teams',
        body: 'Campaign QA, lead routing, performance reporting, experiment tracking, and landing-page operations across channels.',
        tags: ['Lead routing', 'Campaign QA', 'Performance ops'],
      },
      {
        title: 'Social and executive brand teams',
        body: 'Idea capture, content repurposing, approval workflows, outbound sequences, and audience research for consistent publishing.',
        tags: ['Content repurposing', 'Outreach', 'Research'],
      },
      {
        title: 'Managed service providers',
        body: 'Ticket triage, client health tracking, SLA reporting, onboarding checklists, and account workflows that protect service quality.',
        tags: ['Ticket triage', 'Client health', 'SLA reports'],
      },
      {
        title: 'Real estate and development',
        body: 'Deal flow tracking, lead qualification, investor communication, document coordination, and market research workflows.',
        tags: ['Deal flow', 'Qualification', 'Investor updates'],
      },
      {
        title: 'Brokerages and financial services',
        body: 'Client onboarding, document processing, renewal workflows, compliance-aware follow-up, and sales pipeline visibility.',
        tags: ['Onboarding', 'Document intake', 'Pipeline visibility'],
      },
      {
        title: 'SaaS and software companies',
        body: 'User onboarding, churn signals, support automation, feedback routing, and internal dashboards for product and customer teams.',
        tags: ['Onboarding', 'Churn signals', 'Support ops'],
      },
      {
        title: 'Education and communities',
        body: 'Member onboarding, lesson delivery, engagement tracking, support flows, and community operations for programs that need structure.',
        tags: ['Member onboarding', 'Engagement', 'Support'],
      },
      {
        title: 'Enterprise operations',
        body: 'Cross-functional workflows, approval systems, knowledge routing, reporting layers, and integrations across complex teams.',
        tags: ['Integrations', 'Approvals', 'Knowledge ops'],
      },
      {
        title: 'Hospitality and luxury services',
        body: 'Guest requests, VIP preferences, booking workflows, concierge handoffs, and follow-up systems for high-touch experiences.',
        tags: ['Concierge ops', 'Bookings', 'VIP workflows'],
      },
      {
        title: 'HR and recruiting',
        body: 'Candidate intake, resume review support, interview scheduling, scorecards, and hiring pipeline coordination.',
        tags: ['Candidate intake', 'Scheduling', 'Scorecards'],
      },
      {
        title: 'Info products and memberships',
        body: 'Funnel operations, student onboarding, course support, renewal prompts, and engagement systems that keep members moving.',
        tags: ['Student onboarding', 'Course support', 'Renewals'],
      },
      {
        title: 'Coaching and consulting',
        body: 'Lead capture, session prep, follow-up, client portals, resource delivery, and recurring check-ins for service businesses.',
        tags: ['Client portals', 'Follow-up', 'Session prep'],
      },
    ],
  },
  about: {
    story: {
      title: "The gap is not usually ambition. It's execution.",
      body:
        'Most teams can see that AI is changing the way work gets done. The hard part is knowing which manual steps are worth replacing, how to connect the tools already in use, and how to launch something the team will trust. That is the space Fluidity works in.',
    },
    principles: [
      {
        title: 'Start with the workflow',
        body: 'We begin with the real handoffs, approvals, decisions, and repeated steps that shape daily work.',
      },
      {
        title: 'Build the first useful system',
        body: 'We keep scope tight enough to launch quickly, but complete enough that the result belongs inside the workflow.',
      },
      {
        title: 'Design for adoption',
        body: 'A system only matters if people use it. Training, documentation, and fit with existing tools are part of the build.',
      },
      {
        title: 'Keep improving after launch',
        body: 'The first version creates leverage. Usage, feedback, and cleaner data show where the next improvement should go.',
      },
    ],
    work: [
      {
        label: '01',
        title: 'Map what is manual',
        body: 'We look for repeated work, slow handoffs, scattered context, and reporting loops that absorb team capacity.',
      },
      {
        label: '02',
        title: 'Choose the highest-leverage build',
        body: 'We prioritize the system by ROI, complexity, risk, adoption, and how quickly it can be launched.',
      },
      {
        label: '03',
        title: 'Ship with the team',
        body: 'We build, test, document, and train around the way your team already works.',
      },
    ],
    leadership: [
      {
        name: 'Filip Arambasic',
        role: 'CEO & Talent',
        image: filipArambasicPortrait,
        body:
          'Filip brings deep fintech and startup experience to Fluidity, with a strong track record across product strategy, go-to-market thinking, and talent development. At Fluidity, Filip leads AI strategy, helping clients identify where intelligent automation can create real business leverage. He translates emerging AI capabilities into clear commercial opportunities, aligning technology, operations, and growth around systems that are practical, adoptable, and built for the future.',
      },
      {
        name: 'David Nguyen',
        role: 'Head of AI Solutions',
        image: davidNguyenPortrait,
        body:
          'David brings extensive consulting experience, helping organizations turn complex operational challenges into clear, executable technology strategies. At Fluidity, David architects AI-driven automations, intelligent workflows, and end-to-end systems that cut overhead and accelerate growth. He runs client engagements from strategy through deployment, translating business problems into production-grade AI solutions that improve how teams work.',
      },
      {
        name: 'Karim Nasreddine',
        role: 'Head of Delivery',
        image: karimNasreddinePortrait,
        body:
          "Karim owns the end-to-end technical execution of Fluidity's client engagements, bringing strategic roadmaps into production with precision and reliability. He architects backend systems, automation pipelines, and AI infrastructure that are tested, documented, and built to last. From system design through deployment, Karim turns ambitious AI initiatives into scalable technical solutions that run reliably in the real world.",
      },
    ],
  },
};

/* ------------------------------- custom icons -------------------------------- */

function VennWorkflowIcon({ size = 24 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="venn-left-moon">
          <path d="M12 6.8C10.2 8 9 9.9 9 12s1.2 4 3 5.2C10.2 18 8.4 18 6.8 17.1 4.5 15.8 3 13.4 3 12s1.5-3.8 3.8-5.1C8.4 6 10.2 6 12 6.8Z" />
        </clipPath>
      </defs>
      <circle cx="9" cy="12" r="6" fill="currentColor" clipPath="url(#venn-left-moon)" />
      <circle cx="9" cy="12" r="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15" cy="12" r="6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ThoughtQuestionIcon({ size = 24 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.9 17.3C4.5 16.5 3 14.6 3 12.2 3 9 6.1 6.4 10 6.4h3.7c4 0 7.3 2.6 7.3 5.8S17.7 18 13.7 18h-3.3l-3.8 2.3.3-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <text dominantBaseline="middle" fill="currentColor" fontSize="9.6" fontWeight="700" stroke="none" textAnchor="middle" x="12" y="13.15">
        ?
      </text>
    </svg>
  );
}

function ProblemIcon({ icon, size = 28 }: { icon: LucideIcon | 'venn' | 'thought'; size?: number }) {
  if (icon === 'venn') return <VennWorkflowIcon size={size} />;
  if (icon === 'thought') return <ThoughtQuestionIcon size={size} />;
  const Icon = icon;
  return <Icon size={size} strokeWidth={1.6} />;
}

/* --------------------------------- utilities --------------------------------- */

function scrollToTarget(href: string, behavior: ScrollBehavior = 'smooth') {
  if (!href.startsWith('#')) return false;
  const target = document.querySelector(href);
  if (!target) return false;

  if (lenisInstance && behavior === 'smooth') {
    lenisInstance.start();
    lenisInstance.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior });
  }

  return true;
}

function scrollToHash(event: ReactMouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return;
  if (scrollToTarget(href)) {
    event.preventDefault();
  }
}

function BookingButton({
  className,
  children,
  onOpen,
  title = 'Book an intro call',
}: {
  className?: string;
  children: ReactNode;
  onOpen: BookingOpen;
  title?: string;
}) {
  return (
    <button className={className} onClick={onOpen} title={title} type="button">
      {children}
    </button>
  );
}

function CalModal({ open, onClose, preload }: { open: boolean; onClose: () => void; preload: boolean }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lenisInstance?.stop();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      lenisInstance?.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open && !preload) return null;

  return (
    <div
      className={`cal-modal ${open ? 'is-open' : 'is-preloaded'}`}
      role={open ? 'dialog' : undefined}
      aria-hidden={!open}
      aria-modal={open ? 'true' : undefined}
      aria-label="Book an intro call"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="cal-modal-panel">
        <div className="cal-modal-header">
          <div>
            <span>Fluidity AI</span>
            <strong>Book an intro call</strong>
          </div>
          <button className="cal-modal-close" onClick={onClose} type="button" aria-label="Close calendar">
            <X size={22} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
        <iframe
          allow="camera; microphone; fullscreen; payment"
          className="cal-modal-frame"
          loading="eager"
          src={CAL_EMBED_URL}
          title="Book an intro call with Fluidity AI"
        />
      </div>
    </div>
  );
}

function Eyebrow({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="eyebrow" data-reveal>
      <span className="eyebrow-index">{index}</span>
      <span className="eyebrow-rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/* ----------------------------------- nav ------------------------------------ */

function Nav({
  page = 'home',
  onBookIntro,
  onPageNavigate,
}: {
  page?: Page;
  onBookIntro: BookingOpen;
  onPageNavigate?: PageNavigate;
}) {
  const isInteriorPage = page !== 'home';
  const [scrolled, setScrolled] = useState(() => isInteriorPage || window.scrollY > 40);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    setHidden(false);

    function onScroll() {
      const y = window.scrollY;
      setScrolled(isInteriorPage || y > 40);
      setHidden(y > 520 && y > lastY.current);
      lastY.current = y;
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isInteriorPage]);

  return (
    <header
      className={`site-nav ${scrolled || isInteriorPage ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}
      aria-label="Primary navigation"
    >
      <a
        className="brand nav-pill"
        href={isInteriorPage ? '/' : '#top'}
        onClick={(event) => {
          if (isInteriorPage) {
            event.preventDefault();
            onPageNavigate?.('home');
          } else {
            scrollToHash(event, '#top');
          }
        }}
        aria-label="Fluidity AI home"
      >
        <img src={fluidityMark} alt="" />
        <span>{content.brand}</span>
      </a>

      <div className="nav-group nav-pill">
        <nav className="nav-links" aria-label="Main menu">
          <a
            href="/services"
            onClick={(event) => {
              event.preventDefault();
              onPageNavigate?.('services');
            }}
          >
            Services
          </a>
          <a
            href="/about"
            onClick={(event) => {
              event.preventDefault();
              onPageNavigate?.('about');
            }}
          >
            About
          </a>
        </nav>
        <BookingButton className="button button-small nav-cta" onOpen={onBookIntro} title="Book an intro call">
          Contact us
        </BookingButton>
      </div>
    </header>
  );
}

/* ----------------------------------- hero ----------------------------------- */

function Hero({ onBookIntro, onHeroReady }: { onBookIntro: BookingOpen; onHeroReady: () => void }) {
  return (
    <section
      className="hero relative flex min-h-screen flex-col overflow-hidden bg-black"
      id="top"
      aria-labelledby="hero-title"
    >
      <img
        className="hero-image absolute inset-0 h-full w-full object-cover"
        src={homeHeroBackground}
        alt=""
        aria-hidden="true"
        decoding="async"
        onLoad={onHeroReady}
      />

      <div className="hero-media-scrim absolute inset-0" aria-hidden="true" />

      <div className="hero-content relative z-10 flex flex-1 -translate-y-[4%] flex-col items-center justify-center px-6 py-12 text-center md:-translate-y-[12%] lg:-translate-y-[20%]">

        <h1 className="hero-title" id="hero-title">
          <span className="hero-line">
            <span className="hero-line-inner">AI can do more than assist your team.</span>
          </span>
          {' '}
          <span className="hero-line">
            <span className="hero-line-inner">It can take work off their plate.</span>
          </span>
        </h1>

        <p className="hero-sub">
          In two weeks, we identify the highest-ROI automation opportunities across your business, then build the
          workflows and tools to make it happen.
        </p>

        <div className="hero-cta">
          <BookingButton className="button button-small intro-button" onOpen={onBookIntro}>
            <CalendarDays size={16} strokeWidth={1.8} aria-hidden="true" />
            <span>Book an intro call</span>
          </BookingButton>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- trusted ----------------------------------- */

function Trusted() {
  return (
    <section className="trusted" aria-label="Brands we work with">
      <p className="trusted-label" data-reveal>
        Brands we work with
      </p>
      <div className="marquee" data-reveal>
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div className="marquee-group" key={group}>
              {content.trusted.map((org) => (
                <span className={`marquee-item logo-${org.slug}`} key={`${org.slug}-${group}`}>
                  <img src={org.logo} alt={group === 0 ? org.name : ''} loading="lazy" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- problem ---------------------------------- */

function Problem() {
  return (
    <section className="problem section" id="approach" aria-labelledby="problem-title">
      <div className="section-head">
        <Eyebrow index="01">The problem</Eyebrow>
        <h2 className="section-title split-reveal" id="problem-title">
          {content.problem.title}
        </h2>
        <p className="section-body" data-reveal>
          {content.problem.body}
        </p>
      </div>

      <div className="problem-grid">
        {content.problem.cards.map((card) => (
          <article className="problem-card" key={card.title}>
            <span className="problem-icon" aria-hidden="true">
              <ProblemIcon icon={card.icon} />
            </span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------- sprint ---------------------------------- */

function Sprint({ onBookIntro }: { onBookIntro: BookingOpen }) {
  return (
    <section className="sprint" id="sprint" aria-labelledby="sprint-title">
      <div className="sprint-pin">
        <div className="section-head sprint-head">
          <Eyebrow index="02">The 2-Week Sprint</Eyebrow>
          <h2 className="section-title split-reveal" id="sprint-title">
            One focused sprint. <span className="dim">One working system.</span>
          </h2>
          <p className="section-body" data-reveal>
            {content.sprint.body}
          </p>
        </div>

        <div className="sprint-viewport">
          <div className="sprint-track">
            {content.sprint.cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <article className={`sprint-card tone-${card.tone}`} key={card.title}>
                  <div className="sprint-card-media">
                    <img src={card.image} alt={card.imageAlt} loading="lazy" />
                  </div>
                  <div className="sprint-card-meta">
                    <span className="sprint-card-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="sprint-card-icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              );
            })}
            <div className="sprint-endcap">
              <p>
                Day 14: <em>your first system is live.</em>
              </p>
              <BookingButton className="button button-primary intro-button sprint-endcap-button" onOpen={onBookIntro}>
                <CalendarDays size={17} strokeWidth={1.9} aria-hidden="true" />
                <span>Book an intro call</span>
              </BookingButton>
            </div>
          </div>
        </div>

        <div className="sprint-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- build ----------------------------------- */

function Build() {
  return (
    <section className="build section" id="build" aria-labelledby="build-title">
      <div className="section-head">
        <Eyebrow index="03">What we build</Eyebrow>
        <h2 className="section-title split-reveal" id="build-title">
          We don’t just advise. <span className="dim">We build.</span>
        </h2>
        <p className="section-body" data-reveal>
          {content.build.body}
        </p>
      </div>

      <div className="build-rows">
        {content.build.rows.map((row, index) => (
          <article className="build-row" key={row.title}>
            <span className="build-index">0{index + 1}</span>
            <div className="build-main">
              <h3>
                {row.title}
                {row.robot ? <img className="build-robot" src={agentRobotImage} alt="" aria-hidden="true" /> : null}
              </h3>
              <p className="build-kicker">{row.kicker}</p>
            </div>
            <p className="build-body">{row.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- testimonial -------------------------------- */

function TestimonialVideo({ loaded, playing }: { loaded: boolean; playing: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (!playing) {
      video.pause();
      return undefined;
    }

    void video.play().catch(() => undefined);

    return () => {
      video.pause();
    };
  }, [playing]);

  return (
    <video
      ref={videoRef}
      className="testimonial-video"
      src={loaded ? TESTIMONIAL_VIDEO_SOURCE : undefined}
      aria-hidden="true"
      loop
      muted
      playsInline
      preload="metadata"
    />
  );
}

function Testimonial() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollingRef = useRef(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || loadVideo) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [loadVideo]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVideoVisible(entry.isIntersecting);
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (!scrollingRef.current) {
        scrollingRef.current = true;
        setIsScrolling(true);
      }

      if (scrollTimer !== null) window.clearTimeout(scrollTimer);

      scrollTimer = window.setTimeout(() => {
        scrollingRef.current = false;
        setIsScrolling(false);
        scrollTimer = null;
      }, 140);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="testimonial section" aria-label="Client testimonial" ref={sectionRef}>
      <TestimonialVideo loaded={loadVideo} playing={loadVideo && videoVisible && !isScrolling} />
      <div className="testimonial-overlay testimonial-overlay-left" aria-hidden="true" />
      <div className="testimonial-overlay testimonial-overlay-bottom" aria-hidden="true" />

      <blockquote className="testimonial-card">
        <p className="testimonial-quote">{content.testimonial.quote}</p>
        <footer data-reveal>
          <span>{content.testimonial.attribution}</span>
          <span className="testimonial-detail">{content.testimonial.detail}</span>
        </footer>
      </blockquote>
    </section>
  );
}

/* ---------------------------------- process ---------------------------------- */

function Process() {
  return (
    <section className="process section" id="process" aria-labelledby="process-title">
      <div className="section-head">
        <Eyebrow index="04">The process</Eyebrow>
        <h2 className="section-title split-reveal" id="process-title">
          {content.process.title}
        </h2>
      </div>

      <ol className="process-steps">
        <span className="process-line" aria-hidden="true">
          <span className="process-line-fill" />
        </span>
        {content.process.steps.map((step) => (
          <li className="process-step" key={step.number}>
            <span className="process-dot" aria-hidden="true" />
            <div className="process-meta">
              <span className="process-number">{step.number}</span>
              <span className="process-time">{step.time}</span>
            </div>
            <div className="process-copy">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
            <div className="process-media">
              <img src={step.image} alt={step.imageAlt} loading="lazy" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------ faq ------------------------------------ */

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = `faq-panel-${index}`;
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button aria-controls={id} aria-expanded={open} onClick={() => setOpen((value) => !value)} type="button">
        <span className="faq-question">{question}</span>
        <span className="faq-marker" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>
      <div className="faq-panel" id={id} role="region" aria-label={question}>
        <div className="faq-panel-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  return (
    <section className="faq section" id="faq" aria-labelledby="faq-title">
      <div className="faq-side">
        <Eyebrow index="05">FAQ</Eyebrow>
        <h2 className="section-title" id="faq-title" data-reveal>
          Questions, <span className="dim">answered.</span>
        </h2>
        <p className="section-body" data-reveal>
          Everything teams usually ask before starting a sprint.
        </p>
      </div>
      <div className="faq-list" data-reveal>
        {content.faq.map((item, index) => (
          <FaqItem answer={item.answer} index={index} key={item.question} question={item.question} />
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- services --------------------------------- */

function ServicesIntro({ onBookIntro }: { onBookIntro: BookingOpen }) {
  return (
    <section className="services-intro" id="top" aria-labelledby="services-intro-title">
      <div className="services-intro-card" data-reveal>
        <div className="services-intro-copy">
          <p className="services-intro-kicker">How engagements work</p>
          <h1 className="services-intro-title split-reveal" id="services-intro-title">
            {content.services.intro.title}
          </h1>
          <p className="services-intro-body">{content.services.intro.body}</p>
          <BookingButton className="button button-primary intro-button" onOpen={onBookIntro}>
            <CalendarDays size={17} strokeWidth={1.9} aria-hidden="true" />
            <span>Book an intro call</span>
          </BookingButton>
        </div>
        <div className="services-intro-media">
          <img src={workflowAuditCallImage} alt="Live Fluidity AI workflow audit call with a team member" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function ServicesGrid() {
  return (
    <section className="services-list section" aria-labelledby="services-list-title">
      <div className="section-head">
        <Eyebrow index="02">Where we help</Eyebrow>
        <h2 className="section-title split-reveal" id="services-list-title">
          Services shaped around the work already happening in your business.
        </h2>
        <p className="section-body" data-reveal>
          These are common starting points. The exact system depends on your team, stack, data, and the workflow that will create the most leverage first.
        </p>
      </div>

      <div className="services-grid">
        {content.services.verticals.map((service, index) => (
          <article className="service-card" data-reveal key={service.title}>
            <span className="service-card-number">{String(index + 1).padStart(2, '0')}</span>
            <h3>{service.title}</h3>
            <p>{service.body}</p>
            <div className="service-tags" aria-label={`${service.title} examples`}>
              {service.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicesPage({ onBookIntro, onPageNavigate }: { onBookIntro: BookingOpen; onPageNavigate: PageNavigate }) {
  return (
    <>
      <Nav onBookIntro={onBookIntro} onPageNavigate={onPageNavigate} page="services" />
      <main className="services-page">
        <ServicesIntro onBookIntro={onBookIntro} />
        <ServicesGrid />
      </main>
      <CtaFooter onBookIntro={onBookIntro} onPageNavigate={onPageNavigate} page="services" />
    </>
  );
}

/* ----------------------------------- about ---------------------------------- */

function AboutHero() {
  return (
    <section className="about-hero" id="top" aria-labelledby="about-title">
      <div className="about-hero-copy">
        <Eyebrow index="01">About Fluidity</Eyebrow>
        <h1 className="about-hero-title split-reveal" id="about-title">
          {content.about.story.title}
        </h1>
        <p className="about-hero-body" data-reveal>
          {content.about.story.body}
        </p>
      </div>
      <div className="about-hero-media" data-reveal>
        <img src={aboutHeroWorkflowImage} alt="AI workflow strategy being presented to a team" loading="lazy" />
      </div>
    </section>
  );
}

function AboutPrinciples() {
  return (
    <section className="about-principles section" aria-labelledby="about-principles-title">
      <div className="section-head">
        <Eyebrow index="03">What guides the work</Eyebrow>
        <h2 className="section-title split-reveal" id="about-principles-title">
          Practical systems beat impressive demos.
        </h2>
        <p className="section-body" data-reveal>
          Our default bias is toward focused, useful systems that remove real work from the team.
        </p>
      </div>

      <div className="about-principles-grid">
        {content.about.principles.map((principle, index) => (
          <article className="about-principle-card" data-reveal key={principle.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutWork() {
  return (
    <section className="about-work section" aria-labelledby="about-work-title">
      <div className="section-head">
        <Eyebrow index="04">How we work</Eyebrow>
        <h2 className="section-title split-reveal" id="about-work-title">
          We stay close to the workflow until the system works.
        </h2>
        <p className="section-body" data-reveal>
          Discovery, build, training, and iteration are connected. That is how the system survives first contact with daily work.
        </p>
      </div>

      <div className="about-work-layout">
        <div className="about-work-media" data-reveal>
          <img src={aboutWorkflowCloseImage} alt="Product launch workflow being mapped on a whiteboard" loading="lazy" />
        </div>
        <div className="about-work-list">
          {content.about.work.map((item) => (
            <article className="about-work-item" data-reveal key={item.title}>
              <span>{item.label}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutLeadership() {
  return (
    <section className="about-leadership section" aria-labelledby="about-leadership-title">
      <div className="section-head">
        <Eyebrow index="02">Leadership team</Eyebrow>
        <h2 className="section-title split-reveal" id="about-leadership-title">
          The people guiding the work.
        </h2>
        <p className="section-body" data-reveal>
          Strategy, solution design, and delivery stay connected from first conversation to launch.
        </p>
      </div>

      <div className="about-leadership-grid">
        {content.about.leadership.map((member, index) => (
          <article className="about-leadership-card" data-reveal key={`${member.name}-${index}`}>
            <div className="about-leadership-avatar">
              <img src={member.image} alt={`${member.name}, ${member.role}`} loading="lazy" />
            </div>
            <div className="about-leadership-copy">
              <div>
                <h3>{member.name}</h3>
                <p className="about-leadership-role">{member.role}</p>
              </div>
              <p>{member.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutPage({ onBookIntro, onPageNavigate }: { onBookIntro: BookingOpen; onPageNavigate: PageNavigate }) {
  return (
    <>
      <Nav onBookIntro={onBookIntro} onPageNavigate={onPageNavigate} page="about" />
      <main className="about-page">
        <AboutHero />
        <AboutLeadership />
        <AboutPrinciples />
        <AboutWork />
      </main>
      <CtaFooter onBookIntro={onBookIntro} onPageNavigate={onPageNavigate} page="about" />
    </>
  );
}

/* ---------------------------------- cta/footer -------------------------------- */

function CtaFooter({
  page = 'home',
  onBookIntro,
  onPageNavigate,
}: {
  page?: Page;
  onBookIntro: BookingOpen;
  onPageNavigate?: PageNavigate;
}) {
  const isHomePage = page === 'home';
  const ctaRef = useRef<HTMLElement | null>(null);
  const [canLoadCanvas, setCanLoadCanvas] = useState(false);
  const [loadCanvas, setLoadCanvas] = useState(false);
  const footerExploreLinks = [
    { label: '2 Week Sprint', href: '#sprint' },
    { label: 'Process', href: '#process' },
    { label: 'What we build', href: '#build' },
    { label: 'FAQ', href: '#faq' },
  ];
  const footerCompanyLinks = [
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
  ];

  const footerHref = (href: string) => {
    if (href.startsWith('/')) return href;
    if (isHomePage || href === '#contact') return href;
    return `/${href}`;
  };

  const handleFooterNav = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/services' || href === '/about') {
      event.preventDefault();
      onPageNavigate?.(href === '/services' ? 'services' : 'about');
      return;
    }

    if (!isHomePage && href.startsWith('#') && href !== '#contact') {
      event.preventDefault();
      onPageNavigate?.('home', href);
      return;
    }

    if (href.startsWith('#')) {
      scrollToHash(event, href);
    }
  };

  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta || !canLoadCanvas || loadCanvas) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadCanvas(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );

    observer.observe(cta);
    return () => observer.disconnect();
  }, [canLoadCanvas, loadCanvas]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const updateCanvasEligibility = () => {
      setCanLoadCanvas(query.matches);
      if (!query.matches) setLoadCanvas(false);
    };

    updateCanvasEligibility();
    query.addEventListener('change', updateCanvasEligibility);

    return () => query.removeEventListener('change', updateCanvasEligibility);
  }, []);

  return (
    <footer className="footer" id="contact">
      <section className="cta" aria-labelledby="cta-title" ref={ctaRef}>
        {canLoadCanvas && loadCanvas ? (
          <Suspense fallback={null}>
            <FluidCanvas className="cta-canvas" />
          </Suspense>
        ) : null}
        <div className="cta-veil" aria-hidden="true" />

        <div className="cta-inner">
          <Eyebrow index="06">Next step</Eyebrow>
          <h2 className="cta-title split-reveal" id="cta-title">
            Feel like your business is <em>falling behind</em> on AI?
          </h2>
          <p className="cta-body" data-reveal>
            {content.cta.body}
          </p>
          <div className="cta-action" data-reveal>
            <button
              className="button button-primary intro-button"
              onClick={onBookIntro}
              title="Book an intro call"
              type="button"
            >
              <CalendarDays size={18} strokeWidth={1.9} aria-hidden="true" />
              <span>{content.cta.button}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="footer-dark">
        <div className="footer-main">
          <div className="footer-work" data-reveal>
            <p className="footer-work-label">Work with us</p>
            <h2>Start with a free, thirty-minute growth call.</h2>
            <button className="button button-light intro-button" onClick={onBookIntro} title="Book an intro call" type="button">
              <CalendarDays size={17} strokeWidth={1.9} aria-hidden="true" />
              <span>Book an intro call</span>
            </button>
          </div>

          <nav className="footer-cols" aria-label="Footer" data-reveal>
            <div>
              <p>Explore</p>
              {footerExploreLinks.map((item) => {
                const href = footerHref(item.href);
                return (
                  <a href={href} key={item.label} onClick={(event) => handleFooterNav(event, item.href)}>
                    {item.label}
                  </a>
                );
              })}
            </div>
            <div>
              <p>Company</p>
              {footerCompanyLinks.map((item) => {
                const href = footerHref(item.href);
                return (
                  <a href={href} key={item.label} onClick={(event) => handleFooterNav(event, item.href)}>
                    {item.label}
                  </a>
                );
              })}
              <a
                href={CAL_BOOKING_URL}
                onClick={(event) => {
                  event.preventDefault();
                  onBookIntro();
                }}
              >
                Book a call
              </a>
            </div>
          </nav>
        </div>

        <p className="footer-watermark" aria-hidden="true">
          FLUIDITY
        </p>

        <div className="footer-legal">
          <a
            className="brand"
            href={!isHomePage ? '/' : '#top'}
            onClick={(event) => {
              if (!isHomePage) {
                event.preventDefault();
                onPageNavigate?.('home');
              } else {
                scrollToHash(event, '#top');
              }
            }}
          >
            <img src={fluidityMark} alt="" />
            <span>{content.brand}</span>
          </a>
          <span>© 2026 Fluidity AI. All rights reserved.</span>
          <span>Idea to launch in 2 weeks.</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------ app ------------------------------------ */

function pageFromLocation(): Page {
  if (window.location.pathname === '/services') return 'services';
  if (window.location.pathname === '/about') return 'about';
  return 'home';
}

export function App() {
  const [page, setPage] = useState<Page>(() => pageFromLocation());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarPreload, setCalendarPreload] = useState(false);
  const pendingHashRef = useRef<string | null>(window.location.hash || null);
  const calendarPreloadTimerRef = useRef<number | null>(null);

  const navigateToPage = useCallback((nextPage: Page, hash?: string) => {
    const nextPath = nextPage === 'services' ? '/services' : nextPage === 'about' ? '/about' : '/';
    const nextUrl = hash ? `${nextPath}${hash}` : nextPath;

    pendingHashRef.current = hash || null;
    window.history.pushState(null, '', nextUrl);
    setPage(nextPage);
  }, []);

  const openCalendar = useCallback(() => {
    if (calendarPreloadTimerRef.current !== null) {
      window.clearTimeout(calendarPreloadTimerRef.current);
      calendarPreloadTimerRef.current = null;
    }
    setCalendarPreload(true);
    setCalendarOpen(true);
  }, []);

  const closeCalendar = useCallback(() => {
    setCalendarOpen(false);
  }, []);

  const preloadCalendar = useCallback(() => {
    if (calendarPreloadTimerRef.current !== null) return;

    calendarPreloadTimerRef.current = window.setTimeout(() => {
      setCalendarPreload(true);
      calendarPreloadTimerRef.current = null;
    }, 1800);
  }, []);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';

    const handlePopState = () => {
      pendingHashRef.current = window.location.hash || null;
      setPage(pageFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      if (calendarPreloadTimerRef.current !== null) window.clearTimeout(calendarPreloadTimerRef.current);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const targetHash = pendingHashRef.current;
    pendingHashRef.current = null;

    window.requestAnimationFrame(() => {
      if (targetHash && scrollToTarget(targetHash, 'auto')) return;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [page]);

  useEffect(() => {
    if (page === 'home' || calendarPreload) return undefined;

    const preloadTimer = window.setTimeout(() => {
      setCalendarPreload(true);
    }, 1600);

    return () => window.clearTimeout(preloadTimer);
  }, [calendarPreload, page]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const splits: Array<{ revert: () => void }> = [];
    let ctx: { revert: () => void } | undefined;
    let lenis: LenisRuntime | undefined;
    let gsapRuntime:
      | {
          ticker: {
            add: (callback: (time: number) => void) => void;
            remove: (callback: (time: number) => void) => void;
            lagSmoothing: (value: number) => void;
          };
        }
      | undefined;
    let raf: ((time: number) => void) | undefined;
    let cancelled = false;

    if (reducedMotion) {
      return undefined;
    }

    const setupAnimations = async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
        import('lenis'),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger, SplitText);
      gsapRuntime = gsap;

      const nextLenis = new Lenis({ autoRaf: false, lerp: 0.115 }) as LenisRuntime;
      lenis = nextLenis;
      lenisInstance = nextLenis;
      nextLenis.on('scroll', () => ScrollTrigger.update());
      raf = (time: number) => nextLenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 2200))]);
      if (cancelled) return;

      ctx = gsap.context(() => {
        /* ---- intro: hero reveal ---- */
        if (document.querySelector('.hero-line-inner')) {
          const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });

          intro
            .from('.hero-line-inner', { yPercent: 112, duration: 1.15, stagger: 0.085, ease: 'power4.out' })
            .from('.hero-sub', { autoAlpha: 0, y: 24, duration: 0.8 }, '-=0.8')
            .from('.hero-cta', { autoAlpha: 0, y: 20, duration: 0.7 }, '-=0.65');
        }

        /* ---- hero scroll drift: cards scatter, content recedes ---- */
        if (document.querySelector('.hero') && document.querySelector('.hero-content')) {
          const heroScroll: ScrollTrigger.Vars = {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.4,
          };
          gsap.to('.hero-content', { yPercent: -12, autoAlpha: 0.3, ease: 'none', scrollTrigger: { ...heroScroll } });
        }

        /* ---- generic reveals ---- */
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

        /* ---- masked line reveals for big headings ---- */
        document.querySelectorAll<HTMLElement>('.split-reveal').forEach((el) => {
          const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
          splits.push(split);
          gsap.from(split.lines, {
            yPercent: 112,
            duration: 1.1,
            stagger: 0.085,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
            onComplete: () => split.revert(),
          });
        });

        /* ---- problem cards ---- */
        if (document.querySelector('.problem-grid')) {
          gsap.from('.problem-card', {
            y: 44,
            autoAlpha: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.problem-grid', start: 'top 84%', once: true },
          });
        }

        /* ---- build rows ---- */
        if (document.querySelector('.build-rows')) {
          gsap.from('.build-row', {
            y: 48,
            autoAlpha: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.build-rows', start: 'top 84%', once: true },
          });
        }

        /* ---- testimonial word reveal ---- */
        const quote = document.querySelector<HTMLElement>('.testimonial-quote');
        if (quote) {
          const split = SplitText.create(quote, { type: 'words' });
          splits.push(split);
          gsap.from(split.words, {
            opacity: 0.14,
            y: 10,
            duration: 0.65,
            ease: 'power2.out',
            stagger: 0.025,
            scrollTrigger: { trigger: '.testimonial', start: 'top 72%', once: true },
          });
        }

        /* ---- process steps + line ---- */
        if (document.querySelector('.process-steps')) {
          gsap.from('.process-step', {
            y: 52,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.process-steps', start: 'top 82%', once: true },
          });
        }
        const processProgress = document.querySelector<HTMLElement>('.process-line-fill');
        if (processProgress) {
          processProgress.style.transform = 'scaleY(0)';
          const processLine = document.querySelector<HTMLElement>('.process-line');
          const updateProcessProgress = () => {
            if (!processLine) return;
            const rect = processLine.getBoundingClientRect();
            const progress = gsap.utils.clamp(0, 1, (window.innerHeight * 0.5 - rect.top) / rect.height);
            processProgress.style.transform = `scaleY(${progress})`;
          };
          ScrollTrigger.create({
            trigger: '.process',
            start: 'top bottom',
            end: 'bottom top',
            onRefresh: updateProcessProgress,
            onUpdate: updateProcessProgress,
          });
        }

        /* ---- footer watermark drift ---- */
        gsap.from('.footer-watermark', {
          yPercent: 36,
          ease: 'none',
          scrollTrigger: { trigger: '.footer-dark', start: 'top bottom', end: 'bottom bottom', scrub: 0.5 },
        });

        /* ---- horizontal sprint (desktop only) ---- */
        const mm = gsap.matchMedia();
        mm.add('(min-width: 920px)', () => {
          const track = document.querySelector<HTMLElement>('.sprint-track');
          const viewport = document.querySelector<HTMLElement>('.sprint-viewport');
          const progress = document.querySelector<HTMLElement>('.sprint-progress span');
          if (!track || !viewport) return;

          const getAmount = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

          gsap.to(track, {
            x: () => -getAmount(),
            ease: 'none',
            scrollTrigger: {
              trigger: '.sprint',
              start: 'top top',
              end: () => `+=${getAmount()}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progress) progress.style.transform = `scaleX(${self.progress})`;
              },
            },
          });
        });
      });
    };

    void setupAnimations();

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((split) => split.revert());
      if (raf) gsapRuntime?.ticker.remove(raf);
      lenis?.destroy();
      lenisInstance = null;
    };
  }, [page]);

  if (page === 'services') {
    return (
      <>
        <ServicesPage onBookIntro={openCalendar} onPageNavigate={navigateToPage} />
        <CalModal open={calendarOpen} onClose={closeCalendar} preload={calendarPreload} />
      </>
    );
  }

  if (page === 'about') {
    return (
      <>
        <AboutPage onBookIntro={openCalendar} onPageNavigate={navigateToPage} />
        <CalModal open={calendarOpen} onClose={closeCalendar} preload={calendarPreload} />
      </>
    );
  }

  return (
    <>
      <Nav onBookIntro={openCalendar} onPageNavigate={navigateToPage} />

      <main className="site-shell">
        <Hero onBookIntro={openCalendar} onHeroReady={preloadCalendar} />
        <Trusted />
        <Problem />
        <Sprint onBookIntro={openCalendar} />
        <Build />
        <Testimonial />
        <Process />
        <Faq />
      </main>

      <CtaFooter onBookIntro={openCalendar} onPageNavigate={navigateToPage} />
      <CalModal open={calendarOpen} onClose={closeCalendar} preload={calendarPreload} />
    </>
  );
}

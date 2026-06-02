import {
    ExperienceInput,
    ExperienceRecord,
    LegacyExperienceRecord,
} from "@/types/experience";

const isLegacy = (item: ExperienceInput): item is LegacyExperienceRecord =>
    "companyName" in item ||
    "timePeriod" in item ||
    "websiteLink" in item ||
    "desc" in item ||
    "i" in item;

export const normalizeExperience = (
    items?: ExperienceInput[]
): ExperienceRecord[] => {
    if (!items?.length) return [];

    return items
        .map((item, index): ExperienceRecord => {
            if (!isLegacy(item)) {
                return {
                    order: item.order ?? items.length - index,
                    role: item.role,
                    company: item.company,
                    location: item.location ?? "",
                    period: item.period,
                    websiteUrl: item.websiteUrl,
                    logoUrl: item.logoUrl ?? "",
                    logoAlt: item.logoAlt ?? item.company,
                    techStack: item.techStack ?? [],
                    highlights: item.highlights ?? [],
                };
            }

            const legacy = item as LegacyExperienceRecord;
            const company = legacy.company ?? legacy.companyName ?? "";
            return {
                order: legacy.order ?? legacy.i ?? items.length - index,
                role: legacy.role ?? legacy.title ?? "Software Engineer",
                company,
                location: legacy.location ?? "",
                period: legacy.period ?? legacy.timePeriod ?? "",
                websiteUrl: legacy.websiteUrl ?? legacy.websiteLink ?? "#",
                logoUrl: legacy.logoUrl ?? legacy.logo ?? "",
                logoAlt: legacy.logoAlt ?? legacy.alt ?? company,
                techStack: legacy.techStack ?? legacy.tech ?? [],
                highlights: legacy.highlights ?? legacy.desc ?? [],
            };
        })
        .sort((a, b) => b.order - a.order);
};

export const resolveExperience = (
    fromServer?: ExperienceInput[]
): ExperienceRecord[] => {
    const normalized = normalizeExperience(fromServer);
    return normalized.length ? normalized : FALLBACK_EXPERIENCE;
};

export const isCurrentRole = (exp: ExperienceRecord): boolean =>
    /present/i.test(exp.period);

export const FALLBACK_EXPERIENCE: ExperienceRecord[] = [
    {
        order: 3,
        role: "Software Engineer II",
        company: "Dream11",
        location: "Mumbai, India",
        period: "March 2025 — Present",
        websiteUrl: "https://www.dream11.com",
        logoUrl: "",
        logoAlt: "Dream11",
        techStack: ["React Native", "Expo", "GraphQL", "WebSockets", "Tailcall"],
        highlights: [
            "Architected Dream11's React Native migration to Expo and Expo Modules, enabling faster feature delivery, scalable native integrations, and seamless performance for <strong>10M+ daily active users</strong> and <strong>4M+ peak concurrent users</strong> during IPL.",
            "Engineered AI-powered fantasy gameplay features including AI Team Generation and Guru Team, driving <strong>267K+ unique users</strong> to save an AI team and <strong>23% adoption</strong> among contest-joining users.",
            "Led end-to-end implementation of core features of the Manager Mode Fantasy Platform, enabling a season-long multi-format fantasy platform with dynamic team creation rules across sports and formats, powering <strong>2M user joins</strong> in peak matches.",
            "Engineered real-time multiplayer matchmaking systems for DreamPlay in React Native with WebSocket-based real-time pairing and contest join, unlocking seamless head-to-head gameplay for <strong>60K+ concurrent users</strong>.",
            "Built a GraphQL BFF layer to streamline data access using Tailcall for contest, home, and winnings views, improving frontend integration and reducing API complexity.",
        ],
    },
    {
        order: 2,
        role: "Software Engineer II",
        company: "Times Internet · ET Money",
        location: "Gurugram, India",
        period: "April 2022 — Feb 2025",
        websiteUrl: "https://www.etmoney.com",
        logoUrl: "",
        logoAlt: "ET Money",
        techStack: ["Next.js", "Module Federation", "Vite", "TypeScript", "Sentry"],
        highlights: [
            "Architected micro-frontend platform bridging a legacy JSP frontend with modern Next.js apps via proxy and Module Federation, building cross-platform stock modules powering <strong>80K+ daily active users</strong> tracking real-time stock prices.",
            "Implemented real-time stock price visualization with WebSocket updates and CDN cache-tag invalidation for stale-while-revalidate, improving page load and SEO performance by <strong>34%</strong>.",
            "Designed and built key monetization flows including Genius Subscription, Mutual Fund Purchase &amp; Redemption for web using ReactJS with Vite, and spearheaded the Genius Free Trial feature, driving <strong>20k+ new user acquisitions</strong>.",
            "Optimized the legacy build pipeline by implementing Gulp-based minification and parallelized gradle tasks, achieving a <strong>68% reduction</strong> in build time (CI cut from ~14 to ~6 min).",
            "Migrated React codebase to TypeScript and rolled out Sentry for performance and error monitoring, reducing the production error rate from <strong>10% to 3%</strong> and improving LCP from <strong>3.6s to 2.1s</strong>.",
        ],
    },
];

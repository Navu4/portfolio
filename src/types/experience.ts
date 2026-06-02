/**
 * Experience timeline contract for `props.work` / MongoDB `work` collection.
 *
 * Recommended document shape (one doc per role, sorted by `order` desc):
 * {
 *   order: 3,
 *   role: "Software Engineer II",
 *   company: "Dream11",
 *   location: "Mumbai, India",
 *   period: "March 2025 — Present",
 *   websiteUrl: "https://www.dream11.com",
 *   logoUrl: "",
 *   logoAlt: "Dream11",
 *   techStack: ["React Native", "Expo", "GraphQL"],
 *   highlights: ["Bullet with optional <strong>metrics</strong>"]
 * }
 */
export interface ExperienceRecord {
    order: number;
    role: string;
    company: string;
    location: string;
    period: string;
    websiteUrl: string;
    logoUrl?: string;
    logoAlt?: string;
    techStack?: string[];
    highlights: string[];
}

/** @deprecated Legacy Mongo / older API field names — normalized at runtime */
export interface LegacyExperienceRecord {
    i?: number;
    order?: number;
    title?: string;
    role?: string;
    companyName?: string;
    company?: string;
    location?: string;
    timePeriod?: string;
    period?: string;
    websiteLink?: string;
    websiteUrl?: string;
    logo?: string;
    logoUrl?: string;
    alt?: string;
    logoAlt?: string;
    tech?: string[];
    techStack?: string[];
    desc?: string[];
    highlights?: string[];
}

export type ExperienceInput = ExperienceRecord | LegacyExperienceRecord;

/** Site-wide constants. Kept in one place so links can't drift between components. */

export const RESUME_HREF = "/ethan-suttor-resume.pdf";

export const SITE_URL = "https://ethansuttor.com";

export const GITHUB_URL = "https://github.com/Ethansuttor";
export const LINKEDIN_URL = "https://linkedin.com/in/ethan-suttor";

/** Shown on the site and in structured data. */
export const EMAIL = "ethan.suttor@louisville.edu";

/** Where the contact form delivers. Never rendered — EMAIL is the public one. */
export const CONTACT_INBOX = "ethan.suttor@gmail.com";

/** Link text for LINKEDIN_URL, derived so the two can't disagree. */
export const LINKEDIN_LABEL = LINKEDIN_URL.replace(/^https?:\/\//, "");

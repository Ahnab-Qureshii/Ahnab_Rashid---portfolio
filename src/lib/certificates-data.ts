/**
 * Certificates — one unified, honest record of the real certificates
 * Ahnab has earned (internship + webinars). Every entry is rendered
 * from the actual certificate file shipped in
 * /public/images/certificates/ — the image itself is the source of
 * truth and is never edited, recolored, cropped or redesigned. Text
 * fields below carry ONLY information that is clearly printed on the
 * certificate; anything not printed on it stays out (leave the field
 * undefined rather than invent it).
 *
 * Every entry below was transcribed directly from the corresponding
 * certificate file shipped in /public/images/certificates/ — the image
 * is the source of truth; no field was invented or embellished.
 *
 * File format note (performance pass): each certificate ships as a
 * visually identical WebP encoding (SSIM ≥ 0.995 vs the original
 * upload, same pixel dimensions, no crop/recolor — verified in the
 * perf-opt-1 worklog). The original .jpg uploads are archived
 * untouched in /assets-source/certificates-original-jpg/.
 */

export type CertificateType = "INTERNSHIP" | "WEBINAR";

export type Certificate = {
  /** stable id for keys / aria wiring */
  id: string;
  /** identification label only — never used as a filter or tab */
  type: CertificateType;
  /** certificate title, exactly as printed on the certificate */
  title?: string;
  /** issuing organisation, exactly as printed on the certificate */
  org?: string;
  /** date exactly as printed on the certificate */
  date?: string;
  /** file served from /public (WebP encoding of the original upload) */
  src: string;
  /** intrinsic pixel size — prevents layout shift, keeps aspect ratio */
  width: number;
  height: number;
  /** meaningful alt text for screen readers */
  alt: string;
};

export const CERTIFICATES: Certificate[] = [
  {
    id: "cert-sibrs-internship",
    type: "INTERNSHIP",
    title: "Internship Certificate",
    org: "SIBRS Technology",
    date: "21st July – 21st September, 2026",
    src: "/images/certificates/certificate-1.webp",
    width: 953,
    height: 696,
    alt: "SIBRS Technology internship certificate presented to Ahnab Rashid for successfully completing the two months internship program with practical exposure and hands-on learning in Python Programming, Web Development, and AI Automation, conducted from 21st July to 21st September, 2026",
  },
  {
    id: "cert-sibrs-letter",
    type: "INTERNSHIP",
    title: "Internship Letter",
    org: "SIBRS — Social Information & Business Research Services",
    date: "September 21, 2026",
    src: "/images/certificates/certificate-2.webp",
    width: 941,
    height: 1267,
    alt: "SIBRS internship letter certifying that Ms. Ahnab Rashid successfully completed her internship at SIBRS Technology in the Artificial Intelligence and AI Automation domain, with additional exposure to Web Development",
  },
  {
    id: "cert-youtechelon-webinar",
    type: "WEBINAR",
    title: "The Power of Mentorship in Leadership Development",
    org: "YouthEchelon",
    date: "January 4th, 2025",
    src: "/images/certificates/certificate-3.webp",
    width: 1064,
    height: 767,
    alt: "Certificate of Participation awarded to Ms. Ahnab Rashid for successfully participating in the webinar titled The Power of Mentorship in Leadership Development, held on January 4th, 2025, organized by YouthEchelon",
  },
];

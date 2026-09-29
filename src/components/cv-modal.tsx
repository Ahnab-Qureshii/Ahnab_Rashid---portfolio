"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Download, FileText, X } from "lucide-react";
import { PROFILE, PROJECTS } from "@/lib/profile";

/**
 * Interactive CV — a professional in-site preview rendered inside a
 * modal, plus a direct "Download PDF" action for the CV document that
 * ships with the portfolio (public/Ahnab-Rashid-CV.pdf).
 *
 * Every line of the preview comes from the same CV data the whole site
 * is built on (src/lib/profile.ts) — nothing is invented or modified
 * here. The modal is built on Radix Dialog, so focus trapping, Escape
 * and screen-reader roles come for free; the styling is the site's own
 * dark glass language with a light "paper" document inside.
 */

export const CV_PDF_PATH = "/Ahnab-Rashid-CV.pdf";
export const CV_PDF_NAME = "Ahnab-Rashid-CV.pdf";

const LINKEDIN_SHORT = PROFILE.linkedin.replace(/^https?:\/\/(www\.)?/, "");
const GITHUB_SHORT = PROFILE.github.replace(/^https?:\/\/(www\.)?/, "");

const EDUCATION = [
  {
    title: "BS Computer Science",
    meta: "Abbottabad University of Science and Technology (AUST) · 2024 – Present",
    detail:
      "Currently in the 6th semester with a 3.76 GPA, focusing coursework and self-study around Artificial Intelligence and backend development.",
  },
  {
    title: "Intermediate (Computer Science)",
    meta: "Girls Degree College, Havelian · 2023",
    detail: "Completed with 572 / 1100 marks.",
  },
  {
    title: "Matric (Science)",
    meta: "New Century Secondary Public School, Havelian · 2021",
    detail: "Completed with 630 / 1100 marks.",
  },
];

const INTERNSHIP_BULLETS = [
  "Trained in Python and OOP, then contributed Phase 6 (Classroom Management) of SJARVIS EDU — an independent FastAPI backend with SQLAlchemy and SQLite, checked by an automated test suite.",
  "Introduced to Git, GitHub and n8n workflow automation, and delivered several technical presentations.",
];

type CvModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CvModal({ open, onOpenChange }: CvModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cv-overlay" />
        <Dialog.Content
          className="cv-content"
          aria-describedby={undefined}
          aria-label="Curriculum Vitae preview"
        >
          {/* ---------- toolbar ---------- */}
          <div className="cv-toolbar">
            <div className="cv-toolbar-title">
              <span className="cv-toolbar-tile" aria-hidden>
                <FileText className="cv-toolbar-ic" />
              </span>
              <div>
                <Dialog.Title className="cv-title">Curriculum Vitae</Dialog.Title>
                <p className="cv-subtitle">
                  {PROFILE.fullName} · Computer Science Student
                </p>
              </div>
            </div>
            <div className="cv-toolbar-actions">
              <a
                className="cv-download"
                href={CV_PDF_PATH}
                download={CV_PDF_NAME}
              >
                <Download className="size-4" aria-hidden />
                Download PDF
              </a>
              <Dialog.Close
                className="cv-close"
                aria-label="Close the CV preview"
              >
                <X className="size-[18px]" aria-hidden />
              </Dialog.Close>
            </div>
          </div>

          {/* ---------- scrollable CV paper ---------- */}
          <div className="cv-scroll">
            <article className="cv-paper" lang="en">
              <header>
                <h3 className="cvp-name">{PROFILE.fullName}</h3>
                <p className="cvp-role">
                  Computer Science Student · AI · Python · Backend
                </p>
                <p className="cvp-contact">
                  {PROFILE.email} · {LINKEDIN_SHORT} · {GITHUB_SHORT} ·{" "}
                  {PROFILE.location}
                </p>
              </header>

              <section className="cvp-sec">
                <h4 className="cvp-sec-title">Profile</h4>
                <p className="cvp-entry-desc">
                  Computer Science student at Abbottabad University of Science
                  and Technology (6th semester, 3.76 GPA), exploring Artificial
                  Intelligence, technology and meaningful digital solutions.
                </p>
              </section>

              <section className="cvp-sec">
                <h4 className="cvp-sec-title">Education</h4>
                {EDUCATION.map((item) => (
                  <div key={item.title} className="cvp-entry">
                    <p className="cvp-entry-title">{item.title}</p>
                    <p className="cvp-entry-meta">{item.meta}</p>
                    <p className="cvp-entry-desc">{item.detail}</p>
                  </div>
                ))}
              </section>

              <section className="cvp-sec">
                <h4 className="cvp-sec-title">Experience</h4>
                <div className="cvp-entry">
                  <p className="cvp-entry-title">AI &amp; Python Internship</p>
                  <p className="cvp-entry-meta">
                    SIBRS Technology · SJARVIS EDU — Phase 6
                  </p>
                  {INTERNSHIP_BULLETS.map((line) => (
                    <p key={line.slice(0, 24)} className="cvp-bullet">
                      {line}
                    </p>
                  ))}
                </div>
              </section>

              <section className="cvp-sec">
                <h4 className="cvp-sec-title">Projects</h4>
                {PROJECTS.map((project) => (
                  <div key={project.title} className="cvp-entry">
                    <p className="cvp-entry-title">{project.title}</p>
                    <p className="cvp-entry-meta">
                      {project.context} · Tech: {project.tech.join(", ")}
                    </p>
                    <p className="cvp-entry-desc">{project.description}</p>
                  </div>
                ))}
              </section>

              <section className="cvp-sec">
                <h4 className="cvp-sec-title">Skills</h4>
                <p className="cvp-line">
                  <strong>AI &amp; Automation:</strong> Artificial Intelligence,
                  AI Chatbots, AI Agents, Automation
                </p>
                <p className="cvp-line">
                  <strong>Programming &amp; Tools:</strong> Python, FastAPI,
                  SQLAlchemy, SQLite, n8n Workflow Automation, Git &amp; GitHub,
                  SQL (basic), VS Code
                </p>
                <p className="cvp-line">
                  <strong>Design &amp; Productivity:</strong> MS Office, Canva,
                  Figma (basic)
                </p>
                <p className="cvp-line">
                  <strong>Soft skills:</strong> Effective Communication, Problem
                  Solving, Critical Thinking, Teamwork, Leadership, Time
                  Management, Quick Learner
                </p>
                <p className="cvp-line">
                  <strong>Languages:</strong> Urdu (native), Hindko (native),
                  English
                </p>
              </section>
            </article>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

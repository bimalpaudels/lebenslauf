"use client";

import React, { useMemo } from "react";
import { MarkdownRenderer, type ThemeConfig } from "@/components/MarkdownRenderer";
import { parseFrontmatter } from "@/lib/markdown";

export type Theme = ThemeConfig;

export default function Template({
  markdown,
  theme,
}: {
  markdown: string;
  theme: Theme;
}) {
  const { frontmatter, content } = useMemo(
    () => parseFrontmatter(markdown || ""),
    [markdown]
  );

  return (
    <div
      className="bg-white text-slate-800"
      style={{
        padding: `${theme.pagePadding}px`,
        fontSize: `${theme.fontSize}px`,
        lineHeight: theme.lineHeight,
      }}
    >
      {/* Header from frontmatter */}
      {(frontmatter as any)?.name && (
        <div className="border-b pb-3 mb-4">
          <div className="cv-header">
            <h1
              className="font-extrabold tracking-tight"
              style={{
                color: theme.color,
                margin: 0,
                fontSize: theme.fontSize * 2,
              }}
            >
              {String((frontmatter as any).name)}
            </h1>
            {Array.isArray((frontmatter as any).header) && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[0.95em] text-slate-600">
                {(frontmatter as any).header.map((item: any, idx: number) => (
                  <MarkdownRenderer
                    key={idx}
                    content={String(item.text || "")}
                    theme={theme}
                    className="header-item"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Markdown content rendered with Tailwind-styled components */}
      <MarkdownRenderer content={content} theme={theme} />
    </div>
  );
}

export const templateMeta = {
  id: "modern-onepage",
  name: "Modern One-Page",
  description: "Clean one-page CV with styled header and sections",
};

export const sampleMarkdown = `---
name: Dr. Emily Rodriguez
header:
  - text: |
      <span style="font-size: 1.1em; font-weight: 600; color: #374151;">Registered Nurse, BSN</span>
  - text: 📧 emily.rodriguez@healthcare.com | 📱 (555) 123-4567
  - text: 🌐 linkedin.com/in/emilyrodriguez | 📍 San Diego, CA
---

## Professional Summary

Compassionate and dedicated Registered Nurse with 5+ years of experience in acute care, emergency medicine, and patient advocacy. Proven ability to provide high-quality patient care in fast-paced environments while maintaining strong communication with healthcare teams and families. Specialized in critical care, patient education, and evidence-based practice.

## Professional Experience

**Registered Nurse, ICU** <span class="company">UC San Diego Medical Center</span>  
<span class="job-date">March 2022 - Present</span>

• Manage care for 2-3 critically ill patients simultaneously, ensuring optimal outcomes and patient safety
• Administer complex medications, monitor vital signs, and respond to rapid response situations
• Collaborate with interdisciplinary teams to develop and implement patient care plans
• Precept new nurses and nursing students, providing mentorship and clinical guidance
• Achieved 98% patient satisfaction score and zero medication errors in 2023

**Registered Nurse, Emergency Department** <span class="company">Scripps Memorial Hospital</span>  
<span class="job-date">June 2020 - February 2022</span>

• Treated 15-20 patients per shift in high-volume emergency department
• Performed triage assessments, administered emergency medications, and assisted with procedures
• Coordinated with physicians, specialists, and support staff for optimal patient outcomes

**Nursing Assistant** <span class="company">Kaiser Permanente</span>  
<span class="job-date">May 2019 - May 2020</span>

• Assisted RNs with patient care, vital signs monitoring, and daily living activities
• Provided emotional support to patients and families during challenging situations
• Maintained clean and safe patient environment following infection control protocols
• Supported nursing staff with administrative tasks and patient documentation

## Education & Certifications

**Bachelor of Science in Nursing** <span class="location-date">San Diego State University<br>2015 - 2019</span>  
_Magna Cum Laude, GPA: 3.8/4.0_

**Certifications:** <span class="highlight">ACLS</span>, <span class="highlight">BLS</span>, <span class="highlight">PALS</span>, <span class="highlight">CCRN</span>

## Clinical Skills

**Patient Care:** <span class="highlight">Critical Care</span>, <span class="highlight">Emergency Medicine</span>, <span class="highlight">Patient Assessment</span>, <span class="highlight">Medication Administration</span>

**Technical Skills:** <span class="highlight">Ventilator Management</span>, <span class="highlight">IV Therapy</span>, <span class="highlight">ECG Interpretation</span>, <span class="highlight">Central Line Care</span>

**Soft Skills:** <span class="highlight">Patient Advocacy</span>, <span class="highlight">Family Communication</span>, <span class="highlight">Team Collaboration</span>, <span class="highlight">Crisis Management</span>

## Professional Development

**Continuing Education Units (CEUs):** 45+ hours annually in critical care, emergency medicine, and patient safety

**Professional Memberships:** American Association of Critical-Care Nurses (AACN), Emergency Nurses Association (ENA)

**Languages:** English (Native), Spanish (Fluent)
`;

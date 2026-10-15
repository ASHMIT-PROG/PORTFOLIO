export type Experience = {
  id: string;
  title: string;
  organization: string;
  type: string;
  period: string;
  location: string;
  description: string;
  skills: string[];
  icon: "work" | "education";
};

export const experience: Experience[] = [
  {
    id: "iiita-intern",
    title: "Summer Intern",
    organization: "Indian Institute Of Information Technology Allahabad",
    type: "Internship",
    period: "Jun 2026 – Jul 2026 · 2 mos",
    location: "India · Remote",
    description:
      "(DELTA program) Summer Internship and Training program on Deep Learning. Built a Night-to-Day Image Translation model using Pix2Pix GAN.",
    skills: ["Deep Learning"],
    icon: "work",
  },
  {
    id: "isl-intern",
    title: "Summer Intern",
    organization: "India Space Lab (ISL)",
    type: "Internship",
    period: "Jun 2026 – Present · 5 mos",
    location: "Chennai, Tamil Nadu, India · Remote",
    description:
      "Honored to be selected for the India Space Lab Summer Internship & Technical Training Program 2026. This internship marks another step in my journey toward building intelligent aerospace and defense systems.",
    skills: ["Deep Learning", "Drone Technology", "Computer Vision", "Python", "Research"],
    icon: "work",
  },
];


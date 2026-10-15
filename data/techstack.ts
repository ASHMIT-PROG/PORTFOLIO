export const techCategories = ["All", "Languages", "Backend", "AI & ML"] as const;
export type TechCategory = (typeof techCategories)[number];
export const techstack: { name: string; icon: string; category: Exclude<TechCategory, "All"> }[] = [
  { name: "Python", icon: "python", category: "Languages" },
  { name: "Java", icon: "java", category: "Languages" },
  { name: "FastAPI", icon: "fastapi", category: "Backend" },
  { name: "Node.js", icon: "node", category: "Backend" },
  { name: "PyTorch", icon: "pytorch", category: "AI & ML" },
  { name: "TensorFlow", icon: "tensorflow", category: "AI & ML" },
];

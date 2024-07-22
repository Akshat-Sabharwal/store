export const logo = "store";

export const sidebar = [
  { name: "recents", link: "/dashboard/", isActive: false },
  { name: "history", link: "/dashboard/history", isActive: false },
  { name: "settings", link: "/settings", isActive: false },
];

export const tabs = ["storage", "account"];

export const fileTypes = [
  { type: "images", size: 0, color: "hsl(180, 60%, 95%)" },
  { type: "document", size: 0, color: "hsl(180, 40%, 85%)" },
  { type: "media", size: 0, color: "hsl(180, 35%, 80%)" },
  { type: "others", size: 0, color: "hsl(180, 30%, 75%)" },
];

export const allowedFileTypes = [
  ".pdf",
  ".json",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".cpp",
  ".txt",
  ".jpg",
  ".png",
];

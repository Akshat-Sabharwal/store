export const getLang = (type: string) => {
  switch (type) {
    case "css":
      return "css";

    case "js":
    case "jsx":
      return "javascript";

    case "ts":
    case "tsx":
      return "typescript";

    case "py":
      return "python";

    case "cpp":
      return "cpp";

    case "c":
      return "c";

    case "csharp":
      return "csharp";

    case "java":
      return "java";

    case "go":
      return "golang";

    case "bash":
    case "sh":
      return "bash";

    case "dockerfile":
      return "dockerfile";

    case "ruby":
      return "ruby";

    case "sql":
      return "sql";
  }
};

export const wait = (ms: number, cb: any) => {
  setTimeout(async () => {
    await cb();
  }, ms);
};

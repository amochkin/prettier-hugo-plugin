const recommended = {
  plugins: ["prettier-hugo-plugin"],
  // Optional plugin option:
  goTemplateBracketSpacing: true,
  // Map typical Hugo template extensions to the GoTemplate parser
  overrides: [
    {
      files: [
        "**/*.html",
      ],
      options: { parser: "go-template" },
    },
  ],
}

export { recommended };
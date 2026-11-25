export default {
  extends: ["@commitlint/config-conventional"],
  ignores: [
    (commitMessage) => commitMessage.startsWith("chore: version packages"),
  ],
};

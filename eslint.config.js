import { defineRootConfig } from "@sgx4u/eslint-config";

export default [
    ...defineRootConfig(),
    {
        files: [
            "scripts/publish-packages.mjs",
            "scripts/publish-beta-snapshot.mjs",
        ],
        rules: {
            // These scripts are `node scripts/...` from release.yml. They are
            // not turbo tasks, so their variables stay out of
            // globalPassThroughEnv. Putting them there would hand the values
            // to every task without affecting the cache.
            "turbo/no-undeclared-env-vars": [
                "error",
                {
                    allowList: ["^GITHUB_REF_NAME$", "^CHANGESET_PACK_DIR$"],
                },
            ],
        },
    },
];

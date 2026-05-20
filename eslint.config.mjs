import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = [
  ...nextConfig,
  prettierConfig,
  {
    rules: {
      // Reading localStorage on mount and syncing to state via useEffect is the
      // correct pattern to avoid SSR/client hydration mismatches in Next.js.
      // react-hooks v7 flags this too aggressively.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;

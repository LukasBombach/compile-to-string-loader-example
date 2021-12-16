import { compileToString } from "../lib/compile-to-string";

import type { NextPage } from "next";

const source = compileToString("../inline/index.ts");

const Home: NextPage = () => {
  return <pre>{source}</pre>;
};

export default Home;

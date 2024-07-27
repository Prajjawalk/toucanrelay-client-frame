import { createFrames } from "frames.js/next";

type State = {
  account: string;
  ipfsHash: string;
  relay: boolean;
};

export const frames = createFrames<State>({
  basePath: "/frames",
  initialState: {
    account: "",
    ipfsHash: "",
    relay: false,
  },
});

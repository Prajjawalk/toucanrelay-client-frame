/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  const currentState = ctx.state;

  // Update the state
  const updatedState = {
    ...currentState,
    ipfsHash: ctx.message?.inputText ? ctx.message.inputText : "",
  };

  return {
    image: (
      <div tw="w-full h-full bg-slate-700 text-white text-md justify-center items-center flex flex-col">
        <div>Review Details:</div>
        <div tw="flex">Address: {ctx.state.account}</div>
        <div tw="flex">IPFS Hash: {updatedState.ipfsHash}</div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/ipfs">
        Back
      </Button>,
      <Button action="post" target="/relay">
        Confirm
      </Button>,
    ],
    state: updatedState,
  };
});

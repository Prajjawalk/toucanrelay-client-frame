/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  const currentState = ctx.state;

  // Update the state
  const updatedState = {
    ...currentState,
    account: ctx.message?.inputText ? ctx.message.inputText : "",
  };

  return {
    image: <div tw="flex">Enter IPFS hash</div>,
    buttons: [
      <Button action="post" target="/to">
        Back
      </Button>,
      <Button action="post" target="/confirm">
        Next
      </Button>,
    ],
    textInput: "Qm...",
    state: updatedState,
  };
});

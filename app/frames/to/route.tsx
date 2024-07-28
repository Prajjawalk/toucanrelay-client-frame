/* eslint-disable react/jsx-key */
import { frames } from "../frames";
import { Button } from "frames.js/next";

export const POST = frames(async (ctx) => {
  return {
    image: (
      <div tw="w-full h-full bg-slate-700 text-white text-md flex justify-center items-center">
        Enter receiver's address
      </div>
    ),
    buttons: [
      <Button action="post" target="/">
        Back
      </Button>,
      <Button action="post" target="/ipfs">
        Next
      </Button>,
    ],
    textInput: "0x...",
  };
});

/* eslint-disable react/jsx-key */
import { frames } from "./frames";
import { Button } from "frames.js/next";

const handler = frames(async () => {
  return {
    image: (
      <div tw="w-full h-full bg-slate-700 text-white text-md flex justify-center items-center">
        <div>Welcome to Toucanrelay</div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/to">
        Start
      </Button>,
      <Button
        action="link"
        target="https://steadfast-sled-5ba.notion.site/ToucanRelay-Bot-Docs-f26c7736b85d4eaaa7aea5ceb67cf988"
      >
        Docs
      </Button>,
    ],
  };
});

export const GET = handler;
export const POST = handler;

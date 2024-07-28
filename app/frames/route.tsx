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
      // With query params
      // <Button
      //   action="post"
      //   target={{ pathname: "/route1", query: { foo: "bar" } }}
      // >
      //   Go to route 1
      // </Button>,
      <Button action="post" target="/to">
        Start
      </Button>,
    ],
  };
});

export const GET = handler;
export const POST = handler;

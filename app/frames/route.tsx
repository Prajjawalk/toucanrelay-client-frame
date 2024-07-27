/* eslint-disable react/jsx-key */
import { frames } from "./frames";
import { Button } from "frames.js/next";

const handler = frames(async () => {
  return {
    image: <div tw="flex">Welcome to Toucanrelay</div>,
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

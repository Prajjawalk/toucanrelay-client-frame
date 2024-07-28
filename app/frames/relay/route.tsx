/* eslint-disable react/jsx-key */
import { kv } from "@vercel/kv";
import { types } from "frames.js/core";
import { Button } from "frames.js/next";
import { RelayRequestStateValue } from "../../slow-fetch/types";
import { frames } from "../frames";

export const POST = frames(async (ctx) => {
  const currentState = ctx.state;

  // Update the state
  const updatedState = {
    ...currentState,
    relay: true,
  };

  const initialFrame = {
    image: (
      <div tw="w-full h-full bg-slate-700 text-white text-md flex justify-center items-center">
        Click to Relay transaction
      </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: "/relay" }} key="1">
        Relay
      </Button>,
    ],
    state: updatedState,
  } satisfies types.FrameDefinition<any>;

  const checkStatusFrame = {
    image: (
      <div tw="w-full h-full bg-slate-700 text-white text-md flex justify-center items-center">
        Loading...
      </div>
    ),
    buttons: [
      <Button action="post" target={{ pathname: "/relay" }} key="1">
        Check status
      </Button>,
    ],
    state: updatedState,
  } satisfies types.FrameDefinition<any>;

  if (!ctx.state.relay) {
    return initialFrame;
  }

  const requesterFid = ctx.message?.requesterFid;
  const uniqueId = `fid:${requesterFid}`;

  const existingRequest = await kv.get<RelayRequestStateValue>(uniqueId);

  if (existingRequest) {
    switch (existingRequest.status) {
      case "pending":
        return checkStatusFrame;
      case "success": {
        if (ctx.url.searchParams.get("reset") === "true") {
          // reset to initial state
          await kv.del(uniqueId);
        }

        return {
          image: (
            <div tw="w-full h-full bg-slate-700 text-white text-md flex justify-center items-center">
              Transaction Successful!
            </div>
          ),
          buttons: [
            <Button
              action="post"
              key="1"
              target={{ pathname: "/", query: { reset: true } }}
            >
              Reset
            </Button>,
            <Button
              action="link"
              target={`https://sepolia.arbiscan.io/tx/${existingRequest.data}`}
            >
              Check Txn
            </Button>,
          ],
          state: updatedState,
        } satisfies types.FrameDefinition<any>;
      }
      case "error": {
        if (ctx.url.searchParams.get("retry") === "true") {
          // reset to initial state
          await kv.del(uniqueId);

          return initialFrame;
        } else {
          return {
            image: <span>{existingRequest.error}</span>,
            buttons: [
              <Button
                action="post"
                key="1"
                target={{ pathname: "/", query: { retry: true } }}
              >
                Retry
              </Button>,
            ],
            state: updatedState,
          } satisfies types.FrameDefinition<any>;
        }
      }
    }
  } else {
    await kv.set<RelayRequestStateValue>(
      uniqueId,
      {
        status: "pending",
        timestamp: new Date().getTime(),
      },
      // set as pending for one minute
      { ex: 60 }
    );

    // start request, don't await it! Return a loading page, let this run in the background
    fetch(new URL("/slow-fetch", process.env.NEXT_PUBLIC_HOST).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await ctx.request.clone().json()),
    });
  }

  return initialFrame;
});

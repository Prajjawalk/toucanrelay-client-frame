import { getFrameMessage } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { RelayRequestStateValue } from "./types";
import { DEFAULT_DEBUGGER_HUB_URL } from "../debug";

const MAXIMUM_KV_RESULT_LIFETIME_IN_SECONDS = 2 * 60; // 2 minutes

export async function POST(req: NextRequest) {
  const body = await req.json();

  // verify independently
  const frameMessage = await getFrameMessage(body, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  const uniqueId = `fid:${frameMessage.requesterFid}`;

  try {
    const inputValues = JSON.parse(body.untrustedData.state);
    const ipfsHash = inputValues.ipfsHash;
    const receiverAddress = inputValues.account;
    console.log("hitting ", `https://ipfs.io/ipfs/${ipfsHash}`);
    const resp = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`, {
      method: "GET",
    });

    const proofData = await resp.json();
    console.log(proofData);
    proofData["receiverAddress"] = receiverAddress;
    console.log(
      "hitting ",
      `${process.env.TOUCAN_RELAY_SERVER}/api/discordbot`
    );
    const txResp = await fetch(
      `${process.env.TOUCAN_RELAY_SERVER}/api/discordbot`,
      {
        method: "POST",
        body: JSON.stringify(proofData),
      }
    );

    const txData = await txResp.json();
    console.log(txData);

    await kv.set<RelayRequestStateValue>(
      uniqueId,
      {
        data: txData.transaction,
        status: "success",
        timestamp: new Date().getTime(),
      },
      { ex: MAXIMUM_KV_RESULT_LIFETIME_IN_SECONDS }
    );

    return NextResponse.json({
      data: txData.transaction,
      status: "success",
      timestamp: new Date().getTime(),
    });
  } catch (e) {
    await kv.set<RelayRequestStateValue>(
      uniqueId,
      {
        error: String(e),
        status: "error",
        timestamp: new Date().getTime(),
      },
      { ex: MAXIMUM_KV_RESULT_LIFETIME_IN_SECONDS }
    );
    // Handle errors
    return NextResponse.json({ message: e }, { status: 500 });
  }
}

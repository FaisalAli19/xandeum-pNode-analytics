import axios from "axios";

export interface ProgramAccount {
  account: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: string | string[] | { parsed?: any; program?: string };
    executable: boolean;
    lamports: number;
    owner: string;
    rentEpoch?: number;
  };
  pubkey: string;
}

export interface GetProgramAccountsResponse {
  jsonrpc: string;
  result?: ProgramAccount[];
  error?: {
    code: number;
    message: string;
  };
  id: number;
}

/**
 * Fetches all pNode program accounts from the Xandeum RPC endpoint
 * Tries jsonParsed first, falls back to base64 if needed
 */
export const fetchProgramAccounts = async (
  useJsonParsed = true
): Promise<ProgramAccount[]> => {
  console.log(
    `🔄 Fetching pNodes from RPC (encoding: ${
      useJsonParsed ? "jsonParsed" : "base64"
    })...`
  );

  try {
    const response = await axios.post<GetProgramAccountsResponse>(
      `https://173.212.203.145:6000/rpc`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "get-pods",
        // params: [
        //   PROGRAM_ID,
        //   {
        //     encoding: useJsonParsed ? 'jsonParsed' : 'base64',
        //     commitment: 'confirmed',
        //     filters: [
        //       { dataSize: 1040 }, // Only pNode-sized accounts
        //     ],
        //   },
        // ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 3000000, // 30 second timeout
      }
    );

    if (response.data.error) {
      // If jsonParsed fails, try base64
      if (useJsonParsed && response.data.error.message?.includes("parse")) {
        console.warn(
          "⚠️ jsonParsed encoding failed, falling back to base64..."
        );
        return fetchProgramAccounts(false);
      }
      throw new Error(
        `RPC Error: ${response.data.error.message || "Unknown error"}`
      );
    }

    if (!response.data.result || !Array.isArray(response.data.result)) {
      throw new Error("Invalid response format: result is not an array");
    }

    // Check if jsonParsed actually parsed the data
    if (useJsonParsed && response.data.result.length > 0) {
      const firstAccount = response.data.result[0];
      const hasParsedData =
        firstAccount.account.data &&
        typeof firstAccount.account.data === "object" &&
        "parsed" in firstAccount.account.data;

      if (!hasParsedData) {
        console.warn(
          "⚠️ jsonParsed encoding returned unparsed data, falling back to base64..."
        );
        return fetchProgramAccounts(false);
      }

      // Log the structure of parsed data for debugging
      if (
        firstAccount.account.data &&
        typeof firstAccount.account.data === "object" &&
        "parsed" in firstAccount.account.data
      ) {
        console.log(
          "📊 Sample parsed data structure:",
          JSON.stringify(firstAccount.account.data.parsed, null, 2)
        );
      }
    }

    console.log(`✅ Fetched ${response.data.result.length} pNodes from RPC`);
    return response.data.result;
  } catch (error) {
    // If jsonParsed fails, try base64
    if (useJsonParsed && axios.isAxiosError(error)) {
      console.warn("⚠️ jsonParsed encoding failed, falling back to base64...");
      return fetchProgramAccounts(false);
    }

    console.error("❌ Error fetching program accounts:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `API Error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Network Error: No response from server");
      }
    }
    throw error;
  }
};

import { struct, u8, f32, u64, str } from '@coral-xyz/borsh';
import BN from 'bn.js';
import { Buffer } from 'buffer';
import type { ProgramAccount } from './pnodesApiService';

/**
 * ============================================================================
 * IMPORTANT: SCHEMA CONFIGURATION REQUIRED
 * ============================================================================
 *
 * The Borsh schema below is a TEMPLATE and likely doesn't match your actual
 * pNode program structure. You MUST update it to match your Rust program.
 *
 * To determine the correct schema:
 *
 * 1. Check your Rust pNode program struct definition
 * 2. Match the EXACT field order (Borsh is order-dependent)
 * 3. Match the EXACT field types:
 *    - u8, u16, u32, u64 → use u8(), u16(), u32(), u64()
 *    - i8, i16, i32, i64 → use i8(), i16(), i32(), i64()
 *    - f32, f64 → use f32(), f64()
 *    - String → use str()
 *    - Vec<T> → use vec(layout)
 *    - Option<T> → use option(layout)
 *    - bool → use bool()
 *    - PublicKey → use publicKey()
 *
 * 4. Check if your program uses a discriminator (usually 8 bytes at the start)
 * 5. Use the inspectPNodeBuffer() function in browser console to inspect raw data
 *
 * Example Rust struct:
 *   pub struct PNode {
 *       pub identity: String,        // → str('identity')
 *       pub status: u8,              // → u8('status')
 *       pub uptime: f32,             // → f32('uptime')
 *       ...
 *   }
 *
 * ============================================================================
 */

/**
 * Raw decoded pNode data structure
 * NOTE: This schema needs to match the actual pNode program structure
 * Adjust field names, types, and order based on your program's layout
 */
export interface RawPNodeData {
  // Adjust these fields based on your actual pNode program structure
  identity: string; // Usually a string or fixed-size array
  status: number; // u8: 0=inactive, 1=active, 2=syncing
  uptime: number; // f32 or u64
  performance: number; // f32
  reputation: number; // f32
  storageUsed: BN; // u64 (BN from bn.js)
  storageCap: BN; // u64 (BN from bn.js)
  slotsProduced: BN; // u64 (BN from bn.js)
  slotsSkipped: BN; // u64 (BN from bn.js)
  peerId: string; // Usually a string or fixed-size array
  version: string; // Usually a string or fixed-size array
  lastHeartbeat: BN; // u64 timestamp (BN from bn.js)
  // Add more fields as needed based on your program
}

/**
 * Borsh layout schema for pNode account data
 * IMPORTANT: Update this schema to match your actual pNode program structure
 * The field order and types must match your program's struct exactly
 */
const pNodeLayout = struct<RawPNodeData>([
  // Adjust these based on your actual program structure
  // Example structure - you need to verify the actual layout
  str('identity'),
  u8('status'),
  f32('uptime'),
  f32('performance'),
  f32('reputation'),
  u64('storageUsed'),
  u64('storageCap'),
  u64('slotsProduced'),
  u64('slotsSkipped'),
  str('peerId'),
  str('version'),
  u64('lastHeartbeat'),
]);

/**
 * Converts base64 string to Uint8Array (browser-compatible)
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
  // Decode base64 to binary string
  const binaryString = atob(base64);
  // Convert binary string to Uint8Array
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Helper function to inspect raw buffer data
 * Use this to understand the structure of your pNode data
 * Call this in the browser console to see the data layout
 */
export const inspectPNodeBuffer = (account: ProgramAccount): void => {
  let dataString: string | null = null;

  if (Array.isArray(account.account.data)) {
    dataString = account.account.data[0] as string;
  } else if (typeof account.account.data === 'string') {
    dataString = account.account.data;
  }

  if (!dataString) {
    console.error('No data found');
    return;
  }

  const buffer = base64ToUint8Array(dataString);
  const bufferForDecode = Buffer.from(buffer);

  console.log('📊 Buffer Inspection for account:', account.pubkey);
  console.log('📊 Total size:', buffer.length, 'bytes');
  console.log(
    '📊 First 100 bytes (hex):',
    Array.from(buffer.slice(0, 100))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' ')
  );
  console.log('📊 First 100 bytes (decimal):', Array.from(buffer.slice(0, 100)));

  // Try to read some common patterns
  console.log('\n🔍 Attempting to read common patterns:');

  // Read first 8 bytes as discriminator (if exists)
  if (buffer.length >= 8) {
    const discriminator = Array.from(buffer.slice(0, 8));
    console.log('   First 8 bytes (discriminator?):', discriminator);
  }

  // Try reading as u32 length-prefixed string
  if (buffer.length >= 4) {
    const length = bufferForDecode.readUInt32LE(8); // Assuming 8-byte discriminator
    console.log('   Length at offset 8 (u32):', length);
    if (length < 1000 && buffer.length >= 8 + 4 + length) {
      const possibleString = bufferForDecode.slice(12, 12 + length).toString('utf8');
      console.log('   Possible string at offset 12:', possibleString);
    }
  }
};

/**
 * Decodes base64 account data to structured pNode data
 */
export const decodePNodeAccount = (account: ProgramAccount): RawPNodeData | null => {
  try {
    // Check if data is already parsed (jsonParsed encoding)
    if (
      account.account.data &&
      typeof account.account.data === 'object' &&
      'parsed' in account.account.data &&
      account.account.data.parsed
    ) {
      // Data is already parsed by RPC
      const parsed = account.account.data.parsed;
      console.log('📦 Using pre-parsed data from RPC:', parsed);

      // Try to map parsed data to RawPNodeData format
      // The structure depends on how the RPC parses it
      if (parsed && typeof parsed === 'object') {
        try {
          // Log the actual parsed structure to help with mapping
          console.log('📊 Parsed data structure:', JSON.stringify(parsed, null, 2));

          // Map the parsed data to our expected format
          // Adjust these mappings based on actual parsed structure
          // The parsed data might be nested or have different field names
          const mapped: RawPNodeData = {
            identity: parsed.identity || parsed.identity || '',
            status: typeof parsed.status === 'number' ? parsed.status : 0,
            uptime: typeof parsed.uptime === 'number' ? parsed.uptime : 0,
            performance: typeof parsed.performance === 'number' ? parsed.performance : 0,
            reputation: typeof parsed.reputation === 'number' ? parsed.reputation : 0,
            storageUsed: BN.isBN(parsed.storageUsed)
              ? parsed.storageUsed
              : new BN(String(parsed.storageUsed || 0)),
            storageCap: BN.isBN(parsed.storageCap)
              ? parsed.storageCap
              : new BN(String(parsed.storageCap || 0)),
            slotsProduced: BN.isBN(parsed.slotsProduced)
              ? parsed.slotsProduced
              : new BN(String(parsed.slotsProduced || 0)),
            slotsSkipped: BN.isBN(parsed.slotsSkipped)
              ? parsed.slotsSkipped
              : new BN(String(parsed.slotsSkipped || 0)),
            peerId: parsed.peerId || parsed.peerId || '',
            version: parsed.version || parsed.version || '',
            lastHeartbeat: BN.isBN(parsed.lastHeartbeat)
              ? parsed.lastHeartbeat
              : new BN(String(parsed.lastHeartbeat || 0)),
          };
          console.log('✅ Successfully mapped parsed data');
          return mapped;
        } catch (mapError) {
          console.warn('⚠️ Failed to map parsed data, falling back to base64 decoding:', mapError);
          // Fall through to base64 decoding
        }
      }
    }

    // Get the base64 data for manual decoding
    // Solana RPC returns data as either:
    // - Array: ["base64string", "base64"]
    // - String: "base64string"
    let dataString: string | null = null;

    if (Array.isArray(account.account.data)) {
      // Format: ["base64string", "base64"]
      dataString = account.account.data[0] as string;
    } else if (typeof account.account.data === 'string') {
      // Format: "base64string"
      dataString = account.account.data;
    }

    if (!dataString || typeof dataString !== 'string') {
      console.warn('⚠️ No valid base64 data found in account:', account.pubkey);
      return null;
    }

    // Decode base64 to Uint8Array (browser-compatible)
    const buffer = base64ToUint8Array(dataString);
    console.log(
      `🔍 Decoding account ${account.pubkey.slice(0, 8)}... - Buffer size: ${buffer.length} bytes`
    );

    // Convert Uint8Array to Buffer for buffer-layout
    const bufferForDecode = Buffer.from(buffer);

    // Try different discriminator offsets
    // Many Solana programs use 8-byte discriminators, but some use different sizes
    // Also, some programs don't use discriminators at all
    let decoded: RawPNodeData | null = null;
    let lastError: Error | null = null;
    const offsetsToTry = [0, 8]; // Try without offset first, then with 8-byte offset

    for (const offset of offsetsToTry) {
      try {
        const dataBuffer = bufferForDecode.slice(offset);

        if (dataBuffer.length < 10) {
          console.warn(
            `⚠️ Data buffer too small after offset ${offset}: ${dataBuffer.length} bytes`
          );
          continue;
        }

        // Decode using Borsh layout
        decoded = pNodeLayout.decode(dataBuffer);
        console.log(
          `✅ Successfully decoded account ${account.pubkey.slice(0, 8)} with offset ${offset}`
        );
        break;
      } catch (offsetError) {
        lastError = offsetError instanceof Error ? offsetError : new Error(String(offsetError));
        if (offset === offsetsToTry[offsetsToTry.length - 1]) {
          // Last attempt, log detailed error
          console.warn(`⚠️ Failed to decode with offset ${offset}:`, lastError.message);
        }
        // Continue to next offset
      }
    }

    if (!decoded) {
      // If all offsets failed, log detailed debugging info
      console.error(`❌ Failed to decode account ${account.pubkey} with all attempted offsets`);
      console.log(`📊 Buffer size: ${buffer.length} bytes`);
      console.log(
        `📊 First 50 bytes (hex):`,
        Array.from(buffer.slice(0, 50))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(' ')
      );
      console.log(`📊 First 50 bytes (decimal):`, Array.from(buffer.slice(0, 50)));
      if (lastError) {
        console.error(`📊 Last error:`, lastError.message);
        console.error(`📊 Last error stack:`, lastError.stack);
      }
      throw lastError || new Error('Failed to decode with all attempted offsets');
    }

    return decoded;
  } catch (error) {
    console.error(`❌ Error decoding account ${account.pubkey}:`, error);
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`);
      console.error(`   Error stack: ${error.stack}`);
    }
    return null;
  }
};

/**
 * Decodes all program accounts
 */
export const decodePNodeAccounts = (accounts: ProgramAccount[]): RawPNodeData[] => {
  console.log(`📦 Processing ${accounts.length} raw accounts...`);

  const decoded: RawPNodeData[] = [];

  for (const account of accounts) {
    const decodedData = decodePNodeAccount(account);
    if (decodedData) {
      decoded.push(decodedData);
    }
  }

  console.log(`✅ Successfully decoded ${decoded.length} pNodes`);
  return decoded;
};

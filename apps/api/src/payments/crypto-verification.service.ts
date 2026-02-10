import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TransactionVerification {
  verified: boolean;
  amount?: string;
  from?: string;
  to?: string;
  confirmations?: number;
  blockNumber?: number;
  error?: string;
}

/**
 * Service for verifying cryptocurrency transactions on multiple blockchains.
 * Supports Ethereum (+ EVM chains), Bitcoin, and Solana.
 *
 * For production, configure the appropriate API keys:
 *   - ETHERSCAN_API_KEY for Ethereum/BSC/Polygon
 *   - BLOCKCYPHER_TOKEN for Bitcoin
 *   - SOLANA_RPC_URL for Solana
 */
@Injectable()
export class CryptoVerificationService {
  private readonly logger = new Logger(CryptoVerificationService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Verify a transaction hash on the specified blockchain network.
   */
  async verifyTransaction(
    txHash: string,
    network: string = 'ethereum',
  ): Promise<TransactionVerification> {
    try {
      switch (network.toLowerCase()) {
        case 'ethereum':
        case 'eth':
          return this.verifyEthereumTx(txHash);
        case 'bsc':
        case 'binance':
          return this.verifyBscTx(txHash);
        case 'polygon':
        case 'matic':
          return this.verifyPolygonTx(txHash);
        case 'solana':
        case 'sol':
          return this.verifySolanaTx(txHash);
        case 'bitcoin':
        case 'btc':
          return this.verifyBitcoinTx(txHash);
        default:
          return { verified: false, error: `Unsupported network: ${network}` };
      }
    } catch (error) {
      this.logger.error(
        `Failed to verify tx ${txHash} on ${network}: ${error.message}`,
      );
      return { verified: false, error: error.message };
    }
  }

  /**
   * Verify Ethereum transaction via Etherscan API
   */
  private async verifyEthereumTx(
    txHash: string,
  ): Promise<TransactionVerification> {
    return this.verifyEvmTx(
      txHash,
      'https://api.etherscan.io/api',
      this.configService.get<string>('ETHERSCAN_API_KEY', ''),
    );
  }

  /**
   * Verify BSC transaction via BscScan API
   */
  private async verifyBscTx(
    txHash: string,
  ): Promise<TransactionVerification> {
    return this.verifyEvmTx(
      txHash,
      'https://api.bscscan.com/api',
      this.configService.get<string>('BSCSCAN_API_KEY', ''),
    );
  }

  /**
   * Verify Polygon transaction via PolygonScan API
   */
  private async verifyPolygonTx(
    txHash: string,
  ): Promise<TransactionVerification> {
    return this.verifyEvmTx(
      txHash,
      'https://api.polygonscan.com/api',
      this.configService.get<string>('POLYGONSCAN_API_KEY', ''),
    );
  }

  /**
   * Generic EVM chain transaction verification (Etherscan-compatible API)
   */
  private async verifyEvmTx(
    txHash: string,
    apiUrl: string,
    apiKey: string,
  ): Promise<TransactionVerification> {
    if (!apiKey) {
      return { verified: false, error: 'Blockchain API key not configured' };
    }

    const url = `${apiUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result || data.result === null) {
      return { verified: false, error: 'Transaction not found on blockchain' };
    }

    const tx = data.result;

    // Also get the receipt to check if the transaction succeeded
    const receiptUrl = `${apiUrl}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${apiKey}`;
    const receiptResponse = await fetch(receiptUrl);
    const receiptData = await receiptResponse.json();

    const receipt = receiptData.result;
    const isSuccess = receipt && receipt.status === '0x1';

    if (!isSuccess) {
      return {
        verified: false,
        error: 'Transaction failed or is still pending',
        from: tx.from,
        to: tx.to,
      };
    }

    // Convert value from hex Wei to decimal ETH
    const valueWei = BigInt(tx.value);
    const valueEth = Number(valueWei) / 1e18;

    return {
      verified: true,
      amount: valueEth.toFixed(8),
      from: tx.from,
      to: tx.to,
      blockNumber: parseInt(tx.blockNumber, 16),
      confirmations: receipt.blockNumber
        ? undefined // Caller can compute from current block
        : 0,
    };
  }

  /**
   * Verify Solana transaction via RPC
   */
  private async verifySolanaTx(
    txHash: string,
  ): Promise<TransactionVerification> {
    const rpcUrl = this.configService.get<string>(
      'SOLANA_RPC_URL',
      'https://api.mainnet-beta.solana.com',
    );

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [txHash, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }],
      }),
    });

    const data = await response.json();

    if (!data.result) {
      return { verified: false, error: 'Transaction not found on Solana' };
    }

    const meta = data.result.meta;
    if (meta.err !== null) {
      return { verified: false, error: 'Solana transaction failed' };
    }

    // Extract SOL transfer amount from pre/post balances
    const preBalances = meta.preBalances;
    const postBalances = meta.postBalances;
    const transferLamports = preBalances[0] - postBalances[0] - meta.fee;
    const transferSol = transferLamports / 1e9;

    return {
      verified: true,
      amount: transferSol.toFixed(9),
      confirmations: data.result.slot ? 1 : 0,
    };
  }

  /**
   * Verify Bitcoin transaction via BlockCypher API
   */
  private async verifyBitcoinTx(
    txHash: string,
  ): Promise<TransactionVerification> {
    const token = this.configService.get<string>('BLOCKCYPHER_TOKEN', '');
    const tokenParam = token ? `?token=${token}` : '';
    const url = `https://api.blockcypher.com/v1/btc/main/txs/${txHash}${tokenParam}`;

    const response = await fetch(url);
    if (!response.ok) {
      return { verified: false, error: 'Transaction not found on Bitcoin network' };
    }

    const data = await response.json();

    if (!data.confirmed) {
      return {
        verified: false,
        error: `Transaction unconfirmed (${data.confirmations || 0} confirmations)`,
        confirmations: data.confirmations || 0,
      };
    }

    // Total output value in satoshis -> BTC
    const totalOutput = data.total || 0;
    const btcAmount = totalOutput / 1e8;

    return {
      verified: true,
      amount: btcAmount.toFixed(8),
      confirmations: data.confirmations,
      blockNumber: data.block_height,
    };
  }
}

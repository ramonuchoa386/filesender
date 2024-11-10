import fetch from "node-fetch";
import { jwtDecode } from "jwt-decode";

import { IInvalidToken, IToken } from "../../domain/token.interface";
import Logger from "../logger";

interface DecodedToken {
  exp: number;
}

class TokenManager {
  private accessToken: string | null = null;
  private logger = new Logger("Filesender Oauth client");

  private decodeToken(token: string): DecodedToken {
    return jwtDecode(token);
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  private async fetchToken(): Promise<string> {
    const data = new URLSearchParams({
      client_id: `${process.env.FILESENDER_CLIENT_ID}`,
      client_secret: `${process.env.FILESENDER_CLIENT_SECRET}`,
      grant_type: "client_credentials",
    });

    const response = await fetch(`${process.env.FILESENDER_OAUTH_SERVER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });

    if (!response.ok) {
      const errorResponse: IInvalidToken = await response.json();

      this.logger.error(JSON.stringify(errorResponse), "Error fetching token.");

      throw new Error(
        `Error fetching token: ${errorResponse.error_description}`
      );
    }

    const result: IToken = await response.json();

    this.logger.info("", "Fetch token response.");

    return result.access_token;
  }

  public async getToken(): Promise<string> {
    if (this.accessToken && !this.isTokenExpired(this.accessToken)) {
      return this.accessToken;
    }

    this.accessToken = await this.fetchToken();
    return this.accessToken;
  }
}

export default TokenManager;

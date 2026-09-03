import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export class SecretService {
  private static cache: Map<string, string> = new Map();

  static async getSecret(secretName: string): Promise<string> {
    // Return from cache if available
    if (this.cache.has(secretName)) {
      return this.cache.get(secretName)!;
    }

    // PRIORITY: Check local environment variables first for local development
    if (process.env.NODE_ENV !== 'production' && process.env[secretName]) {
      const val = process.env[secretName]!;
      this.cache.set(secretName, val);
      return val;
    }

    try {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
      if (!projectId) {
        throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is not set');
      }

      // In a real production environment, we'd use the full path:
      // projects/{project_id}/secrets/{secret_name}/versions/latest
      const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;

      const [version] = await client.accessSecretVersion({ name });
      const payload = version.payload?.data?.toString();

      if (!payload) {
        throw new Error(`Secret ${secretName} is empty or not found`);
      }

      this.cache.set(secretName, payload);
      return payload;
    } catch (error) {
      console.error(`Error retrieving secret ${secretName}:`, error);

      // Fallback for local development if allowed
      if (process.env.NODE_ENV !== 'production' && process.env[secretName]) {
        return process.env[secretName]!;
      }

      throw new Error(`Failed to retrieve secret: ${secretName}`);
    }
  }
}

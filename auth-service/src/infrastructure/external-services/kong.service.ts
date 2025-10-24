import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { WinstonLoggerService } from "@shared/infrastructure/logging";
import { Role } from "../../domain/entities/role.entity";

/**
 * Kong Consumer Interface
 */
interface KongConsumer {
  id?: string;
  username: string;
  custom_id: string;
  tags?: string[];
}

/**
 * Kong ACL Group Interface
 */
interface KongAclGroup {
  id?: string;
  group: string;
  consumer: {
    id: string;
  };
}

/**
 * Kong JWT Credential Interface
 */
interface KongJwtCredential {
  id?: string;
  key: string;
  secret: string;
  algorithm: string;
}

/**
 * Kong Admin API Service
 * Manages Kong consumers, ACL groups, and JWT credentials
 * Syncs user data from Auth Service to Kong Gateway
 */
@Injectable()
export class KongService {
  private readonly logger = new WinstonLoggerService();
  private readonly client: AxiosInstance;
  private readonly enabled: boolean;
  private readonly kongAdminUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.logger.setContext("KongService");

    this.kongAdminUrl =
      this.configService.get<string>("KONG_ADMIN_URL") ||
      "http://localhost:8001";
    const kongAdminToken = this.configService.get<string>("KONG_ADMIN_TOKEN");
    this.enabled =
      this.configService.get<string>("KONG_SYNC_ENABLED") === "true";

    // Initialize axios client
    this.client = axios.create({
      baseURL: this.kongAdminUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...(kongAdminToken && { Authorization: `Bearer ${kongAdminToken}` }),
      },
    });

    if (!this.enabled) {
      this.logger.warn("Kong synchronization is DISABLED");
    } else {
      this.logger.log(
        `Kong service initialized with admin URL: ${this.kongAdminUrl}`
      );
    }
  }

  /**
   * Create a Kong consumer for a user
   * @param userId - User ID from database
   * @param username - Username (email)
   * @param roles - User roles
   */
  async createKongConsumer(
    userId: number,
    username: string,
    roles: Role[]
  ): Promise<void> {
    if (!this.enabled) {
      this.logger.debug("Kong sync disabled, skipping consumer creation");
      return;
    }

    try {
      const customId = `user-${userId}`;

      // 1. Create consumer
      const consumerResponse = await this.client.post<KongConsumer>(
        "/consumers",
        {
          username: username.toLowerCase(),
          custom_id: customId,
          tags: ["auth-service", "user"],
        }
      );

      const consumerId = consumerResponse.data.id!;
      this.logger.log(
        `Kong consumer created: ${username} (ID: ${consumerId})`,
        { userId, consumerId }
      );

      // 2. Add ACL groups based on roles directly using the consumer ID
      const roleNames = roles.map((role) => role.name);
      if (roleNames.length === 0) {
        roleNames.push("user"); // Default role
      }

      for (const roleName of roleNames) {
        try {
          await this.client.post(`/consumers/${consumerId}/acls`, {
            group: roleName,
          });
          this.logger.debug(`Added ACL group: ${roleName} for consumer ${consumerId}`);
        } catch (error) {
          this.logger.error(
            `Failed to add ACL group ${roleName} for consumer ${consumerId}: ${error}`
          );
        }
      }

      // 3. Add JWT credential directly using the consumer ID
      try {
        const jwtSecret = this.configService.get<string>("JWT_SECRET");
        await this.client.post(`/consumers/${consumerId}/jwt`, {
          key: username.toLowerCase(),
          secret: jwtSecret,
          algorithm: "HS256",
        });
        this.logger.debug(`JWT credential synced for ${username}`);
      } catch (error) {
        this.logger.error(
          `Failed to sync JWT credential for consumer ${consumerId}: ${error}`
        );
      }

      this.logger.log(`Kong consumer fully configured: ${username}`, {
        userId,
        roles: roleNames,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Consumer might already exist
        if (error.response?.status === 409) {
          this.logger.warn(
            `Kong consumer already exists: ${username}, updating instead`,
            { userId }
          );
          await this.updateKongConsumerGroups(userId, roles);
        } else {
          this.logger.error(
            `Failed to create Kong consumer: ${error.message}`,
            error.stack
          );
        }
      } else {
        this.logger.error(
          `Unexpected error creating Kong consumer: ${String(error)}`,
          error instanceof Error ? error.stack : undefined
        );
      }
    }
  }

  /**
   * Update Kong consumer ACL groups based on user roles
   * @param userId - User ID
   * @param roles - Updated user roles
   */
  async updateKongConsumerGroups(
    userId: number,
    roles: Role[]
  ): Promise<void> {
    if (!this.enabled) {
      this.logger.debug("Kong sync disabled, skipping ACL group update");
      return;
    }

    try {
      const customId = `user-${userId}`;

      // Get consumer by custom_id
      const consumer = await this.getConsumerByCustomId(customId);
      if (!consumer) {
        this.logger.warn(
          `Kong consumer not found for user ${userId}, cannot update ACL groups`
        );
        return;
      }

      // Delete existing ACL groups
      await this.deleteConsumerAclGroups(consumer.id!);

      // Add new ACL groups based on roles
      const roleNames = roles.map((role) => role.name);
      for (const roleName of roleNames) {
        await this.client.post(`/consumers/${consumer.id}/acls`, {
          group: roleName,
        });
        this.logger.debug(
          `ACL group '${roleName}' added to consumer ${consumer.username}`,
          { userId, consumerId: consumer.id }
        );
      }

      this.logger.log(`Kong ACL groups updated for user ${userId}`, {
        userId,
        consumerId: consumer.id,
        groups: roleNames,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          `Failed to update Kong ACL groups: ${error.message}`,
          error.stack
        );
      } else {
        this.logger.error(
          `Unexpected error updating Kong ACL groups: ${String(error)}`,
          error instanceof Error ? error.stack : undefined
        );
      }
    }
  }

  /**
   * Delete Kong consumer
   * @param userId - User ID
   */
  async deleteKongConsumer(userId: number): Promise<void> {
    if (!this.enabled) {
      this.logger.debug("Kong sync disabled, skipping consumer deletion");
      return;
    }

    try {
      const customId = `user-${userId}`;

      // Get consumer by custom_id
      const consumer = await this.getConsumerByCustomId(customId);
      if (!consumer) {
        this.logger.warn(
          `Kong consumer not found for user ${userId}, nothing to delete`
        );
        return;
      }

      // Delete consumer (cascades to ACLs and JWT credentials)
      await this.client.delete(`/consumers/${consumer.id}`);
      this.logger.log(`Kong consumer deleted for user ${userId}`, {
        userId,
        consumerId: consumer.id,
        username: consumer.username,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          `Failed to delete Kong consumer: ${error.message}`,
          error.stack
        );
      } else {
        this.logger.error(
          `Unexpected error deleting Kong consumer: ${String(error)}`,
          error instanceof Error ? error.stack : undefined
        );
      }
    }
  }

  /**
   * Sync JWT credential for Kong consumer
   * @param userId - User ID
   * @param username - Username (used as JWT key)
   */
  async syncKongConsumerJWT(userId: number, username: string): Promise<void> {
    if (!this.enabled) {
      this.logger.debug("Kong sync disabled, skipping JWT credential sync");
      return;
    }

    try {
      const customId = `user-${userId}`;
      const jwtSecret = this.configService.get<string>("JWT_SECRET");

      if (!jwtSecret) {
        this.logger.error("JWT_SECRET not configured, cannot sync JWT");
        return;
      }

      // Get consumer by custom_id
      const consumer = await this.getConsumerByCustomId(customId);
      if (!consumer) {
        this.logger.warn(
          `Kong consumer not found for user ${userId}, cannot sync JWT`
        );
        return;
      }

      // Check if JWT credential already exists
      const existingJwts = await this.client.get(
        `/consumers/${consumer.id}/jwt`
      );
      if (existingJwts.data.data && existingJwts.data.data.length > 0) {
        this.logger.debug(
          `JWT credential already exists for consumer ${consumer.username}`,
          { userId, consumerId: consumer.id }
        );
        return;
      }

      // Create JWT credential
      await this.client.post<KongJwtCredential>(
        `/consumers/${consumer.id}/jwt`,
        {
          key: `auth-service-${username}`,
          secret: jwtSecret,
          algorithm: "HS256",
        }
      );

      this.logger.log(`JWT credential synced for consumer ${consumer.username}`, {
        userId,
        consumerId: consumer.id,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          `Failed to sync JWT credential: ${error.message}`,
          error.stack
        );
      } else {
        this.logger.error(
          `Unexpected error syncing JWT credential: ${String(error)}`,
          error instanceof Error ? error.stack : undefined
        );
      }
    }
  }

  /**
   * Get Kong consumer by custom_id
   * @param customId - Custom ID (user-{userId})
   * @returns Kong consumer or null if not found
   */
  private async getConsumerByCustomId(
    customId: string
  ): Promise<KongConsumer | null> {
    try {
      const response = await this.client.get<KongConsumer>(
        `/consumers/${customId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete all ACL groups for a consumer
   * @param consumerId - Kong consumer ID
   */
  private async deleteConsumerAclGroups(consumerId: string): Promise<void> {
    try {
      const aclsResponse = await this.client.get<{ data: KongAclGroup[] }>(
        `/consumers/${consumerId}/acls`
      );

      for (const acl of aclsResponse.data.data) {
        await this.client.delete(`/consumers/${consumerId}/acls/${acl.id}`);
      }
    } catch (error) {
      // Ignore errors when deleting ACLs
      this.logger.debug(`Error deleting ACL groups: ${error}`);
    }
  }

  /**
   * Health check - verify Kong Admin API is accessible
   */
  async healthCheck(): Promise<boolean> {
    if (!this.enabled) {
      return false;
    }

    try {
      const response = await this.client.get("/status");
      return response.status === 200;
    } catch (error) {
      this.logger.error(
        "Kong health check failed",
        error instanceof Error ? error.stack : String(error)
      );
      return false;
    }
  }
}

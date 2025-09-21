// src/services/auth.service.ts - Enhanced with retry logic
import { createClient } from "@/app/(frontend)/lib/client";
import type { AuthUser, AuthProvider } from "@/types/auth.types";
import type { User } from "@/types/user.types";

export class AuthService {
  private static getClient() {
    return createClient();
  }

  /**
   * Enhanced session getter with retry logic for token refresh scenarios
   */
  private static async getSessionWithRetry(
    maxRetries = 3,
    delayMs = 1000
  ): Promise<any> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const supabase = this.getClient();
        const startTime = Date.now();

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          if (attempt === maxRetries) throw error;
          continue;
        }

        // Check if we have a valid session with valid token
        if (session?.access_token && session?.expires_at) {
          const isTokenValid = session.expires_at > Date.now() / 1000;

          if (isTokenValid) {
            return session;
          }
        }

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    return null;
  }

  /**
   * Enhanced getUserProfile with token retry and better error handling
   */
  static async getUserProfile(userId: string): Promise<User[] | null> {
    try {
      if (!userId) {
        return null;
      }

      // Get session with retry logic
      const session = await this.getSessionWithRetry(3, 1500);

      if (!session?.access_token) {
        return null;
      }

      // Attempt database query with retry on specific errors
      const maxDbRetries = 2;
      let lastError = null;

      for (let attempt = 1; attempt <= maxDbRetries; attempt++) {
        try {
          const supabase = this.getClient();
          const startTime = Date.now();

          const { data, error } = await supabase
            .from("users_with_office_assignment")
            .select("*")
            .eq("id", userId);
            
          if (error) {
            lastError = error;

            // Check if it's an auth-related error that might benefit from retry
            const isAuthError =
              error.code === "PGRST301" || // JWT token issues
              error.code === "PGRST302" || // JWT token expired
              error.message?.toLowerCase().includes("jwt") ||
              error.message?.toLowerCase().includes("token") ||
              error.message?.toLowerCase().includes("unauthorized");

            if (isAuthError && attempt < maxDbRetries) {
              // Wait a bit longer and try to refresh session
              await new Promise((resolve) => setTimeout(resolve, 2000));

              // Try to get a fresh session before retry
              await this.getSessionWithRetry(2, 1000);
              continue;
            } else {
              break;
            }
          } else {
            // Success
            if (!data || data.length === 0) {
              return null;
            }
            return data as User[];
          }
        } catch (dbError) {
          lastError = dbError;

          if (attempt === maxDbRetries) break;
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }

      console.error("Error fetching user profile after retries:", lastError);
      return null;
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      return null;
    }
  }

  /**
   * Enhanced getCurrentUser with retry logic
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const session = await this.getSessionWithRetry(3, 1000);

      if (!session?.user) {
        return null;
      }

      const { user } = session;

      const authUser: AuthUser = {
        id: user.id,
        email: user.email || "",
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User",
        photo:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          user.user_metadata?.photo_url,
        role: user.user_metadata?.role || user.app_metadata?.role || "user",
      };

      return authUser;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  /**
   * Enhanced getSession (public method)
   */
  static async getSession() {
    return await this.getSessionWithRetry(3, 1000);
  }

  // ... rest of the methods remain the same
  private static getRedirectUrl(): string {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    return `${baseUrl}/callback`;
  }

  static async initiateOAuthLogin(
    provider: AuthProvider = "google"
  ): Promise<void> {
    try {
      const supabase = this.getClient();
      const redirectUrl = this.getRedirectUrl();

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw new Error(error.message || "Gagal melakukan login");
      }
    } catch (error: any) {
      console.error("OAuth login error:", error);
      throw new Error(error.message || "Gagal melakukan login");
    }
  }

  static async logout(): Promise<void> {
    try {
      const supabase = this.getClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error);
        throw new Error(error.message || "Gagal logout");
      }
    } catch (error: any) {
      console.error("Error logging out:", error);
      throw new Error(error.message || "Gagal logout");
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = this.getClient();

    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

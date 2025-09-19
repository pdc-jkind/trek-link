// src/services/auth.service.ts - Enhanced with retry logic
import { createClient } from "@/app/(frontend)/lib/client";
import type { AuthUser, AuthProvider } from "@/types/auth.types";
import type { User } from "@/types/user.types";

export class AuthService {
  private static getClient() {
    return createClient();
  }

  private static debugLog(method: string, message: string, data?: any) {
    console.log(`🔧 [AUTH_SERVICE] ${method}: ${message}`, {
      timestamp: new Date().toISOString(),
      ...data
    });
  }

  /**
   * Enhanced session getter with retry logic for token refresh scenarios
   */
  private static async getSessionWithRetry(maxRetries = 3, delayMs = 1000): Promise<any> {
    this.debugLog('getSessionWithRetry', 'Starting session fetch with retry', { maxRetries, delayMs });
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const supabase = this.getClient();
        const startTime = Date.now();
        
        const { data: { session }, error } = await supabase.auth.getSession();
        const duration = Date.now() - startTime;
        
        this.debugLog('getSessionWithRetry', `Attempt ${attempt} completed`, {
          attempt,
          duration: `${duration}ms`,
          hasSession: !!session,
          hasUser: !!session?.user,
          hasAccessToken: !!session?.access_token,
          tokenValid: session?.access_token && session?.expires_at ? session.expires_at > Date.now() / 1000 : false,
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined,
          error: error?.message
        });

        if (error) {
          this.debugLog('getSessionWithRetry', `Attempt ${attempt} failed`, { error: error.message });
          if (attempt === maxRetries) throw error;
          continue;
        }

        // Check if we have a valid session with valid token
        if (session?.access_token && session?.expires_at) {
          const isTokenValid = session.expires_at > (Date.now() / 1000);
          
          if (isTokenValid) {
            this.debugLog('getSessionWithRetry', `Attempt ${attempt} successful - valid token found`);
            return session;
          } else {
            this.debugLog('getSessionWithRetry', `Attempt ${attempt} - token expired, retrying`, {
              expiresAt: new Date(session.expires_at * 1000).toISOString(),
              currentTime: new Date().toISOString()
            });
          }
        }

        if (attempt < maxRetries) {
          this.debugLog('getSessionWithRetry', `Attempt ${attempt} - waiting before retry`, { delayMs });
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }

      } catch (error) {
        this.debugLog('getSessionWithRetry', `Attempt ${attempt} exception`, { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    this.debugLog('getSessionWithRetry', 'All attempts failed');
    return null;
  }

  /**
   * Enhanced getUserProfile with token retry and better error handling
   */
  static async getUserProfile(userId: string): Promise<User[] | null> {
    this.debugLog('getUserProfile', 'Starting getUserProfile', { userId });
    
    try {
      if (!userId) {
        this.debugLog('getUserProfile', 'No userId provided');
        return null;
      }

      // Get session with retry logic
      const session = await this.getSessionWithRetry(3, 1500);
      
      if (!session?.access_token) {
        this.debugLog('getUserProfile', 'No valid session/token found after retries');
        return null;
      }

      this.debugLog('getUserProfile', 'Valid session found, proceeding with database query', {
        hasAccessToken: !!session.access_token,
        userId: session.user?.id,
        tokenExpiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined
      });

      // Attempt database query with retry on specific errors
      const maxDbRetries = 2;
      let lastError = null;

      for (let attempt = 1; attempt <= maxDbRetries; attempt++) {
        try {
          this.debugLog('getUserProfile', `Database attempt ${attempt}`, { userId });
          
          const supabase = this.getClient();
          const startTime = Date.now();
          
          const { data, error } = await supabase
            .from('users_with_office_assignment')
            .select('*')
            .eq('id', userId);

          const duration = Date.now() - startTime;
          
          this.debugLog('getUserProfile', `Database attempt ${attempt} completed`, {
            duration: `${duration}ms`,
            dataCount: data?.length || 0,
            hasError: !!error,
            errorMessage: error?.message,
            errorCode: error?.code
          });

          if (error) {
            lastError = error;
            
            // Check if it's an auth-related error that might benefit from retry
            const isAuthError = error.code === 'PGRST301' || // JWT token issues
                               error.code === 'PGRST302' || // JWT token expired  
                               error.message?.toLowerCase().includes('jwt') ||
                               error.message?.toLowerCase().includes('token') ||
                               error.message?.toLowerCase().includes('unauthorized');

            if (isAuthError && attempt < maxDbRetries) {
              this.debugLog('getUserProfile', `Auth error detected, retrying after delay`, {
                errorCode: error.code,
                errorMessage: error.message,
                attempt,
                willRetry: true
              });
              
              // Wait a bit longer and try to refresh session
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Try to get a fresh session before retry
              await this.getSessionWithRetry(2, 1000);
              continue;
            } else {
              this.debugLog('getUserProfile', 'Non-retryable database error', {
                errorCode: error.code,
                errorMessage: error.message,
                attempt
              });
              break;
            }
          } else {
            // Success
            if (!data || data.length === 0) {
              this.debugLog('getUserProfile', 'No user profile data found');
              return null;
            }

            this.debugLog('getUserProfile', 'User profile fetched successfully', {
              userCount: data.length,
              offices: data.map(u => ({
                office_id: u.office_id,
                office_name: u.office_name,
                role_name: u.role_name
              }))
            });

            return data as User[];
          }
        } catch (dbError) {
          lastError = dbError;
          this.debugLog('getUserProfile', `Database attempt ${attempt} exception`, {
            error: dbError instanceof Error ? dbError.message : 'Unknown error',
            attempt
          });
          
          if (attempt === maxDbRetries) break;
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      // All database attempts failed
      this.debugLog('getUserProfile', 'All database attempts failed', {
        lastError: lastError instanceof Error ? lastError.message : 'Unknown error'
      });
      
      console.error('Error fetching user profile after retries:', lastError);
      return null;

    } catch (error) {
      this.debugLog('getUserProfile', 'Unexpected error in getUserProfile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId
      });
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  /**
   * Enhanced getCurrentUser with retry logic
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    this.debugLog('getCurrentUser', 'Starting getCurrentUser');
    
    try {
      const session = await this.getSessionWithRetry(3, 1000);
      
      if (!session?.user) {
        this.debugLog('getCurrentUser', 'No session or user found after retries');
        return null;
      }

      const { user } = session;

      const authUser: AuthUser = {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name || 
              user.user_metadata?.name || 
              user.email?.split('@')[0] || 
              "User",
        photo: user.user_metadata?.avatar_url || 
               user.user_metadata?.picture ||
               user.user_metadata?.photo_url,
        role: user.user_metadata?.role || user.app_metadata?.role || "user",
      };

      this.debugLog('getCurrentUser', 'AuthUser created successfully', {
        userId: authUser.id,
        email: authUser.email,
        name: authUser.name
      });

      return authUser;
    } catch (error) {
      this.debugLog('getCurrentUser', 'Error in getCurrentUser', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
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
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    return `${baseUrl}/callback`;
  }

  static async initiateOAuthLogin(provider: AuthProvider = 'google'): Promise<void> {
    this.debugLog('initiateOAuthLogin', 'Starting OAuth login', { provider });
    
    try {
      const supabase = this.getClient();
      const redirectUrl = this.getRedirectUrl();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        throw new Error(error.message || 'Gagal melakukan login');
      }
      
    } catch (error: any) {
      console.error("OAuth login error:", error);
      throw new Error(error.message || 'Gagal melakukan login');
    }
  }

  static async logout(): Promise<void> {
    try {
      const supabase = this.getClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error logging out:", error);
        throw new Error(error.message || 'Gagal logout');
      }
    } catch (error: any) {
      console.error("Error logging out:", error);
      throw new Error(error.message || 'Gagal logout');
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    this.debugLog('onAuthStateChange', 'Setting up auth state change listener');
    
    const supabase = this.getClient();
    
    return supabase.auth.onAuthStateChange((event, session) => {
      this.debugLog('onAuthStateChange', 'Auth state change detected', {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        hasAccessToken: !!session?.access_token,
        tokenExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined
      });
      
      callback(event, session);
    });
  }
}
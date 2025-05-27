import { defineNuxtPlugin } from '#app';

interface StrapiUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  // Add other fields if needed
}

export default defineNuxtPlugin((nuxtApp) => {
  const user = ref<StrapiUser | null>(null);
  const config = useRuntimeConfig();

  // Function to fetch user data from the API
  const fetchUser = async (token: string): Promise<StrapiUser | null> => {
    try {
      const response = await fetch(`${config.public.strapiUrl}/api/users/me?populate=*`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch user:', await response.json());
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      console.log('User data:', userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  // Initialize user on startup if token exists
  const initUser = async () => {
    if (process.client) {
      const token = localStorage.getItem('token');
      if (token) {
        user.value = await fetchUser(token);
      }
    }
  };

  // Call initUser on client-side only
  if (process.client) {
    initUser();
  }

  return {
    provide: {
      strapi: {
        get user() {
          return user.value;
        },
        
        async login(identifier: string, password: string) {
          try {
            const response = await fetch(`${config.public.strapiUrl}/api/auth/local`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                identifier,
                password,
              }),
            });

            if (!response.ok) {
              throw new Error('Login failed');
            }

            const data = await response.json();
            
            // Store JWT token only on client side
            if (process.client) {
              localStorage.setItem('token', data.jwt);
            }
            
            // Fetch and store user data
            user.value = await fetchUser(data.jwt);
            
            return data;
          } catch (error) {
            console.error('Login error:', error);
            throw error;
          }
        },

        async logout() {
          if (process.client) {
            localStorage.removeItem('token');
          }
          user.value = null;
        },

        async getUser() {
          if (!user.value) {
            await initUser();
          }
          return user.value;
        }
      }
    }
  };
}); 
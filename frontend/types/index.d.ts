declare module '#app' {
  interface NuxtApp {
    $strapi: {
      user: any; // À remplacer par le type correct de l'utilisateur
      login: (identifier: string, password: string) => Promise<any>;
      logout: () => Promise<void>;
      getUser: () => Promise<any>;
    };
  }
}

export {}; 
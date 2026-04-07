declare module "app-store-scraper" {
  const store: {
    list(opts: {
      category?: number;
      collection?: string;
      num?: number;
      country?: string;
      lang?: string;
    }): Promise<any[]>;
    collection: Record<string, string>;
    category: Record<string, number>;
  };
  export = store;
}

declare module "google-play-scraper" {
  const gplay: {
    list(opts: {
      category?: string;
      collection?: string;
      num?: number;
      country?: string;
      lang?: string;
      throttle?: number;
    }): Promise<any[]>;
    collection: Record<string, string>;
    category: Record<string, string>;
  };
  export = gplay;
}

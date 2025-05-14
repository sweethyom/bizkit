type StorageType = 'localStorage' | 'sessionStorage';

export class Storage<T = unknown> {
  private readonly storage: globalThis.Storage;
  private readonly key: string;

  constructor(key: string, storage: StorageType = 'localStorage') {
    this.key = key;
    this.storage = window[storage];
  }

  get(): T | null {
    try {
      const item = this.storage.getItem(this.key) ?? '{}';
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  set(value: T): void {
    this.storage.setItem(this.key, JSON.stringify(value));
  }

  remove(): void {
    this.storage.removeItem(this.key);
  }
}

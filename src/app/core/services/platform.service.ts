import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

/**
 * Serviço centralizado para verificações de plataforma (Browser vs Server)
 * Evita repetição de código isPlatformBrowser em todos os componentes
 */
@Injectable({
    providedIn: 'root'
})
export class PlatformService {
    private readonly isBrowser: boolean;
    private readonly isServer: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.isServer = isPlatformServer(this.platformId);
    }

    /**
     * Verifica se está executando no navegador
     */
    get isBrowserPlatform(): boolean {
        return this.isBrowser;
    }

    /**
     * Verifica se está executando no servidor (SSR)
     */
    get isServerPlatform(): boolean {
        return this.isServer;
    }

    /**
     * Executa uma função apenas se estiver no navegador
     * @param fn Função a ser executada
     * @returns Resultado da função ou undefined se estiver no servidor
     */
    runInBrowser<T>(fn: () => T): T | undefined {
        if (this.isBrowser) {
            return fn();
        }
        return undefined;
    }

    /**
     * Executa uma função apenas se estiver no servidor
     * @param fn Função a ser executada
     * @returns Resultado da função ou undefined se estiver no navegador
     */
    runInServer<T>(fn: () => T): T | undefined {
        if (this.isServer) {
            return fn();
        }
        return undefined;
    }

    /**
     * Executa código assíncrono apenas no navegador
     * @param fn Função assíncrona a ser executada
     * @returns Promise com resultado ou Promise.resolve(undefined) se no servidor
     */
    async runInBrowserAsync<T>(fn: () => Promise<T>): Promise<T | undefined> {
        if (this.isBrowser) {
            return await fn();
        }
        return Promise.resolve(undefined);
    }

    /**
     * Acessa localStorage de forma segura
     * @param key Chave do localStorage
     * @returns Valor ou null se não estiver no navegador
     */
    getLocalStorage(key: string): string | null {
        if (this.isBrowser) {
            return localStorage.getItem(key);
        }
        return null;
    }

    /**
     * Define valor no localStorage de forma segura
     * @param key Chave do localStorage
     * @param value Valor a ser armazenado
     */
    setLocalStorage(key: string, value: string): void {
        if (this.isBrowser) {
            localStorage.setItem(key, value);
        }
    }

    /**
     * Remove item do localStorage de forma segura
     * @param key Chave do localStorage
     */
    removeLocalStorage(key: string): void {
        if (this.isBrowser) {
            localStorage.removeItem(key);
        }
    }

    /**
     * Acessa sessionStorage de forma segura
     * @param key Chave do sessionStorage
     * @returns Valor ou null se não estiver no navegador
     */
    getSessionStorage(key: string): string | null {
        if (this.isBrowser) {
            return sessionStorage.getItem(key);
        }
        return null;
    }

    /**
     * Define valor no sessionStorage de forma segura
     * @param key Chave do sessionStorage
     * @param value Valor a ser armazenado
     */
    setSessionStorage(key: string, value: string): void {
        if (this.isBrowser) {
            sessionStorage.setItem(key, value);
        }
    }

    /**
     * Remove item do sessionStorage de forma segura
     * @param key Chave do sessionStorage
     */
    removeSessionStorage(key: string): void {
        if (this.isBrowser) {
            sessionStorage.removeItem(key);
        }
    }

    /**
     * Acessa window de forma segura
     * @returns objeto window ou undefined se no servidor
     */
    get window(): Window | undefined {
        return this.isBrowser ? window : undefined;
    }

    /**
     * Acessa document de forma segura
     * @returns objeto document ou undefined se no servidor
     */
    get document(): Document | undefined {
        return this.isBrowser ? document : undefined;
    }
}

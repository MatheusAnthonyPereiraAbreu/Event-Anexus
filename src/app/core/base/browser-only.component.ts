import { OnInit, OnDestroy, Directive, inject } from '@angular/core';
import { PlatformService } from '../services/platform.service';
import { Subject } from 'rxjs';

/**
 * Classe base para componentes que precisam de proteção SSR
 * Fornece utilities comuns e lifecycle hooks seguros
 */
@Directive()
export abstract class BrowserOnlyComponent implements OnInit, OnDestroy {
    protected platformService = inject(PlatformService);
    protected destroy$ = new Subject<void>();

    /**
     * Verifica se está no navegador
     */
    protected get isBrowser(): boolean {
        return this.platformService.isBrowserPlatform;
    }

    /**
     * Verifica se está no servidor
     */
    protected get isServer(): boolean {
        return this.platformService.isServerPlatform;
    }

    ngOnInit(): void {
        // Só executa onBrowserInit se estiver no navegador
        if (this.isBrowser) {
            this.onBrowserInit();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        if (this.isBrowser) {
            this.onBrowserDestroy();
        }
    }

    /**
     * Hook executado apenas no navegador após ngOnInit
     * Sobrescreva este método ao invés de ngOnInit
     */
    protected onBrowserInit(): void {
        // Para ser implementado pelos componentes filhos
    }

    /**
     * Hook executado apenas no navegador antes de ngOnDestroy
     * Sobrescreva este método para cleanup
     */
    protected onBrowserDestroy(): void {
        // Para ser implementado pelos componentes filhos
    }

    /**
     * Executa código apenas no navegador
     */
    protected runInBrowser<T>(fn: () => T): T | undefined {
        return this.platformService.runInBrowser(fn);
    }

    /**
     * Executa código assíncrono apenas no navegador
     */
    protected async runInBrowserAsync<T>(fn: () => Promise<T>): Promise<T | undefined> {
        return this.platformService.runInBrowserAsync(fn);
    }
}

import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { PlatformService } from './platform.service';

describe('PlatformService', () => {
    let service: PlatformService;

    describe('Browser Platform', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    { provide: PLATFORM_ID, useValue: 'browser' }
                ]
            });
            service = TestBed.inject(PlatformService);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should identify browser platform', () => {
            expect(service.isBrowserPlatform).toBe(true);
            expect(service.isServerPlatform).toBe(false);
        });

        it('should execute function in browser', () => {
            const result = service.runInBrowser(() => 'test');
            expect(result).toBe('test');
        });

        it('should not execute function in server', () => {
            const result = service.runInServer(() => 'test');
            expect(result).toBeUndefined();
        });
    });

    describe('Server Platform', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    { provide: PLATFORM_ID, useValue: 'server' }
                ]
            });
            service = TestBed.inject(PlatformService);
        });

        it('should identify server platform', () => {
            expect(service.isBrowserPlatform).toBe(false);
            expect(service.isServerPlatform).toBe(true);
        });

        it('should not execute function in browser', () => {
            const result = service.runInBrowser(() => 'test');
            expect(result).toBeUndefined();
        });

        it('should execute function in server', () => {
            const result = service.runInServer(() => 'test');
            expect(result).toBe('test');
        });

        it('should return null for sessionStorage in server', () => {
            const result = service.getSessionStorage('test');
            expect(result).toBeNull();
        });

        it('should return null for localStorage in server', () => {
            const result = service.getLocalStorage('test');
            expect(result).toBeNull();
        });
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DashboardShellComponent } from './dashboard-shell.component';

describe('DashboardShellComponent', () => {
    let component: DashboardShellComponent;
    let fixture: ComponentFixture<DashboardShellComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardShellComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardShellComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DashboardHomeComponent } from './dashboard-home.component';

describe('DashboardHomeComponent', () => {
    let component: DashboardHomeComponent;
    let fixture: ComponentFixture<DashboardHomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardHomeComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

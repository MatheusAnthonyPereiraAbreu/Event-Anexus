import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ParticipantDashboardComponent } from './participant-dashboard.component';

describe('ParticipantDashboardComponent', () => {
    let component: ParticipantDashboardComponent;
    let fixture: ComponentFixture<ParticipantDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ParticipantDashboardComponent, RouterOutlet],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ParticipantDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

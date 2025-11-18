import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EditEventComponent } from './edit-event.component';

describe('EditEventComponent', () => {
    let component: EditEventComponent;
    let fixture: ComponentFixture<EditEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditEventComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EditEventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

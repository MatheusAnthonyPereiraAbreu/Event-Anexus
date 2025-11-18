import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render button element', () => {
        const compiled = fixture.nativeElement;
        const button = compiled.querySelector('button');
        expect(button).toBeTruthy();
    });

    it('should have default properties', () => {
        expect(component.label).toBe('');
        expect(component.disabled).toBeFalse();
    });
});

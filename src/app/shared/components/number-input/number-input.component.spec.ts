import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberInputComponent } from './number-input.component';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

describe('NumberInputComponent', () => {
    let component: NumberInputComponent;
    let fixture: ComponentFixture<NumberInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NumberInputComponent, FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(NumberInputComponent);
        component = fixture.componentInstance;
        component.control = new FormControl(0);
        component.name = 'test-number';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render number input element', () => {
        const compiled = fixture.nativeElement;
        const input = compiled.querySelector('input[type="number"]');
        expect(input).toBeTruthy();
    });

    it('should have default min and max', () => {
        expect(component.min).toBeUndefined();
        expect(component.max).toBeUndefined();
    });
});

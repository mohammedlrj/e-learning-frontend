import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { Student } from '../shared/models/student.model';
import { Professor } from '../shared/models/professor.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  step: number = 1; // Step 1: Email, password, confirm password
  registerForm!: FormGroup; // Master form group
  step1Form!: FormGroup; // Step 1 form (email, password, confirm password)
  step2Form!: FormGroup; // Step 2 form (role selection)
  step3Form!: FormGroup; // Step 3 form (role-specific details)

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService
  ) {  }

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    // Step 1: Email, password, confirm password
    this.step1Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: this.passwordMatchValidator });

    // Step 2: Choose role (professor or student)
    this.step2Form = this.fb.group({
      role: ['', [Validators.required]]
    });

    // Step 3: Dynamic fields for professor or student (based on role)
    this.step3Form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],  // Assuming 10-digit phone numbers
      gender: ['', [Validators.required]],
      cin: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{5,10}$')]],  // Example CIN pattern
      profilePicture: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      // Professor-specific fields
      degree: [''],
      fieldOfExpertise: [''],
      yearsOfExperience: [''],
      // Student-specific fields
      major: [''],
      level: ['']
    });

    // Master form group to track all form values
    this.registerForm = this.fb.group({
      step1: this.step1Form,
      step2: this.step2Form,
      step3: this.step3Form
    });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword 
      ? { 'mismatch': true } 
      : null;
  }

  // Navigate to next step
  nextStep() {
    if (this.step === 1 && this.step1Form.valid) {
      this.step = 2;
    } else if (this.step === 2 && this.step2Form.valid) {
      this.step = 3;
    } else if (this.step === 3 && this.step3Form.valid) {
      this.submitRegistration();
    }
  }

  // Navigate to previous step
  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  // Submit the registration
  submitRegistration() {
    if (this.step2Form.value.role === 'professor') {
      const professorData: Professor = {
        email: this.step1Form.value.email,
        password: this.step1Form.value.password,
        confirmPassword: this.step1Form.value.confirmPassword,
        ...this.step3Form.value
      };
      this.authService.registerProfessor(professorData).subscribe({
        next: (response: any) => {
          console.log('Professor registered successfully', response);
          // You can redirect to login page or other action
        },
        error: (err) => {
          console.error('Error registering professor:', err);
        }
      });
    } else if (this.step2Form.value.role === 'student') {
      const studentData: Student = {
        email: this.step1Form.value.email,
        password: this.step1Form.value.password,
        confirmPassword: this.step1Form.value.confirmPassword,
        ...this.step3Form.value
      };
      this.authService.registerStudent(studentData).subscribe({
        next: (response: any) => {
          console.log('Student registered successfully', response);
          // You can redirect to login page or other action
        },
        error: (err) => {
          console.error('Error registering student:', err);
        }
      });
    }
  }

  // This method checks whether to show professor-specific or student-specific fields
  get isProfessor() {
    return this.step2Form.value.role === 'professor';
  }

  get isStudent() {
    return this.step2Form.value.role === 'student';
  }

  onRoleSelect() {
    if (this.step2Form.valid) {
      this.step = 3;
    }
  }

}

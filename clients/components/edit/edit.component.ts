import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  computed,
  inject,
  DestroyRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';

import { Client, ClientCategorie } from '@app/shared/utils/interfaces';
import { ClientService } from '@app/shared/services/apis/sales/client.api';
import { ClientCategorieApi } from '@app/shared/services/apis/settings/client-categorie.api';
import { ErrorHandlerService, ValidationError } from '@app/core/services/error-handler.service';
import { FormValidationService, SectionCardComponent } from '@app/shared';
import { EditGeneralComponent } from '@app/shared/components/edit-general/edit-general.component';
import { FormConstants } from '@app/shared/services/form-constant';

@Component({
  selector: 'app-client-master-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SectionCardComponent,
    DropdownModule,
    SelectButtonModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {
  private clientService = inject(ClientService);
  private categorieService = inject(ClientCategorieApi);
  private errorHandler = inject(ErrorHandlerService);
  private formValidation = inject(FormValidationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private formConstants = inject(FormConstants);
  @ViewChild(EditGeneralComponent) editGeneralComponent!: EditGeneralComponent;

  form!: FormGroup;

  clientForm!: FormGroup;
  submitted = signal<boolean>(false);
  validationErrors = signal<ValidationError>({});
  categories = signal<ClientCategorie[]>([]);
  readonly isEditMode = computed(() => !!this.route.snapshot.paramMap.get('id'));
  defaultOptions = [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 },
  ];

  ngOnInit(): void {
    this.form = this.formConstants.initializeForm();
    this.initializeForm();
    this.loadCategories();
    if (this.isEditMode()) {
      this.loadClient();
    }
  }

  private initializeForm(): void {
    this.clientForm = this.fb.group({
      CLIENT_ID: [null],
      CLIENT_CODE: ['', [Validators.required, Validators.maxLength(50)]],
      NOM: ['', [Validators.required, Validators.maxLength(100)]],
      NOM2: ['', [Validators.maxLength(100)]],
      ADRESSE: ['', [Validators.maxLength(255)]],
      VILLE: ['', [Validators.maxLength(100)]],
      TEL: ['', [Validators.maxLength(50)]],
      GSM: ['', [Validators.maxLength(50)]],
      FAXE: ['', [Validators.maxLength(50)]],
      CONTACT: ['', [Validators.maxLength(100)]],
      MAIL: ['', [Validators.email, Validators.maxLength(100)]],
      LOGO: [null],
      IF: ['', [Validators.maxLength(50)]],
      PATENTE: ['', [Validators.maxLength(50)]],
      RC: ['', [Validators.maxLength(50)]],
      CNSS: ['', [Validators.maxLength(50)]],
      SEUIL_CREDIT: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      OLD_CREDIT: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      CLIENT_CATEGORIE_ID: [null, [Validators.required]],
      INS_USER: [''],
      INS_DATE: [''],
      UPD_USER: [''],
      UPD_DATE: [''],
      DEFAUT: [0, [Validators.required]],
      ACTIF: [1, [Validators.required]],
      ICE: ['', [Validators.maxLength(50)]],
      VendorId: [null],
      CONTACT_ID: [null],
      IS_CONFRERE: [null],
    });
  }

  private loadCategories(): void {
    this.categorieService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => this.categories.set(data.data),
        error: err => this.errorHandler.handleApiError(err, 'Failed to load client categories'),
      });
  }

  private loadClient(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.clientService
        .getById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: client => this.clientForm.patchValue(client),
          error: error => {
            this.errorHandler.handleApiError(error, 'Failed to load client details');
            this.router.navigate(['/sales/clients']);
          },
        });
    }
  }

  save(): void {
    this.submitted.set(true);
    this.validationErrors.set({});

    if (!this.editGeneralComponent.validateChildForm()) {
      return; // stop if invalid
    }

    if (!this.formValidation.validateForm(this.clientForm)) {
      this.errorHandler.showError('Please fill in all required fields');
      return;
    }

    const formValue: Client = this.clientForm.value;
    const operation = this.isEditMode()
      ? this.clientService.update(formValue)
      : this.clientService.add(formValue);

    operation.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        const msg = this.isEditMode()
          ? 'Client Updated Successfully'
          : 'Client Created Successfully';
        this.errorHandler.showSuccess(msg);
        this.router.navigate(['/sales/clients']);
      },
      error: error => {
        const validationErrors = this.errorHandler.handleApiError(error, 'Failed to save client');
        if (validationErrors) {
          this.validationErrors.set(validationErrors);
        }
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/sales/clients']);
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formValidation.isFieldInvalid(
      this.clientForm,
      fieldName,
      this.validationErrors(),
      this.submitted()
    );
  }

  getFieldError(fieldName: string): string | null {
    return this.formValidation.getFieldErrorMessage(
      this.clientForm,
      fieldName,
      this.validationErrors()
    );
  }
}

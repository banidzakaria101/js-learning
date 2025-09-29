import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  signal,
  computed,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { Client } from '@app/shared/utils/interfaces';
import { ClientService } from '@app/shared/services/apis/sales/client.api';
import { ErrorHandlerService } from '@app/core/services/error-handler.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    TooltipModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  private clientService = inject(ClientService);
  private errorHandler = inject(ErrorHandlerService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  clients = signal<Client[]>([]);
  isLoading = signal<boolean>(false);
  selectedClients = signal<Client[]>([]);

  readonly hasSelectedClients = computed(() => this.selectedClients().length > 0);
  readonly hasOnlyOneSelectedClient = computed(() => this.selectedClients().length === 1);

  @ViewChild('dt') dt!: Table;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading.set(true);
    this.clientService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.clients.set(data.data);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorHandler.handleApiError(error, 'Failed to load clients');
          this.isLoading.set(false);
        },
      });
  }

  applyGlobalFilter(event: Event): void {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.router.navigate(['/sales/clients/add']);
  }

  addCommandeForClient(client: Client): void {
    this.router.navigate(['/sales/commandes/add'], {
      queryParams: { clientId: client.CLIENT_ID },
    });
  }

  // New method to edit the single selected client
  editSelectedClient(): void {
    const selected = this.selectedClients();
    if (selected.length === 1) {
      this.router.navigate(['/sales/clients/edit', selected[0].CLIENT_ID]);
    }
  }

  // Renamed method for consistency
  deleteSelectedClients(): void {
    const selected = this.selectedClients();
    if (selected.length === 0) return;
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the ${selected.length} selected clients?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deleteRequests = selected.map((c) =>
          this.clientService.delete(c.CLIENT_ID)
        );
        forkJoin(deleteRequests)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.errorHandler.showSuccess(
                `${selected.length} clients deleted successfully`
              );
              this.selectedClients.set([]);
              this.loadClients();
            },
            error: (err) =>
              this.errorHandler.handleApiError(
                err,
                'Failed to delete selected clients'
              ),
          });
      },
    });
  }
}
import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [DatePipe, NgClass],
  template: `
    <div class="max-w-4xl mx-auto p-6 mt-6">
      <div class="flex items-center gap-3 mb-8">
        <div class="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-800">Ваші сповіщення</h2>
      </div>

      <div class="space-y-4">
        @for (notification of notifications; track notification.id) {
          <div
            class="p-5 rounded-xl border transition-all duration-200 shadow-sm flex justify-between items-start"
            [ngClass]="notification.is_viewed ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-200'">

            <div class="flex-1">
              <p class="text-gray-800 text-lg mb-2">{{ notification.message }}</p>
              <p class="text-sm text-gray-500 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {{ notification.sent_at | date:'short' }}
              </p>
            </div>

            @if (!notification.is_viewed) {
              <button
                (click)="markAsRead(notification)"
                class="ml-4 px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium transition-colors">
                Помітити як прочитане
              </button>
            } @else {
              <span class="ml-4 text-sm font-medium text-gray-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Прочитано
              </span>
            }
          </div>
        } @empty {
          <div class="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p class="text-gray-500 text-lg">У вас поки немає нових сповіщень.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class NotificationListComponent implements OnInit {
  private notificationService = inject(NotificationService);
  notifications: any[] = [];

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(res => {
      this.notifications = res;
    });
  }

  markAsRead(notification: any) {
    this.notificationService.markAsViewed(notification.id).subscribe(() => {
      notification.is_viewed = true;
    });
  }
}

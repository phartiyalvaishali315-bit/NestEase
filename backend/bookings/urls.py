from django.urls import path
from .views import BookingListView, BookingDetailView, CompleteBookingView, CreateBookingView

urlpatterns = [
    path('',              BookingListView.as_view(),    name='booking-list'),
    path('create/',       CreateBookingView.as_view(),  name='booking-create'),
    path('<uuid:pk>/',    BookingDetailView.as_view(),  name='booking-detail'),
    path('<uuid:pk>/complete/', CompleteBookingView.as_view(), name='booking-complete'),
]
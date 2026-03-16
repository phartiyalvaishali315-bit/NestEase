from django.urls import path
from .views import BookingListView, BookingDetailView, CreateBookingView

urlpatterns = [
    path('',           BookingListView.as_view(),   name='booking-list'),
    path('create/',    CreateBookingView.as_view(),  name='create-booking'),
    path('<uuid:pk>/', BookingDetailView.as_view(),  name='booking-detail'),
]
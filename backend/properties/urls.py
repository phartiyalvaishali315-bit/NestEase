from django.urls import path
from .views import (
    PropertyListView, PropertyCreateView, PropertyDetailView,
    MyPropertiesView, ToggleAvailabilityView,
    PropertyAdminView, PropertyAdminReviewView, MediaUploadView
)

urlpatterns = [
    path('',                          PropertyListView.as_view(),       name='property-list'),
    path('create/',                   PropertyCreateView.as_view(),     name='property-create'),
    path('mine/',                     MyPropertiesView.as_view(),       name='my-properties'),
    path('admin/pending/',            PropertyAdminView.as_view(),      name='property-admin'),
    path('admin/<uuid:pk>/review/',   PropertyAdminReviewView.as_view(), name='property-review'),
    path('<uuid:pk>/',                PropertyDetailView.as_view(),     name='property-detail'),
    path('<uuid:pk>/toggle/',         ToggleAvailabilityView.as_view(), name='property-toggle'),
    path('<uuid:pk>/media/',          MediaUploadView.as_view(),        name='property-media'),
]
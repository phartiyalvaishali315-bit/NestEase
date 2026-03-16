from django.urls import path
from .views import SubmitReviewView, PropertyReviewsView

urlpatterns = [
    path('',              SubmitReviewView.as_view(),    name='submit-review'),
    path('property/<uuid:pk>/', PropertyReviewsView.as_view(), name='property-reviews'),
]
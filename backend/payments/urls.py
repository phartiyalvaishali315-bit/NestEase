from django.urls import path
from .views import (
    InitiatePaymentView, PayView,
    ReleasePaymentView, MyPaymentsView, EscrowOverviewView
)

urlpatterns = [
    path('initiate/',        InitiatePaymentView.as_view(), name='initiate-payment'),
    path('<uuid:pk>/pay/',   PayView.as_view(),             name='pay'),
    path('<uuid:pk>/action/',ReleasePaymentView.as_view(),  name='release-payment'),
    path('mine/',            MyPaymentsView.as_view(),      name='my-payments'),
    path('admin/escrow/',    EscrowOverviewView.as_view(),  name='escrow-overview'),
]
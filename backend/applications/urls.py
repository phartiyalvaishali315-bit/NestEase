from django.urls import path
from .views import (
    ApplyView, MyApplicationsView,
    ReceivedApplicationsView, ReviewApplicationView,
    WithdrawApplicationView
)

urlpatterns = [
    path('',                    ApplyView.as_view(),               name='apply'),
    path('mine/',               MyApplicationsView.as_view(),      name='my-applications'),
    path('received/',           ReceivedApplicationsView.as_view(),name='received-applications'),
    path('<uuid:pk>/review/',   ReviewApplicationView.as_view(),   name='review-application'),
    path('<uuid:pk>/withdraw/', WithdrawApplicationView.as_view(), name='withdraw-application'),
]
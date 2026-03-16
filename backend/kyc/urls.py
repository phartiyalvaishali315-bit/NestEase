from django.urls import path
from .views import KYCUploadView, KYCAdminView, KYCApproveView

urlpatterns = [
    path('',              KYCUploadView.as_view(),  name='kyc-upload'),
    path('admin/',        KYCAdminView.as_view(),   name='kyc-admin'),
    path('<uuid:pk>/review/', KYCApproveView.as_view(), name='kyc-approve'),
]
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import SendOTPView, VerifyOTPView, ProfileView, UserListView

urlpatterns = [
    path('send-otp/',      SendOTPView.as_view(),   name='send-otp'),
    path('verify-otp/',    VerifyOTPView.as_view(),  name='verify-otp'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('me/',            ProfileView.as_view(),    name='profile'),
    path('users/',         UserListView.as_view(),   name='user-list'),
]
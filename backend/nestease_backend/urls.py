from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/',              admin.site.urls),
    path('api/auth/',           include('accounts.urls')),
    path('api/kyc/',            include('kyc.urls')),
    path('api/properties/',     include('properties.urls')),
    path('api/applications/',   include('applications.urls')),
    path('api/bookings/',       include('bookings.urls')),
    path('api/payments/',       include('payments.urls')),
    path('api/reviews/',        include('reviews.urls')),
    path('api/chat/',           include('chat.urls')),
]
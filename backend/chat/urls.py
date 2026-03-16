from django.urls import path
from .views import GetOrCreateChatRoom, SendMessageView, MarkReadView

urlpatterns = [
    path('room/<uuid:app_id>/',       GetOrCreateChatRoom.as_view(), name='chat-room'),
    path('<uuid:room_id>/send/',      SendMessageView.as_view(),     name='send-message'),
    path('<uuid:room_id>/read/',      MarkReadView.as_view(),        name='mark-read'),
]
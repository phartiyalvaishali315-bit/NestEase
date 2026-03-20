from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatRoom, Message
from applications.models import Application


class GetOrCreateChatRoom(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, app_id):
        try:
            app = Application.objects.get(id=app_id)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=404)

        room, _ = ChatRoom.objects.get_or_create(
            application=app,
            defaults={
                'owner':  app.property.owner,
                'tenant': app.tenant
            }
        )

        messages = Message.objects.filter(room=room).order_by('sent_at')
        messages_data = [{
            'id':         str(m.id),
            'sender':     str(m.sender.id),
            'text':       m.text,
            'is_read':    m.is_read,
            'created_at': m.sent_at.isoformat(),
        } for m in messages]

        return Response({
            'id':       str(room.id),
            'messages': messages_data,
        })


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return Response({'error': 'Room not found'}, status=404)

        msg = Message.objects.create(
            room=room,
            sender=request.user,
            text=request.data.get('text', '')
        )
        return Response({
            'id':         str(msg.id),
            'sender':     str(msg.sender.id),
            'text':       msg.text,
            'created_at': msg.sent_at.isoformat(),
        })


class MarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, room_id):
        Message.objects.filter(
            room_id=room_id
        ).exclude(sender=request.user).update(is_read=True)
        return Response({'status': 'marked read'})
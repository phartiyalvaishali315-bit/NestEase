from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Application
from .serializers import ApplicationSerializer
from accounts.permissions import IsOwner, IsTenant

class ApplyView(generics.CreateAPIView):
    serializer_class   = ApplicationSerializer
    permission_classes = [IsTenant]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)

class MyApplicationsView(generics.ListAPIView):
    serializer_class   = ApplicationSerializer
    permission_classes = [IsTenant]

    def get_queryset(self):
        return Application.objects.filter(tenant=self.request.user)

class ReceivedApplicationsView(generics.ListAPIView):
    serializer_class   = ApplicationSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return Application.objects.filter(
            property__owner=self.request.user
        )

class ReviewApplicationView(APIView):
    permission_classes = [IsOwner]

    def patch(self, request, pk):
        try:
            app = Application.objects.get(
                id=pk, property__owner=request.user
            )
        except Application.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        action = request.data.get('action')
        if action == 'approve':
            app.status      = 'approved'
            app.reviewed_at = timezone.now()
            app.save()
            return Response({'message': 'Application approved!'})
        elif action == 'reject':
            app.status           = 'rejected'
            app.rejection_reason = request.data.get('reason', '')
            app.reviewed_at      = timezone.now()
            app.save()
            return Response({'message': 'Application rejected!'})
        return Response({'error': 'Invalid action'}, status=400)

class WithdrawApplicationView(APIView):
    permission_classes = [IsTenant]

    def delete(self, request, pk):
        try:
            app = Application.objects.get(id=pk, tenant=request.user)
            app.status = 'withdrawn'
            app.save()
            return Response({'message': 'Application withdrawn!'})
        except Application.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import KYCDetail
from .serializers import KYCSerializer
from accounts.permissions import IsAdmin
from accounts.models import User

class KYCUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Pehle se KYC hai?
        if KYCDetail.objects.filter(user=request.user).exists():
            return Response({'error': 'KYC already submitted'}, status=400)
        serializer = KYCSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({
                'message': 'KYC submitted successfully! Admin will verify soon.',
                'data': serializer.data
            }, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        try:
            kyc = KYCDetail.objects.get(user=request.user)
            return Response(KYCSerializer(kyc).data)
        except KYCDetail.DoesNotExist:
            return Response({'status': 'not_submitted'})


class KYCAdminView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        # Pending KYC list
        kycs = KYCDetail.objects.filter(status='pending')
        return Response(KYCSerializer(kycs, many=True).data)


class KYCApproveView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            kyc = KYCDetail.objects.get(id=pk)
        except KYCDetail.DoesNotExist:
            return Response({'error': 'KYC not found'}, status=404)

        action = request.data.get('action')  # 'approve' or 'reject'

        if action == 'approve':
            kyc.status = 'approved'
            kyc.verified_by = request.user
            kyc.verified_at = timezone.now()
            kyc.save()
            # User ka KYC verified mark karo
            kyc.user.is_kyc_verified = True
            kyc.user.save()
            return Response({'message': 'KYC approved!'})

        elif action == 'reject':
            reason = request.data.get('reason', 'Documents not clear')
            kyc.status = 'rejected'
            kyc.rejection_reason = reason
            kyc.save()
            return Response({'message': 'KYC rejected!'})

        return Response({'error': 'Invalid action'}, status=400)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import KYCDetail
from .serializers import KYCSerializer


class KYCUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            kyc = KYCDetail.objects.get(user=request.user)
            return Response(KYCSerializer(kyc).data)
        except KYCDetail.DoesNotExist:
            return Response({'status': 'not_submitted'})

    def post(self, request):
        try:
            kyc = KYCDetail.objects.get(user=request.user)
        except KYCDetail.DoesNotExist:
            kyc = None

        serializer = KYCSerializer(kyc, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user, status='pending')
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class KYCAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        kycs = KYCDetail.objects.filter(status='pending').order_by('-submitted_at')
        return Response(KYCSerializer(kycs, many=True).data)


class KYCApproveView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        try:
            kyc    = KYCDetail.objects.get(id=pk)
            action = request.data.get('action')
            reason = request.data.get('reason', '')

            if action == 'approve':
                kyc.status      = 'approved'
                kyc.verified_by = request.user
                kyc.save()
                # Auto verify user
                kyc.user.is_kyc_verified = True
                kyc.user.save()

            elif action == 'reject':
                kyc.status           = 'rejected'
                kyc.rejection_reason = reason
                kyc.save()
                kyc.user.is_kyc_verified = False
                kyc.user.save()

            return Response(KYCSerializer(kyc).data)
        except KYCDetail.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
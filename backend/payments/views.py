from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer
from .escrow import EscrowService
from bookings.models import Booking


class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        try:
            booking = Booking.objects.get(id=booking_id, tenant=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)

        payment = EscrowService.initiate(booking, request.user)
        return Response(PaymentSerializer(payment).data)


class PayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            payment = Payment.objects.get(id=pk, payer=request.user)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=404)

        payment = EscrowService.pay(payment)
        return Response(PaymentSerializer(payment).data)


class ReleasePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        try:
            payment = Payment.objects.get(id=pk)
        except Payment.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        action = request.data.get('action')
        if action == 'release':
            payment = EscrowService.release(payment)
        elif action == 'refund':
            payment = EscrowService.refund(payment)

        return Response(PaymentSerializer(payment).data)


class MyPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(
            payer=request.user
        ).order_by('-created_at')
        return Response(PaymentSerializer(payments, many=True).data)


class EscrowOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        payments = Payment.objects.filter(
            escrow_status='held'
        ).order_by('-created_at')
        return Response(PaymentSerializer(payments, many=True).data)
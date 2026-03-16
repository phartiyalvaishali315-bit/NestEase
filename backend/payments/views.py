from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer
from .escrow import EscrowService
from bookings.models import Booking
from accounts.permissions import IsOwner, IsAdmin

class InitiatePaymentView(APIView):
    permission_classes = [IsOwner]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        try:
            booking = Booking.objects.get(
                id=booking_id, owner=request.user
            )
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)
        payment = EscrowService.initiate(booking)
        return Response(PaymentSerializer(payment).data, status=201)

class PayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            payment = Payment.objects.get(
                id=pk,
                payer=request.user,
                escrow_status='pending_payment'
            )
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=404)
        payment = EscrowService.pay(payment)
        return Response({
            'message': 'Payment successful! Funds held in escrow.',
            'data': PaymentSerializer(payment).data
        })

class ReleasePaymentView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            payment = Payment.objects.get(id=pk, escrow_status='held')
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=404)
        action = request.data.get('action')
        if action == 'release':
            EscrowService.release(payment, request.user)
            return Response({'message': 'Payment released to owner!'})
        elif action == 'refund':
            EscrowService.refund(payment, request.user)
            return Response({'message': 'Payment refunded to tenant!'})
        return Response({'error': 'Invalid action'}, status=400)

class MyPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(payer=request.user)
        return Response(PaymentSerializer(payments, many=True).data)

class EscrowOverviewView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        payments = Payment.objects.filter(escrow_status='held')
        return Response(PaymentSerializer(payments, many=True).data)
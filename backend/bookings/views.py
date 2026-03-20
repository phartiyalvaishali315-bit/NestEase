from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking
from .serializers import BookingSerializer


class BookingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'owner':
            bookings = Booking.objects.filter(
                owner=request.user
            ).order_by('-created_at')
        else:
            bookings = Booking.objects.filter(
                tenant=request.user
            ).order_by('-created_at')
        return Response(BookingSerializer(bookings, many=True).data)


class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            booking = Booking.objects.get(id=pk)
            return Response(BookingSerializer(booking).data)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class CreateBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response(
            {'error': 'Booking is auto-created when application is approved'},
            status=400
        )
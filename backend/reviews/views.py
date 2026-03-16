from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Review
from .serializers import ReviewSerializer
from bookings.models import Booking
from accounts.permissions import IsTenant

class SubmitReviewView(APIView):
    permission_classes = [IsTenant]

    def post(self, request):
        booking_id = request.data.get('booking')
        try:
            booking = Booking.objects.get(
                id=booking_id,
                tenant=request.user,
                status='active'
            )
        except Booking.DoesNotExist:
            return Response(
                {'error': 'No confirmed booking found'},
                status=404
            )
        if Review.objects.filter(booking=booking).exists():
            return Response({'error': 'Review already submitted'}, status=400)

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                reviewer=request.user,
                property=booking.property
            )
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class PropertyReviewsView(generics.ListAPIView):
    serializer_class   = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Review.objects.filter(
            property_id=self.kwargs['pk'],
            is_visible=True
        )
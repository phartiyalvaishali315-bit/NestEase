from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Review
from .serializers import ReviewSerializer
from bookings.models import Booking


class SubmitReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking')
        try:
            booking = Booking.objects.get(id=booking_id, tenant=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)

        if Review.objects.filter(booking=booking).exists():
            return Response({'error': 'Already reviewed'}, status=400)

        data = {
            'booking':         booking.id,
            'reviewer':        request.user.id,
            'property':        booking.property.id,
            'rating':          request.data.get('rating', 5),
            'cleanliness':     request.data.get('cleanliness', 5),
            'owner_behaviour': request.data.get('owner_behaviour', 5),
            'value_for_money': request.data.get('value_for_money', 5),
            'comment':         request.data.get('comment', ''),
        }
        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class PropertyReviewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        reviews = Review.objects.filter(
            property_id=pk
        ).order_by('-created_at')
        return Response(ReviewSerializer(reviews, many=True).data)
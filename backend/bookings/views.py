from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking
from .serializers import BookingSerializer
from applications.models import Application
from accounts.permissions import IsOwner

class BookingListView(generics.ListAPIView):
    serializer_class   = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'owner':
            return Booking.objects.filter(owner=user)
        return Booking.objects.filter(tenant=user)

class BookingDetailView(generics.RetrieveAPIView):
    serializer_class   = BookingSerializer
    permission_classes = [IsAuthenticated]
    queryset           = Booking.objects.all()

class CreateBookingView(APIView):
    permission_classes = [IsOwner]

    def post(self, request):
        app_id = request.data.get('application_id')
        try:
            app = Application.objects.get(
                id=app_id,
                property__owner=request.user,
                status='approved'
            )
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=404)

        if Booking.objects.filter(application=app).exists():
            return Response({'error': 'Booking already exists'}, status=400)

        advance = app.property.monthly_rent * 0.5
        booking = Booking.objects.create(
            application   = app,
            property      = app.property,
            owner         = request.user,
            tenant        = app.tenant,
            start_date    = app.move_in_date,
            monthly_rent  = app.property.monthly_rent,
            advance_amount= advance,
        )
        return Response(BookingSerializer(booking).data, status=201)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .serializers import ApplicationSerializer
from bookings.models import Booking
import random
import string


def generate_booking_ref():
    digits = ''.join(random.choices(string.digits, k=8))
    return f'NE{digits}'


class ApplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'tenant':
            return Response({'error': 'Only tenants can apply'}, status=403)
        if not request.user.is_kyc_verified:
            return Response({'error': 'Complete KYC first'}, status=403)

        property_id  = request.data.get('property')
        move_in_date = request.data.get('move_in_date')
        message      = request.data.get('message', '')

        from properties.models import Property
        try:
            prop = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({'error': 'Property not found'}, status=404)

        if Application.objects.filter(property=prop, tenant=request.user).exists():
            return Response({'error': 'Already applied'}, status=400)

        app = Application.objects.create(
            property=prop,
            tenant=request.user,
            move_in_date=move_in_date,
            message=message,
        )
        return Response(ApplicationSerializer(app).data, status=201)


class MyApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        apps = Application.objects.filter(
            tenant=request.user
        ).order_by('-created_at')
        return Response(ApplicationSerializer(apps, many=True).data)


class ReceivedApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        apps = Application.objects.filter(
            property__owner=request.user
        ).order_by('-created_at')
        return Response(ApplicationSerializer(apps, many=True).data)


class ReviewApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            app = Application.objects.get(id=pk, property__owner=request.user)
        except Application.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        action = request.data.get('action')
        reason = request.data.get('reason', '')

        if action == 'approve':
            app.status = 'approved'
            app.save()
            if not Booking.objects.filter(application=app).exists():
                advance = float(app.property.monthly_rent) * 0.5
                Booking.objects.create(
                    application=app,
                    property=app.property,
                    owner=app.property.owner,
                    tenant=app.tenant,
                    start_date=app.move_in_date,
                    monthly_rent=app.property.monthly_rent,
                    advance_amount=advance,
                    booking_ref=generate_booking_ref(),
                    status='confirmed',
                )
        elif action == 'reject':
            app.status = 'rejected'
            app.rejection_reason = reason
            app.save()

        return Response(ApplicationSerializer(app).data)


class WithdrawApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            app = Application.objects.get(id=pk, tenant=request.user)
            app.status = 'withdrawn'
            app.save()
            return Response({'message': 'Withdrawn'})
        except Application.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
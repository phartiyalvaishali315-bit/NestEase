from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property, PropertyMedia
from .serializers import PropertySerializer
from .filters import PropertyFilter
import math


def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))


class PropertyListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Property.objects.filter(
            admin_status='approved',
            availability='available'
        ).order_by('-created_at')

        f = PropertyFilter(request.query_params, queryset=qs)
        qs = f.qs

        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = float(request.query_params.get('radius', 10))

        if lat and lng:
            try:
                lat, lng = float(lat), float(lng)
                filtered = []
                for p in qs:
                    if p.latitude and p.longitude:
                        d = haversine(lat, lng, float(p.latitude), float(p.longitude))
                        if d <= radius:
                            filtered.append(p)
                qs = filtered
            except Exception:
                pass

        serializer = PropertySerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)


class PropertyCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if request.user.role != 'owner':
            return Response({'error': 'Only owners can list properties'}, status=403)
        if not request.user.is_kyc_verified:
            return Response({'error': 'Complete KYC first'}, status=403)
        serializer = PropertySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class PropertyDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            p = Property.objects.get(id=pk)
            return Response(PropertySerializer(p, context={'request': request}).data)
        except Property.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class MyPropertiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        props = Property.objects.filter(owner=request.user).order_by('-created_at')
        return Response(PropertySerializer(props, many=True, context={'request': request}).data)


class ToggleAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            p = Property.objects.get(id=pk, owner=request.user)
            p.availability = 'engaged' if p.availability == 'available' else 'available'
            p.save()
            return Response(PropertySerializer(p, context={'request': request}).data)
        except Property.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class PropertyAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        props = Property.objects.filter(admin_status='pending').order_by('-created_at')
        return Response(PropertySerializer(props, many=True, context={'request': request}).data)


class PropertyAdminReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        try:
            p = Property.objects.get(id=pk)
            action = request.data.get('action')
            if action == 'approve':
                p.admin_status = 'approved'
            elif action == 'reject':
                p.admin_status = 'rejected'
            p.save()
            return Response(PropertySerializer(p, context={'request': request}).data)
        except Property.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class MediaUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            p = Property.objects.get(id=pk, owner=request.user)
        except Property.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        files = request.FILES.getlist('images')
        for f in files:
            PropertyMedia.objects.create(property=p, image=f)
        return Response({'message': f'{len(files)} images uploaded'})
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, OTPToken
from .serializers import UserSerializer, RegisterSerializer
from .utils import generate_otp, verify_otp


class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        mobile  = request.data.get('mobile')
        purpose = request.data.get('purpose', 'login')
        role    = request.data.get('role', 'tenant')

        if not mobile:
            return Response({'error': 'Mobile number required'}, status=400)

        if len(str(mobile)) != 10:
            return Response({'error': 'Invalid mobile number'}, status=400)

        generate_otp(mobile, purpose)
        return Response({'message': f'OTP sent to {mobile}'})


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        mobile  = request.data.get('mobile')
        otp     = request.data.get('otp')
        purpose = request.data.get('purpose', 'login')
        role    = request.data.get('role', 'tenant')

        if not mobile or not otp:
            return Response({'error': 'Mobile and OTP required'}, status=400)

        if not verify_otp(mobile, otp, purpose):
            return Response({'error': 'Invalid or expired OTP'}, status=400)

        user, created = User.objects.get_or_create(
            mobile=mobile,
            defaults={'role': role, 'is_mobile_verified': True}
        )

        if not created:
            user.is_mobile_verified = True
            user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'access':       str(refresh.access_token),
            'refresh':      str(refresh),
            'user':         UserSerializer(user).data,
            'is_new_user':  created,
        })


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        users = User.objects.all().order_by('-date_joined')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
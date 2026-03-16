import django_filters
from .models import Property

class PropertyFilter(django_filters.FilterSet):
    min_rent = django_filters.NumberFilter(field_name='monthly_rent', lookup_expr='gte')
    max_rent = django_filters.NumberFilter(field_name='monthly_rent', lookup_expr='lte')

    class Meta:
        model   = Property
        fields  = [
            'city', 'property_type', 'sharing_type',
            'is_women_only', 'is_pet_friendly',
            'bathroom_type', 'has_kitchen',
        ]
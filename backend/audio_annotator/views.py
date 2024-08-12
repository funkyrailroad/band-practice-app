from rest_framework import mixins, viewsets

from .models import AudioAnnotation
from .serializers import AudioAnnotationSerializer


class AudioAnnotationViewSet(
    viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin
):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = AudioAnnotation.objects.all()
    serializer_class = AudioAnnotationSerializer

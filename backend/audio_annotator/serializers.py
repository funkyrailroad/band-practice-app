from rest_framework import serializers

from .models import AudioAnnotation


class AudioAnnotationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AudioAnnotation
        fields = [
            # "url",
            "annotation",
            "created_at",
            "created_by",
        ]

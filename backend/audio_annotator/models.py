from django.db import models

# Create your models here.
class AudioAnnotation(models.Model):
    audio = models.FileField(upload_to='audio/', blank=True)
    annotation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.TextField()

    def __str__(self):
        return self.text

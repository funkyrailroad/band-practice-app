from rest_framework.test import APIRequestFactory, APITestCase

from .views import AudioAnnotationViewSet


class TestCreate(APITestCase):
    def test_create_with_factory(self):
        factory = APIRequestFactory()
        request = factory.post(
            "/api/annotations/",
            {
                "annotation": "Here's a test annotation.",
                "created_by": "Jake",
            },
            format="json",
        )
        view = AudioAnnotationViewSet.as_view({"post": "create"})
        response = view(request)
        response.render()

    def test_create_and_list_with_client(self):
        resp = self.client.post(
            "/api/annotations/",
            {
                "annotation": "Here's a test annotation.",
                "created_by": "Jake",
            },
        )
        self.assertEqual(resp.status_code, 201)

        resp = self.client.get("/api/annotations/")
        self.assertEqual(resp.status_code, 200)

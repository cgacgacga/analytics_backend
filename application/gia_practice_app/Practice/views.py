from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema
from rest_framework import viewsets, filters, status, mixins, generics
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from gia_practice_app.Practice.models import Practice, PracticeTemplate, PrerequisitesOfPractice, OutcomesOfPractice, \
    ZunPractice
from gia_practice_app.Practice.serializers import PracticeSerializer, PracticeTemplateSerializer, \
    PracticePrimitiveSerializer, ItemInPracticeCreateSerializer, OutcomesInPracticeCreateSerializer, \
    PracticeInFieldOfStudyCreateSerializer, ZunPracticeForManyCreateSerializer, \
    PracticeInFieldOfStudyForCompeteceListSerializer
from workprogramsapp.permissions import IsRpdDeveloperOrReadOnly, IsOwnerOrDodWorkerOrReadOnly
from workprogramsapp.models import PracticeInFieldOfStudy


class PracticeSet(viewsets.ModelViewSet):
    my_tags = ["Gia and Practice"]
    queryset = Practice.objects.all()
    serializer_class = PracticeSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ["discipline_code", "title", "id", 'editors__first_name', 'editors__last_name']
    permission_classes = [IsOwnerOrDodWorkerOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return PracticePrimitiveSerializer
        return PracticeSerializer


class PracticeTemplateSet(viewsets.ModelViewSet):
    my_tags = ["Gia and Practice"]
    queryset = PracticeTemplate.objects.all()
    serializer_class = PracticeTemplateSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    permission_classes = [IsAdminUser]


class PrerequisitesPracticeSet(mixins.CreateModelMixin,
                   #mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   #mixins.ListModelMixin,
                   GenericViewSet):
    my_tags = ["Gia and Practice"]
    queryset = PrerequisitesOfPractice.objects.all()
    serializer_class = ItemInPracticeCreateSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    permission_classes = [IsOwnerOrDodWorkerOrReadOnly]


class OutcomesPracticeSet(mixins.CreateModelMixin,
                   #mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   #mixins.ListModelMixin,
                   GenericViewSet):
    my_tags = ["Gia and Practice"]
    queryset = OutcomesOfPractice.objects.all()
    serializer_class = OutcomesInPracticeCreateSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    permission_classes = [IsOwnerOrDodWorkerOrReadOnly]


class PracticeInFieldOfStudySet(#mixins.CreateModelMixin,
                   #mixins.RetrieveModelMixin,
                   #mixins.UpdateModelMixin,
                   #mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    my_tags = ["Gia and Practice"]
    queryset = PracticeInFieldOfStudy.objects.all()
    serializer_class = PracticeInFieldOfStudyCreateSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    permission_classes = [IsOwnerOrDodWorkerOrReadOnly]



class ZunPracticeManyViewSet(mixins.CreateModelMixin,
                   #mixins.RetrieveModelMixin,
                   #mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   #mixins.ListModelMixin,
                   GenericViewSet):
    my_tags = ["Gia and Practice"]
    model = ZunPractice
    queryset = ZunPractice.objects.all()
    serializer_class = ZunPracticeForManyCreateSerializer
    http_method_names = ['post', 'delete', 'patch']

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['version'],
        properties={
            'pra_in_fss': openapi.Schema(type=openapi.TYPE_ARRAY,
                                         description='id объектов класса PracticeInFieldOfStudy (api/practice/fieldofstudies_for_competences/<int:practice_id>)',
                                         items=openapi.Items(type=openapi.TYPE_INTEGER)),
            'zun': openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                'indicator_in_zun': openapi.Schema(type=openapi.TYPE_INTEGER, description='id интикатора'),
                'items': openapi.Schema(type=openapi.TYPE_ARRAY, description='id объектов OutcomesOfPractice (доступны в ендпоинте практики)',
                                             items=openapi.Items(type=openapi.TYPE_INTEGER)),
                }, )
            },
        ),
        operation_description='Метод для добавления компетенций в практики')
    def create(self, request, *args, **kwargs):
        for pr_in_fs in request.data['pra_in_fss']:
            serializer = self.get_serializer(data=request.data['zun'])
            serializer.is_valid(raise_exception=True)
            serializer.save(practice_in_fs=PracticeInFieldOfStudy.objects.get(id=pr_in_fs))
        return Response(status=status.HTTP_201_CREATED)


class ZunPracticeViewSet(viewsets.ModelViewSet):
    my_tags = ["Gia and Practice"]
    queryset = ZunPractice.objects.all()
    serializer_class = ZunPracticeForManyCreateSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    permission_classes = [IsOwnerOrDodWorkerOrReadOnly]


class PracticeInFieldOfStudyForWorkProgramList(generics.ListAPIView):
    my_tags = ["Gia and Practice"]
    serializer_class = PracticeInFieldOfStudyForCompeteceListSerializer
    permission_classes = [IsRpdDeveloperOrReadOnly]

    def list(self, request, **kwargs):
        """
        Вывод учебных планов для одной рабочей программы по id
        """
        queryset = PracticeInFieldOfStudy.objects.filter(
            practice__id=self.kwargs['practice_id'],
        ).distinct()
        serializer = PracticeInFieldOfStudyForCompeteceListSerializer(queryset, many=True)
        return Response(serializer.data)

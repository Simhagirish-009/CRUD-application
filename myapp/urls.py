from django.urls import path
from .views import *

urlpatterns = [
    # managing Category
    path('addcategory/',CategoryListCreateView.as_view(),name='add category'),
    path('addcategory/<int:pk>/',CategoryRetrieveUpdateDestroyView.as_view(),name='crud category'),

    # managing Products
    path('addproduct/',ProductCreateView.as_view(),name='add product'),
    path('addproduct/<int:pk>/',ProductRetrieveUpdateDestroyView.as_view(),name='crud product'),

    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    # path('verify-otp/', VerifyOtpView.as_view(), name='verify-otp'),
]
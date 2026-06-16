from django.contrib import admin
from .models import *

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from .models import *
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser')}
        ),
    )
    search_fields = ('email', 'username')
    ordering = ('email',)
# Register the CustomUser model with CustomUserAdmin
admin.site.register(CustomUser, CustomUserAdmin)

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Otp)
import os
from pathlib import Path
from decouple import config as env
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
# NOTE: Use underscore, not hyphen -> DJANGO_SECRET_KEY
SECRET_KEY = env("DJANGO_SECRET_KEY", default="unsafe-secret")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DJANGO_DEBUG", default=True, cast=bool)

ALLOWED_HOSTS = env("ALLOWED_HOSTS", "").split(",")

CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS", "").split(",")
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS =  env("CORS_ALLOWED_ORIGINS", "").split(",")
CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "x-csrftoken",
    "origin",
]


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(hours=8),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}


# Application definition
INSTALLED_APPS = [
    # Django apps
    "django.contrib.admin",          # keep if you want / safe to keep
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party apps
    "cloudinary",
    "cloudinary_storage",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    

    # Local apps
    "apps.accounts.apps.AccountsConfig",
    "apps.common.apps.CommonConfig",
    "apps.home.apps.HomeConfig",
    "apps.our_services.apps.OurServicesConfig",
    "apps.customer_contact.apps.CustomerContactConfig",
    "apps.book_consultation.apps.BookConsultationConfig",
    "apps.questions.apps.QuestionsConfig",
    "apps.about.apps.AboutConfig",
    "apps.branches.apps.BranchesConfig",
    "apps.youtube.apps.YoutubeConfig",
    "apps.gallery.apps.GalleryConfig",
    
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',

    # Your API error middleware
    # "apps.common.middleware.ApiExceptionMiddleware",
]

ROOT_URLCONF = "config.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

import dj_database_url # type: ignore
import os
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
import dj_database_url
import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
CLOUDINARY_STORAGE = {
    "CLOUDINARY_URL": os.environ.get("CLOUDINARY_URL")
}

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

# Custom user model
AUTH_USER_MODEL = "accounts.User"

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"
MEDIA_URL="/media/"
MEDIA_ROOT=BASE_DIR / "media"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# DRF Settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        'rest_framework.authentication.TokenAuthentication',

    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
    "DEFAULT_PAGINATION_CLASS": "apps.common.pagination.StandardPagination",
    "PAGE_SIZE": 100,
    # "EXCEPTION_HANDLER": "apps.common.exceptions.custom_exception_handler",
    "DEFAULT_THROTTLE_CLASSES": (
        "apps.common.throttles.AdminLoginRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "admin_login": "240/min",
    },
}


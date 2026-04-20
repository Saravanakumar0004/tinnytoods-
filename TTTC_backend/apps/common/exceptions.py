from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return Response(
            {
                "error":"sever_error", "details":"Unexpected error"
            },
            status = status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
    return Response(
        {
            "error":"request error",
            "detail":response.data,
        },
        status = response.status_code,
    )



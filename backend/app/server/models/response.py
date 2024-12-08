# Response schema for successful requests
def ResponseModel(data, message: str):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }


# Error response schema
def ErrorResponseModel(error: str, code: int, message: str):
    return {
        "error": error,
        "code": code,
        "message": message,
    }

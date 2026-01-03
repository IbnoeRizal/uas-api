# Documentation endpoint `/api/enrollments/*`

>[!NOTE]
> to get data from this endpoint, user must have a valid bearer token :label:

|          Route            | Method                |
|---------------------------|-----------------------|
|   `/api/enrollments/`     |  GET, POST, DELETE    |
|   `/api/enrollments/[id]` |  GET, PATCH           |
|   `/api/enrollments/me`   |          GET          |

## 1. GET `/api/enrollments/`
> Role : Admin

- json output
```JSONC
    {
        "enrollments":[
            {
                "id":7,
                "course":{"id":3,"name":"Bahasa Indonesia"},
                "user":{"id":3,"name":"Harini Yolanda","email":"Aswandi.Abiputra@gmail.co.id"}
            }
        ],
        "total":24
    }
```

## 2. POST `/api/enrollments/`
> Role : Admin

- json input 
```JSONC
    {
        "userId" : 12,
        "courseId" : 5
    }
```
- json output 
```JSONC
    {
        "message": "enrollment created",
        "enrollment": {
            "userId": 12,
            "courseId": 5
        }
    }
```

## 3. DELETE `/api/enrollments/`
> Role: Admin

- json input
```JSONC
    {
        # key value is required only for (id) or (userId and courseId)
       "id" : null, #optional
       "userId": 12, #optional
       "courseId": 5 #optional
    }
```

- json output
```JSONC
    {
        "message":"enrollment id:undefined deleted successfully",
        "enrollment":{
            "courseId":5,
            "userId":12
        }
    }
```

## 4. GET `/api/enrollments/[id]`
> Role Admin

- example `/api/enrollments/7`
- json output
```JSONC
    {
        "enrollment": {
            "user": {
                "id": 3,
                "name": "Harini Yolanda",
                "email": "Aswandi.Abiputra@gmail.co.id"
            },
            "course": {
                "id": 3,
                "name": "Bahasa Indonesia"
            }
        }
    }
```

## 5. PATCH `/api/enrollments/[id]`
> Role Admin

- example `/api/enrollments/7`
- json input
```JSONC
    {
       # only one key value pair is required
       "userId" : 12, #optional
       "courseId": null #optional
    }
```

- json output
```JSONC
    {
        "message": "enrollment updated successfully",
        "enrollment": {
            "id": 7,
            "userId": 12,
            "courseId": 3,
            "enrolledAt": "2026-01-02T03:13:55.753Z",
            "grade": null
        }
    }
```

## 6. GET `/api/courses/me`
> Role : Student
- json output
```JSONC
    {
        "enrollments":[
            {
                "course":{"name":"Bahasa Indonesia"},
                "user":{"name":"userbaruuu"},
                "grade":null
            }
        ]
    }
```
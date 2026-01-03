# Documentation endpoint `/api/courses/*`

>[!NOTE]
> to get data from this endpoint, user must have a valid bearer token :label:


|          Route      | Method |
|---------------------|--------|
|   `/api/courses` |  GET, POST, DELETE    |
|   `/api/courses/[id]`    |  GET, PATCH    |

## 1. GET `/api/courses`
> Role : Admin & Student

pagination parameter are set with page=0&limit=10

- json output 
```JSONC
    {
        "safeCourses": [
            {
                "id": 3, # null if Student
                "name": "Bahasa Indonesia",
                "createdAt": "2026-01-02T03:13:55.727Z" # null if Student
            },
        ],
        "total": 5
    }
```

## 2. POST `/api/courses`
> Role: Admin

- json input
``` JSONC
    {
        "name" : "Kalkulus"
    }
```

- json output
``` JSONC
    {
        "message": "success",
        "course": {
            "id": 7,
            "name": "Kalkulus"
        }
    }
```

## 3. DELETE `/api/courses`
> Role : Admin

- json input

```JSONC
    {
        # require only one key value

        "id" : 7, #optional. can be omitted because field name is unique
        "name" : "Kalkulus 2" #optional. can be omitted
    }
```

- json output

```JSONC
    {
        "message":"course deleted successfully",
        "course":{
                "id":7,
                "name":"Kalkulus 2"
            }
    }
```

## 4. GET `/api/courses/[id]`
> Role : Admin

- `example` : /api/courses/1

- json output

``` JSONC
    {
        "course": {
            "id": 1,
            "name": "Matematika",
            "createdAt": "2026-01-02T03:13:55.727Z",
            "enrollments": [
                {
                    "grade": null, # Has no grade
                    "user": {
                        "id": 1,
                        "name": "Harini Yolanda",
                        "email": "Kemba.Purnama@yahoo.com"
                    }
                },
            ]
        }
    }
```

## 5. PATCH `/api/courses/[id]`
> Role : Admin

- `example` : /api/courses/7

- json input

```JSONC
    {
        "name" : "Kalkulus 2"
    }
```

- json output

```JSONC
    {
        "message": "Kalkulus 2 updated successfully"
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
        ]}
```

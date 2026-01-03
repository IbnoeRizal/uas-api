# Documentation endpoint `/api/users/*`

>[!NOTE]
> to get data from this endpoint, user must have a valid bearer token :label:

|          Route      | Method |
|---------------------|--------|
|   `/api/users` |  GET, DELETE    |
|   `/api/users/[id]`    |  GET, PATCH    |
|   `/api/users/me` | GET |

> POST method for users is implemented on [register endpoint](../auth/auth_endpoint.md)

## 1. GET `/api/users`
> Role: Admin

pagination parameter are set with page=0&limit=10

- json output
```JSONC
    {
    "users": [
        {
            "id": 1,
            "name": "Harini Yolanda",
            "email": "Kemba.Purnama@yahoo.com",
            "role": "Student",
        },
    ],
    "total": 11
}
```


## 2. DELETE `/api/users`
> Role : Admin

- json input
```JSON
    {
        "email": "Wacana_Haikal@yahoo.co.id",
        "role": "Student"
    }
```

- json output
```JSONC
    {
        "message":"Wacana Maryanto deleted"
    }
```

## 3. GET `/api/users/[id]`
> Role : Admin

- example : `/api/users/3`

- json output
```JSONC
    {
        "message": {
            "id": 3,
            "name": "Aswandi Jatmiko",
            "email": "Aswandi.Abiputra@gmail.co.id",
            "role": "Student",
            "enrollments": [
                {
                    "enrolledAt": "2026-01-02T03:13:55.753Z",
                    "grade": null,
                    "course": {
                        "name": "Bahasa Indonesia"
                    }
                },
            ]
        }
    }
```

## 4. PATCH `/api/users/[id]`
> Role : Admin

- example : `/api/users/3`

- json input
```JSONC
    {
        #require only one key value pair
        
        "name":"Harini Yolanda", #optional
        "email": #optional,
        "password": #optional,
        "role": #optional 
    }
```

- json output
```JSONC
    {
        "message":"User updated successfully ",
        "updated":{
            "id":3,
            "name":"Harini Yolanda",
            "email":"Aswandi.Abiputra@gmail.co.id",
            "role":"Student"
        }
    }
```
## 5. GET  `/api/users/me`
> Role : Admin, Student

- json output
```JSONC
    {
        "user": {
            "name": "ibnu Rizal",
            "email": "dummy2@email.com",
            "role": "Admin",
            "enrollments": []
        }
    }
```
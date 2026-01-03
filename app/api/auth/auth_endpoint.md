# Documentation endpoint `/api/auth/*`


|          Route      | Method |
|---------------------|--------|
|   `/api/auth/register` |  POST    |
|   `/api/auth/login`    |  POST    |
|   `/api/auth/refresh`  | GET |



##  1. POST `/api/auth/register`


- Format json input

```JSONC
    {
        "name": "Jhon Doe", #required 10char
        "email": "JhonDoe@mail.xxx", #required
        "password": "xxxxxx" #required 8digit,
        "role" : "Student | Admin" #optional (default Student)
    }
```

- Format json Output

```JSONC
    {
        "token": "xxxxxxxxxx" #jwt bearer token
    }
```


##  2. POST `/api/auth/login`

- Format json input

```JSONC
    {
        "name": "Jhon Doe", #optional
        "email": "JhonDoe@mail.xxx",
        "password": "xxxxxx" #8digit
    }
```

- Format json Output

```JSONC
    {
        "token": "xxxxxxxxxx" #jwt bearer token
    }
```

##  3. GET `/api/auth/refresh`


- Format json Output

```JSONC
    {
        "token": "xxxxxxxxxx" #jwt bearer token
    }
```
Note : to get refresh token, user must already have a valid bearer token 
docker compose is added for minio setup
just run following command to setup minio

```sh
  docker compose up -d
```

to run the nest js server

```sh
npm run start
```

API endpoints

to upload the file:

```sh
curl --location 'http://localhost:3000/upload' \
--form 'file=@"/C:/Movies/Screenshot (1).png"'
```

to get presigned url:

```sh
curl --location 'http://localhost:3000/upload/presinged-url' \
--header 'Content-Type: application/json' \
--data '{
    "filename":"yuhnjimk,l. (1).png"
}
'
```

to get multi presigned url for multiple file uploads:

```sh
curl --location 'http://localhost:3000/upload/multi-presinged-url' \
--header 'Content-Type: application/json' \
--data '{
    "filenames": [
        "test04.png",
        "test05.png"
    ]

}'
```

once you get the presigned url you can upload the image using the returned presigned url:

just copy the presigned url and paste in postman, select body -> binary

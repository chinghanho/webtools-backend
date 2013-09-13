# Webtools

[![Build Status](https://travis-ci.org/chinghanho/webtools-backend.png?branch=master)](https://travis-ci.org/chinghanho/webtools-backend)

Install all dependencies:

    npm install

Launch server for development:

    grunt

Runing tests:

    npm test

or:

    NODE_ENV=test mocha

## Documents

    GET /api/comments.json

``` js
[
  {
    "resource": {
      "_id": "521ca8f57a2a612840000001",
      "name": "Sublime Text 文件"
    },
    "user": {
      "id": "521ca8f57a2a612840000002",
      "login": "bernardogalindo"
    },
    "body": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias, sapiente, tempore, quod quisquam consequuntur voluptas alias pariatur qui autem dolores at explicabo excepturi similique accusamus architecto possimus aut quam eos!",
    "_id": "521caad17a2a612840000003",
    "update_at": "2013-08-27T13:34:09.263Z",
    "create_at": "2013-08-27T13:34:09.263Z"
  }
]
```

    POST /api/comments.json

``` js
{
  "resource": {
    "_id": "521ca8f57a2a612840000001",
    "name": "Sublime Text 文件"
  },
  "user": {
    "id": "521ca8f57a2a612840000002",
    "login": "bernardogalindo"
  },
  "body": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta, cum, similique, quisquam aperiam accusamus quidem id quibusdam delectus at necessitatibus eum magnam earum nostrum beatae hic animi ipsam saepe reprehenderit.",
  "_id": "521caad17a2a612840000003",
  "update_at": "2013-08-27T13:34:09.263Z",
  "create_at": "2013-08-27T13:34:09.263Z"
}
```

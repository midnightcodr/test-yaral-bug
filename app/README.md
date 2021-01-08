## Setup & run
docker-compose up --build

## Test
```
for i in `seq 1 300`; do echo -n "$i"; curl http://localhost:3000/hello ; echo; sleep 0.25; done
```

## How to know if the plugin is working as expected?

Expected:

    See 429 error after 5 requests

Actual:

    See 429 error after 10 requests
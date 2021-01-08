// run app.js with
// CACHE_REDIS=redis://:password@host:port/db node app.js
/*
  Test with simple shell script:

  for i in `seq 1 40`; do echo $i; curl http://localhost:3000/hello; sleep 0.5; done

  Expected behavior: getting 429 errors after counter 11 (11-1)*0.5 = 5
  Actual behavior: Getting 429 errors after counter 31  
*/
const Hapi = require('@hapi/hapi')
const server = Hapi.server({
  port: parseInt(process.env.PORT || '3000'),
  cache: [
    {
      name: 'redisCache',
      provider: {
        constructor: require('@hapi/catbox-redis'),
        options: {
          url: 'redis://redis'
        }
      }
    }
  ]
})

const getIP = request => {
  return request.info.remoteAddress || 'unknown ip'
}

const plugins = [
  {
    plugin: require('yaral'),
    options: {
      buckets: [
        // up to 5 requests per 5 seconds
        {
          id: getIP,
          name: 'general5sec',
          interval: 5 * 1000,
          max: 5
        },
        // up to 10 requests per minute
        {
          id: getIP,
          name: 'general1min',
          interval: 60 * 1000,
          max: 10
        }
      ],
      enabled: true,
      default: ['general1min'],
      // default: ['general5sec', 'general1min'],
      cache: 'redisCache'
    }
  }
]

server.route({
  path: '/hello',
  method: 'GET',
  handler () {
    return 'world'
  }
})
;(async () => {
  await server.register(plugins)
  await server.start()
  console.log(`server started at ${server.info.uri}`)
})()

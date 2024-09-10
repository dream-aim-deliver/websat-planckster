# Deployment Instructions

Apache is configured to proxy traffic on port 443 to the NextJS app. Traffic on port 80 is forwarded to port 443. The NextJS app is managed by pm2 and run locally inside the container on ports 3000. These ports are not exposed to the host.


## Build and Run

```bash
docker build --rm -t maany/websat-planckster .
```

```bash
docker run -d --name websat-planckster \
    --hostname <public_hostname> \
    --name websat-planckster \
    -e HTTPD_ENABLE_SSL=True \
    -e PRIMARY_USER_USERNAME=admin \
    -e PRIMARY_USER_PASSWORD=admin \
    -e SECONDARY_USER_USERNAME=guest \
    -e SECONDARY_USER_PASSWORD=guest \
    -e NEXTAUTH_SECRET=secret-1239899*@$% \
    -e OPENAI_API_KEY={{ your openai key }} \
    -e HTTPD_ENABLE_LOGS=True \
    -e KP_HOST=http://0.0.0.0:8000 \
    -e KP_AUTH_TOKEN=1 \
    -e KP_CLIENT_ID=1 \
    -p 80:80 -p 443:443 \
    --mount type=bind,source=your/hostcert.pem,target=/etc/dad/hostcert.pem \
    --mount type=bind,source=your/hostkey.pem,target=/etc/dad/hostkey.pem \
    --mount type=bind,source=your/ca.pem,target=/etc/dad/ca.pem \
    maany/websat-planckster
```

For example, to run the container with the provided certificates, use the following command:
```bash
docker run -d --name websat-planckster \
    --hostname localhost \
    --name websat-planckster \
    -e OPENAI_API_KEY=sk-something \
    -e HTTPD_ENABLE_SSL=True \
    -e PRIMARY_USER_USERNAME=admin \
    -e PRIMARY_USER_PASSWORD=admin \
    -e SECONDARY_USER_USERNAME=guest \
    -e SECONDARY_USER_PASSWORD=guest \
    -e NEXTAUTH_SECRET="secret-1239899*@$%" \
    -e HTTPD_ENABLE_LOGS=True \
    -e KP_HOST=http://0.0.0.0:8000 \
    -e KP_AUTH_TOKEN=1 \
    -e KP_CLIENT_ID=1 \
    -p 80:80 -p 443:443 \
    --mount type=bind,source=$(pwd)/dist/localhost.crt,target=/etc/dad/hostcert.pem \
    --mount type=bind,source=$(pwd)/dist/localhost.key,target=/etc/dad/hostkey.pem \
    --mount type=bind,source=$(pwd)/dist/ca.pem,target=/etc/dad/ca.pem \
    maany/websat-planckster
```
For running in http mode, use the following command. In this case TLS termination is done by an external loadbalancer:

```bash
docker run -d --name websat-planckster \
    --hostname localhost \
    --name websat-planckster \
    -e OPENAI_API_KEY=sk-something \
    -e HTTPD_ENABLE_SSL=False \
    -e PRIMARY_USER_USERNAME=admin \
    -e PRIMARY_USER_PASSWORD=admin \
    -e NEXTAUTH_SECRET="secret-1239899*@$%" \
    -e NEXTAUTH_URL=http://0.0.0.0:80 \
    -e HTTPD_ENABLE_LOGS=True \
    -e KP_HOST=http://0.0.0.0:8000 \
    -e KP_AUTH_TOKEN=test123 \
    -e KP_CLIENT_ID=1 \
    -p 80:80 -p 443:443 \
    -p 3000:3000 \
    maany/websat-planckster
```

## Minimal Configuration
You must set the following environment variables to run the container:

| Environment Variable    | Description                                 |
| ----------------------- | ------------------------------------------- |
| HTTPD_ENABLE_SSL        | A boolean value to enable or disable SSL.   |
| PRIMARY_USER_USERNAME   | The username for the primary user.          |
| PRIMARY_USER_PASSWORD   | The password for the primary user.          |
| SECONDARY_USER_USERNAME | The username for the secondary user.        |
| SECONDARY_USER_PASSWORD | The password for the secondary user.        |
| NEXTAUTH_SECRET         | The secret key for NextAuth authentication. |
| OPENAI_API_KEY          | Your OpenAI API key.                        |
| KP_HOST                 | The Host where kernel planckster is located |
| KP_AUTH_TOKEN           | The Auth Token with KP requests             |
| KP_CLIENT_ID            | The client id for KP requests               |


## Additional Configuration
The following environment variables can be used to configure the Apache Web Server:


| Environment Variable            | Description                                                                                                                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HTTPD_SERVER_ADMIN`            | The email address of the server administrator.                                                                                                                                                                 |
| `HTTPD_LOG_LEVEL`               | The log level for the Apache Web Server.                                                                                                                                                                       |
| `HTTPD_ENABLE_LOGS`             | Whether to enable logging for the Apache Web Server.                                                                                                                                                           |
| `HTTPD_LOG_DIR`                 | The directory where the logs for the Apache Web Server should be stored.                                                                                                                                       |
| `HTTPD_ENABLE_SSL`              | Whether to enable SSL for the Apache Web Server. Please mount the SSL certificate and key to `/etc/dad/hostcert.pem` and `/etc/dad/hostkey.pem` respectively. Please mount the ca-bundle to `/etc/dad/ca.pem`. |
| `HTTPD_LOG_FORMAT`              | The log format for the Apache Web Server.                                                                                                                                                                      |
| `HTTPD_MPM_MODE`                | The Multi-Processing Module (MPM) mode for the Apache Web Server.                                                                                                                                              |
| `HTTPD_START_SERVERS`           | Number of servers to start.                                                                                                                                                                                    |
| `HTTPD_MIN_SPARE_SERVERS`       | Minimum number of spare servers.                                                                                                                                                                               |
| `HTTPD_MAX_SPARE_SERVERS`       | Maximum number of spare servers.                                                                                                                                                                               |
| `HTTPD_SERVER_LIMIT`            | Limit on the number of servers.                                                                                                                                                                                |
| `HTTPD_MAX_CLIENTS`             | Maximum number of clients.                                                                                                                                                                                     |
| `HTTPD_MAX_REQUESTS_PER_CHILD`  | Maximum number of requests per child.                                                                                                                                                                          |
| `HTTPD_MIN_SPARE_THREADS`       | Minimum number of spare threads.                                                                                                                                                                               |
| `HTTPD_MAX_SPARE_THREADS`       | Maximum number of spare threads.                                                                                                                                                                               |
| `HTTPD_THREADS_PER_CHILD`       | Threads per child.                                                                                                                                                                                             |
| `HTTPD_KEEP_ALIVE`              | Whether to enable keep-alive.                                                                                                                                                                                  |
| `HTTPD_KEEP_ALIVE_TIMEOUT`      | The keep-alive timeout.                                                                                                                                                                                        |
| `HTTPD_MAX_KEEP_ALIVE_REQUESTS` | Number of requests per keep-alive connection.                                                                                                                                                                  |
| `HTTPD_THREADS_LIMIT`           | Limit on the number of threads.                                                                                                                                                                                |
| `HTTPD_TIMEOUT`                 | The timeout for the Apache Web Server.                                                                                                                                                                         |


# Infrastructure Deployment

Currently the infrastructure has the following components:
- Postgres database
- Frontend application exposed via Nginx
- Backend DotNet Monolithic Application

Infrastructure can be deployed via docker compose  using the following command from the root of the repository:

```sh
docker-compose up --build
```

## Accessing Postgres

The Postgres database, running in a Docker container, can be accessed in multiple ways. A few examples are captured below:

1. Via [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/quickstart-postgres)
2. Via [DBeaver](https://dbeaver.io/)
3. Via [pgAdmin](https://www.pgadmin.org/)

## Accessing the Frontend

Once your infrastructure is up and running, navigate to <http://localhost:3000> to access the fronet-end application.
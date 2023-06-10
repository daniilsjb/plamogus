# Plamogus

A small and simple university assignment planner for students! 🎓

![Collection of screenshots from the application.](assets/Thumbnail_Light.png#gh-light-mode-only "Thumbnail")
![Collection of screenshots from the application.](assets/Thumbnail_Dark.png#gh-dark-mode-only "Thumbnail")

## Features

- Full-stack CRUD application.
- RESTful API and PostgreSQL database.
- [Spring Boot][spring-boot] backend with [JPA][jpa] and [Lombok][lombok].
- [React][react] frontend for web browsers with [React Router][react-router].
- Responsive UI and UX based on Google's [Material Design][material] ([MUI][mui]).
- Form management and validation using [Formik][formik] and [Yup][yup].
- Querying using [React Query][react-query] and [Axios][axios].
- Dashboard with [Recharts][recharts] components.
- Calendars and date pickers, with  [day.js][dayjs] time operations.
- Support for dark and light themes.

## Building

To run this project locally, you will need to start up the database, backend, and frontend of the application.

### Prerequisites

There are several options for building this project, but ultimately you will most likely need the following:

- [Docker][1] or a local installation of [PostgreSQL][2]
- Java 17 SDK
- [npm][3]

You may perform all of the steps using a terminal, or use an IDE such as [IntelliJ IDEA][4], which works for both Spring
and React projects. If you don't have Docker installed, you may wish to consider using [Docker Desktop][5], which comes
with all necessary software and a graphical user interface.

### Starting the Database

This project uses PostgreSQL database management system. To run the application, you can either start a database server
using Docker or by manually running the DBMS on your machine.

#### Using Docker (Recommended)

The simplest way to start the database container is via the provided [`docker-compose.yml`](./server/docker-compose.yml)
configuration file. Assuming you are in the root of the repository, simply run the following:

```sh
cd server
docker-compose up
```

This will take care of pulling the necessary image and setting up the environment variables, exposed ports, etc.
Alternatively, you may explicitly run the equivalent Docker command yourself:

```sh
docker run -d \
  --name plamogus_db \
  -e POSTGRES_DB=plamogus \
  -e POSTGRES_USER=plamogus_user \
  -e POSTGRES_PASSWORD=plamogus_user \
  -p 5432:5432 \
  postgres
```

#### Manually

Create a new database server using the PostgreSQL package and configure it with the following settings (applicable to
local environments only):

| Setting       | Value           |
| ------------- | --------------- |
| Database Name | `plamogus`      |
| Username      | `plamogus_user` |
| Password      | `plamogus_user` |
| Host          | `localhost`     |
| Port          | `5432`          |

### Starting the Server

Before running the server, ensure that the database has started successfully.

#### Using IntelliJ IDEA (Recommended)

Simply open the `server` project in the IDE and run it - IntelliJ will automatically take care of dependencies, etc.
If you do not have a suitable Java 17 SDK, you may [download one directly from the IDE][6] (such as the Amazon Corretto
version of OpenJDK).

To verify that the server has started correctly, you may try running samples from the [`examples`](./server/examples/)
folder using [IntelliJ's built-in HTTP client][7] after selecting the `local` environment profile. Don't forget to
replace `{id}` with the actual identifiers when making requests!

#### Using Terminal

If you prefer building from the command-line, you may use the provided `mvnw` script to build and run the project.
Ensure that the path to your Java 17 SDK is specified in the `JAVA_HOME` environment variable.

If you are on Windows, execute the following commands:

```sh
cd server
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

If you are on Linux or macOS, execute the following commands:

```sh
cd server
./mvnw clean install
./mvnw spring-boot:run
```

### Starting the Client

Before running the client, ensure that the server has started successfully. The frontend may also be started from
IntellIJ IDEA, or using the following commands in a terminal:

```sh
cd client
npm install
npm start
```

At this point, the entire application stack should be up and running. Open up your web browser and navigate to
`localhost:3000/` to try it out!

<!-- Backend references. -->
[jpa]: https://spring.io/projects/spring-data-jpa
[lombok]: https://projectlombok.org/
[spring-boot]: https://spring.io/projects/spring-boot

<!-- Frontend references. -->
[axios]: https://axios-http.com/docs/intro
[dayjs]: https://day.js.org/
[formik]: https://formik.org/
[material]: https://m3.material.io/
[mui]: https://mui.com/
[react-query]: https://tanstack.com/query/v3/
[react-router]: https://reactrouter.com/en/main
[react]: https://react.dev/
[recharts]: https://recharts.org/en-US/
[yup]: https://github.com/jquense/yup

<!-- Build references. -->
[1]: https://www.docker.com/
[2]: https://www.postgresql.org/download/
[3]: https://www.npmjs.com/
[4]: https://www.jetbrains.com/idea/
[5]: https://www.docker.com/products/docker-desktop/
[6]: https://www.jetbrains.com/help/idea/sdk.html#set-up-jdk
[7]: https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html

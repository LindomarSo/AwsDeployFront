# AwsDeploy

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.1.

## Local API integration

The frontend is configured to call the local API at `https://localhost:7296`.

### Auth endpoints

- `POST /auth/register`
- `POST /auth/login`

The home page now exposes login and register actions. After login, the token is stored in `localStorage` and sent automatically as a Bearer token on requests to `POST /resume`.

### Resume endpoint

The resume flow sends a `multipart/form-data` request to `POST /resume` with:

- `jobUrl`
- `resumeFile`

If your backend uses different field names or a different response contract, adjust the mapping in `src/app/services/resume.service.ts`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

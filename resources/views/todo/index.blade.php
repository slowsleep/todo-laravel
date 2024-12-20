<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Simple TODO App</title>
        <script defer src="{{ asset('todo/public/bundle.js') }}"></script>
        <meta name="csrf-token" content="{{ csrf_token() }}">
    </head>

    <body>
        <header>
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    <a class="navbar-brand text-light" href="/app">SimpleTODO</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mb-2 mb-lg-0" id="app-user-menu"></ul>
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="app-admin-menu"></ul>
                        <div id="app-nav-right"></div>
                    </div>
                </div>
            </nav>
        </header>

        <main class="main">
            <div class="container-fluid">
                <div id="content">Please Sign In to see your tasks!</div>
            </div>
        </main>

        <footer class="footer text-light mt-4">
            <div class="d-flex p-2">
                <div class="d-flex" id="app-footer-counters"></div>
                <p class="col m-2 text-end">
                    Kanban board by Yana Alekseeva, 2024
                </p>
            </div>
        </footer>
    </body>
</html>

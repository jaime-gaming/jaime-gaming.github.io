#!/usr/bin/env python3
"""Local preview server that supports GitHub Pages-style project routes."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import os
import re

ROOT = Path(__file__).resolve().parent.parent
PROJECT_ROUTE = re.compile(r"^/projects/[^/]+(?:/[^/]+)?/?$")


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        requested_path = unquote(urlsplit(path).path)
        translated = Path(super().translate_path(path))
        if not translated.exists() and PROJECT_ROUTE.fullmatch(requested_path):
            return str(ROOT / "404.html")
        return str(translated)


def main():
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), PreviewHandler)
    print(f"Preview server listening on 0.0.0.0:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

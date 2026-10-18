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

    def send_error(self, code, message=None, explain=None):
        if code == 404 and not urlsplit(self.path).path.startswith("/assets/"):
            body = (ROOT / "404.html").read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def translate_path(self, path):
        requested_path = unquote(urlsplit(path).path)
        translated = Path(super().translate_path(path))
        if not translated.exists() and PROJECT_ROUTE.fullmatch(requested_path):
            return str(ROOT / "404.html")
        return str(translated)


def main():
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), PreviewHandler)
    print(f"Preview server listening on 0.0.0.0:{server.server_port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

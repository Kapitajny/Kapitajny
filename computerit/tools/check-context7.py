#!/usr/bin/env python3
"""Test serwera MCP Context7 tym samym protokołem, którego używa Claude Code (MCP po HTTP).

Sprawdza: połączenie, listę narzędzi oraz czy dla WordPressa, WooCommerce i Lighthouse
wracają fragmenty dokumentacji. Bez klucza API (darmowy limit). Klucz, jeśli kiedyś będzie
potrzebny, ustawia się poza repozytorium – nigdy w tym pliku ani w .mcp.json.
Użycie: python3 tools/check-context7.py
"""
import json
import sys
import urllib.request

URL = "https://mcp.context7.com/mcp"
HEADERS = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
session_id = None


def rpc(method, params=None, msg_id=None):
    global session_id
    body = {"jsonrpc": "2.0", "method": method}
    if msg_id is not None:
        body["id"] = msg_id
    if params is not None:
        body["params"] = params
    headers = dict(HEADERS, **({"mcp-session-id": session_id} if session_id else {}))
    req = urllib.request.Request(URL, data=json.dumps(body).encode(), headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=60) as resp:
        session_id = resp.headers.get("mcp-session-id") or session_id
        raw = resp.read().decode()
    if msg_id is None:
        return None
    for line in raw.splitlines():
        if line.startswith("data:"):
            return json.loads(line[5:])
    return json.loads(raw)


def text(result):
    return "\n".join(c.get("text", "") for c in result["result"]["content"])


CHECKS = [
    ("/websites/developer_wordpress_reference_functions", "add_theme_support", "add_theme_support"),
    ("/websites/developer_woocommerce", "override templates in a block theme", "templates"),
    ("/googlechrome/lighthouse", "CLI output json html", "lighthouse"),
]

try:
    info = rpc("initialize", {"protocolVersion": "2025-03-26", "capabilities": {},
                              "clientInfo": {"name": "computerit-check", "version": "1"}}, 1)
    rpc("notifications/initialized")
    print(f"Połączenie: OK ({info['result']['serverInfo']['name']} {info['result']['serverInfo']['version']})")
    tools = [t["name"] for t in rpc("tools/list", {}, 2)["result"]["tools"]]
    print("Narzędzia:", ", ".join(tools))
    failed = 0
    for n, (lib, query, needle) in enumerate(CHECKS, start=3):
        out = text(rpc("tools/call", {"name": "query-docs", "arguments": {"libraryId": lib, "query": query}}, n))
        ok = needle.lower() in out.lower() and len(out) > 500
        failed += not ok
        print(f"{'OK ' if ok else 'BŁĄD'} {lib}: {len(out)} znaków dokumentacji")
    sys.exit(1 if failed else 0)
except Exception as exc:  # brak sieci, limit zapytań, zmiana API
    print(f"BŁĄD: {exc}")
    sys.exit(1)

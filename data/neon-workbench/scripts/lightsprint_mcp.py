#!/usr/bin/env python3
"""Call the configured LightSprint MCP without exposing credentials."""
import json
import os
import sys
import tomllib
import urllib.request
import concurrent.futures
import re
from pathlib import Path

def parse(body):
    if body.lstrip().startswith('{'):
        return json.loads(body)
    for line in body.splitlines():
        if line.startswith('data:'):
            return json.loads(line[5:].strip())
    raise ValueError('No MCP response')

def main():
    servers = tomllib.loads(Path('/home/jq/.codex/config.toml').read_text())['mcp_servers']
    server_name = os.environ.get('LIGHTSPRINT_MCP_SERVER', 'lightsprint1' if 'lightsprint1' in servers else 'lightsprint')
    if server_name not in {'lightsprint', 'lightsprint1', 'lightsprint2', 'lightsprint3', 'lightsprint4', 'lightsprint5', 'lightsprint6'}:
        raise ValueError('Unsupported LightSprint MCP server name')
    cfg = servers[server_name]
    headers = {**cfg.get('http_headers', {}), 'Content-Type': 'application/json',
               'Accept': 'application/json, text/event-stream', 'User-Agent': 'Codex MCP'}
    authorization = headers.get('Authorization', '').strip()
    if authorization.startswith('lsat_'):
        headers['Authorization'] = 'Bearer ' + authorization
    def rpc(method, params, ident=1):
        body = {'jsonrpc': '2.0', 'method': method, 'params': params}
        if ident is not None:
            body['id'] = ident
        req = urllib.request.Request(cfg['url'], data=json.dumps(body).encode(), headers=headers)
        with urllib.request.urlopen(req, timeout=60) as r:
            if r.headers.get('Mcp-Session-Id'):
                headers['Mcp-Session-Id'] = r.headers['Mcp-Session-Id']
            if ident is None and r.status in (202,204):
                return {}
            if 'text/event-stream' in r.headers.get('Content-Type',''):
                # MCP SSE may keep the connection open after the JSON-RPC
                # answer. Return the matching answer, not wait for EOF.
                for raw_line in r:
                    line=raw_line.decode().strip()
                    if not line.startswith('data:'):continue
                    answer=json.loads(line[5:].strip())
                    if answer.get('id')==ident:return answer
                raise ValueError('SSE ended without matching MCP response')
            text = r.read().decode()
        return parse(text) if text.strip() else {}
    init = rpc('initialize', {'protocolVersion': '2025-03-26', 'capabilities': {},
                              'clientInfo': {'name': 'codex', 'version': '1.0'}})
    headers['MCP-Protocol-Version'] = init.get('result', {}).get('protocolVersion', '2025-03-26')
    rpc('notifications/initialized', {}, None)
    if len(sys.argv) == 1 or sys.argv[1] in {'list', 'list-work'}:
        result = rpc('tools/list', {}, 2)
    elif sys.argv[1] == 'read-batch':
        requests = json.loads(Path(sys.argv[2]).read_text())
        if not isinstance(requests, list) or not 1 <= len(requests) <= 24:
            raise ValueError('read-batch requires 1 to 24 requests')
        for args in requests:
            if args.get('method') != 'GET' or not re.fullmatch(r'/api/agent-sessions/[A-Za-z0-9_-]+/status', args.get('path', '')):
                raise ValueError('read-batch is restricted to GET agent-session status')
        def read_one(item):
            position, args = item
            try:
                return {'position': position, 'path': args['path'],
                        'response': rpc('tools/call', {'name': 'lightsprint_api', 'arguments': args}, position + 2)}
            except Exception as exc:
                return {'position': position, 'path': args['path'], 'error': type(exc).__name__ + ': ' + str(exc)}
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            result = {'read_batch': list(pool.map(read_one, enumerate(requests)))}
    elif sys.argv[1] == 'api-json':
        args = json.loads(sys.argv[2])
        result = rpc('tools/call', {'name': 'lightsprint_api', 'arguments': args}, 2)
    else:
        args = json.loads(Path(sys.argv[2]).read_text()) if len(sys.argv) > 2 else {}
        result = rpc('tools/call', {'name': sys.argv[1], 'arguments': args}, 2)
    if len(sys.argv) > 1 and sys.argv[1] == 'list-work':
        for tool in result.get('result', {}).get('tools', []):
            desc = tool.get('description', '')
            for start, end in [('  Tasks:', '  Agent sessions:'), ('  Agent sessions:', '  ' + 'Stacks:'), ('  Stacks:', '  Skills:')]:
                a = desc.find(start)
                z = desc.find(end, a + len(start))
                if a >= 0:
                    print(desc[a:z if z >= 0 else a + 9000])
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()

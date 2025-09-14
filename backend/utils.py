import json
import os
from threading import Lock

# simple file locks to reduce race conditions for local JSON writes
_locks = {}

def _get_lock(path):
    if path not in _locks:
        _locks[path] = Lock()
    return _locks[path]

def read_json(path):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def write_json(path, data):
    lock = _get_lock(path)
    with lock:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

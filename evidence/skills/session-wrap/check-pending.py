#!/usr/bin/env python3
"""SessionStart hook: report pending session-wrap count as factual context."""
import glob
import json
import os
import sys

# 콘솔 코드페이지와 무관하게 훅 출력을 UTF-8로 고정한다 (Windows cp949 대비).
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

def claude_root() -> str:
    root = os.environ.get("CLAUDE_CONFIG_DIR")
    if root:
        return root
    home = os.environ.get("USERPROFILE") or os.path.expanduser("~")
    return os.path.join(home, ".claude")

def main() -> int:
    queue_dir = os.path.join(claude_root(), ".omc", "pending-wraps")
    if not os.path.isdir(queue_dir):
        return 0
    count = len([p for p in glob.glob(os.path.join(queue_dir, "*.json")) if os.path.isfile(p)])
    if count <= 0:
        return 0
    msg = (
        "[Session-Wrap 상태] 아직 정리하지 않은 세션이 %d개 있습니다. "
        "사용 가능한 명령: /session-wrap. "
        "민감한 세션은 '빼' 또는 '제외'로 표시할 수 있습니다." % count
    )
    print(json.dumps(
        {"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": msg}},
        ensure_ascii=True,
    ))
    return 0

if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""SessionEnd hook: save minimal session metadata to a private local queue.

Windows/Git Bash port of the original jq-based queue-session.sh.
No network access. Stores only paths + ids, never conversation content.
"""
import json
import os
import re
import sys
import tempfile
from datetime import datetime, timezone

# 콘솔 코드페이지와 무관하게 훅 출력을 UTF-8로 고정한다 (Windows cp949 대비).
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

SID_RE = re.compile(r"^[A-Za-z0-9_-]{8,128}$")
MIN_LINES = 5
# 자동화 루프가 큐를 채우지 못하게 하는 두 가지 방어선.
MAX_QUEUE = 500          # 큐가 이보다 커지면 등록을 멈춘다 (폭주 방지 백스톱)
IGNORE_FILE = "wrap-ignore.json"  # 첫 사용자 프롬프트가 이 문구로 시작하면 건너뛴다
DEFAULT_IGNORE = ["핀큐AI(alpha_system) 자율 디벨롭"]

def claude_root() -> str:
    root = os.environ.get("CLAUDE_CONFIG_DIR")
    if root:
        return root
    home = os.environ.get("USERPROFILE") or os.path.expanduser("~")
    return os.path.join(home, ".claude")

def normalize(path: str) -> str:
    """Git Bash hands us POSIX paths, Claude Code hands us Windows paths."""
    if not path:
        return ""
    p = path.replace("\\", "/")
    m = re.match(r"^/([a-zA-Z])/(.*)$", p)
    if m and not os.path.exists(p):
        p = "%s:/%s" % (m.group(1).upper(), m.group(2))
    return p

def load_ignore(omc_dir: str):
    """첫 프롬프트 서명 무시 목록. 없으면 기본값으로 만들어 둔다."""
    path = os.path.join(omc_dir, IGNORE_FILE)
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        pats = data.get("ignore_prompt_prefixes")
        if isinstance(pats, list):
            return [p for p in pats if isinstance(p, str) and p]
    except Exception:
        pass
    try:
        os.makedirs(omc_dir, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"ignore_prompt_prefixes": DEFAULT_IGNORE}, f,
                      ensure_ascii=False, indent=2)
    except OSError:
        pass
    return list(DEFAULT_IGNORE)

def first_user_prompt(transcript_path: str) -> str:
    """transcript 앞부분에서 첫 사용자 발화만 꺼낸다. 내용은 판별에만 쓰고 저장하지 않는다."""
    try:
        with open(transcript_path, encoding="utf-8", errors="replace") as f:
            for i, line in enumerate(f):
                if i > 60:
                    break
                try:
                    rec = json.loads(line)
                except Exception:
                    continue
                if rec.get("type") != "user" or rec.get("isMeta"):
                    continue
                content = (rec.get("message") or {}).get("content")
                if isinstance(content, list):
                    content = " ".join(
                        c.get("text", "") for c in content if isinstance(c, dict)
                    )
                return str(content or "")
    except OSError:
        pass
    return ""

def main() -> int:
    raw = sys.stdin.read()
    try:
        data = json.loads(raw)
    except Exception:
        print("[session-wrap] SessionEnd 훅 입력이 올바른 JSON이 아닙니다.", file=sys.stderr)
        return 2
    if not isinstance(data, dict):
        print("[session-wrap] SessionEnd 훅 입력이 객체가 아닙니다.", file=sys.stderr)
        return 2

    sid = data.get("session_id")
    if not isinstance(sid, str) or not sid:
        print("[session-wrap] session_id가 없어 큐 등록을 건너뜁니다.", file=sys.stderr)
        return 2
    if not SID_RE.match(sid):
        print("[session-wrap] 안전하지 않은 session_id 형식이라 큐 등록을 거부했습니다.", file=sys.stderr)
        return 2

    tpath = data.get("transcript_path")
    if not isinstance(tpath, str) or not tpath:
        print("[session-wrap] transcript_path가 없어 큐 등록을 건너뜁니다.", file=sys.stderr)
        return 2
    tpath = normalize(tpath)

    cwd = data.get("cwd") if isinstance(data.get("cwd"), str) else ""
    reason = data.get("reason") if isinstance(data.get("reason"), str) else "unknown"

    if not os.path.isfile(tpath):
        return 0
    try:
        with open(tpath, "rb") as f:
            lines = sum(1 for _ in f)
    except OSError:
        return 0
    if lines < MIN_LINES:
        return 0

    omc_dir = os.path.join(claude_root(), ".omc")
    queue_dir = os.path.join(omc_dir, "pending-wraps")
    os.makedirs(queue_dir, exist_ok=True)
    dest = os.path.join(queue_dir, sid + ".json")
    if os.path.lexists(dest):
        return 0

    # 방어선 1: 자동화 루프의 고정 프롬프트는 큐에 넣지 않는다.
    prompt = first_user_prompt(tpath)
    for prefix in load_ignore(omc_dir):
        if prompt.startswith(prefix):
            return 0

    # 방어선 2: 큐가 이미 넘치면 더 쌓지 않는다.
    try:
        pending = sum(1 for n in os.listdir(queue_dir) if n.endswith(".json"))
    except OSError:
        pending = 0
    if pending >= MAX_QUEUE:
        print("[session-wrap] 대기 큐가 %d개라 등록을 멈췄습니다. /session-wrap으로 정리하세요."
              % pending, file=sys.stderr)
        return 0

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    payload = {
        "session_id": sid,
        "transcript_path": tpath,
        "cwd": normalize(cwd),
        "reason": reason,
        "ended_at": now,
        "queued_at": now,
    }

    fd, tmp = tempfile.mkstemp(prefix=".queue.", dir=queue_dir)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        os.chmod(tmp, 0o600)
        os.replace(tmp, dest)
    except Exception:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise
    return 0

if __name__ == "__main__":
    sys.exit(main())

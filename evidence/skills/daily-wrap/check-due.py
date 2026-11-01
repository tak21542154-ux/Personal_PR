#!/usr/bin/env python3
"""SessionStart hook: report overdue daily wraps as factual context."""
import glob
import json
import os
import sys
from datetime import date, datetime, timedelta

# 콘솔 코드페이지와 무관하게 훅 출력을 UTF-8로 고정한다 (Windows cp949 대비).
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

# 원하는 저장 위치로 바꿀 수 있습니다. (session-wrap/SKILL.md, daily-wrap/SKILL.md와 같은 값이어야 합니다)
HOME = os.environ.get("USERPROFILE") or os.path.expanduser("~")
SESSION_WRAP_DIR = os.path.join(HOME, "Documents", "Session Wraps")
DAILY_WRAP_DIR = os.path.join(HOME, "Documents", "Daily Wrap")

LATE_HOUR = 23

def count_wraps(d: str) -> int:
    if not os.path.isdir(SESSION_WRAP_DIR):
        return 0
    return len([p for p in glob.glob(os.path.join(SESSION_WRAP_DIR, "%s-*.md" % d))
                if os.path.isfile(p)])

def main() -> int:
    today = date.today()
    yesterday = today - timedelta(days=1)
    t, y = today.isoformat(), yesterday.isoformat()

    today_file = os.path.join(DAILY_WRAP_DIR, "%s-데일리랩.md" % t)
    yesterday_file = os.path.join(DAILY_WRAP_DIR, "%s-데일리랩.md" % y)

    needed = []
    if not os.path.isfile(yesterday_file):
        n = count_wraps(y)
        if n > 0:
            needed.append("%s (어제, %d개 세션)" % (y, n))
    if datetime.now().hour >= LATE_HOUR and not os.path.isfile(today_file):
        n = count_wraps(t)
        if n > 0:
            needed.append("%s (오늘, %d개 세션)" % (t, n))

    if not needed:
        return 0

    msg = (
        "[Daily-Wrap 상태] 아직 데일리 기록이 없는 날짜: %s. "
        "사용 가능한 명령: 어제는 /daily-wrap 어제, 오늘은 /daily-wrap." % " + ".join(needed)
    )
    print(json.dumps(
        {"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": msg}},
        ensure_ascii=True,
    ))
    return 0

if __name__ == "__main__":
    sys.exit(main())

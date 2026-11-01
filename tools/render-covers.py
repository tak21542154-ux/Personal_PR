# 문서(PDF·PPTX)의 표지와 대표 쪽을 이미지로 뽑아 후보 폴더(_s/cand2/<id>/)에 넣는다. 눈으로 고른 뒤 mask·resize 해서 assets/img 로 옮긴다.
# 원본 위치는 저장소 밖(tools/.cover-sources.json, 무시 파일)에서 읽는다.
#   { "<항목 id>": [ { "src": "<PDF 또는 PPTX 경로>", "pages": [1, 2, 3] } ] }
# 사용: python -X utf8 tools/render-covers.py [항목 id ...]   (PPTX 는 PowerPoint 가 설치된 PC 에서만)
import json
import os
import shutil
import subprocess
import sys

import fitz  # PyMuPDF

OUT = "_s/cand2"
CFG = json.load(open("tools/.cover-sources.json", encoding="utf-8"))
want = sys.argv[1:] or list(CFG)
os.makedirs(OUT, exist_ok=True)

PS = r"""
param([string]$src, [string]$dst, [string]$pages)
$pp = New-Object -ComObject PowerPoint.Application
try {
  $pres = $pp.Presentations.Open($src, $true, $false, $false)
  foreach ($n in $pages.Split(',')) {
    $i = [int]$n
    if ($i -le $pres.Slides.Count) { $pres.Slides.Item($i).Export((Join-Path $dst ("p" + $i + ".png")), "PNG", 1280, 720) }
  }
  $pres.Close()
} finally { $pp.Quit() }
"""
open(os.path.join(OUT, "_export.ps1"), "w", encoding="utf-8-sig").write(PS)

for iid in want:
    for k, c in enumerate(CFG[iid]):
        src, pages = c["src"], c.get("pages", [1])
        d = os.path.join(OUT, iid, f"s{k}")
        os.makedirs(d, exist_ok=True)
        if src.lower().endswith(".pdf"):
            try:
                doc = fitz.open(src)
                for p in pages:
                    if p <= len(doc):
                        pix = doc[p - 1].get_pixmap(matrix=fitz.Matrix(1.6, 1.6))
                        pix.save(os.path.join(d, f"p{p}.png"))
            except Exception as e:
                print("PDF 실패", iid, src[-40:], e)
        else:
            tmp = os.path.join(OUT, "_src")
            os.makedirs(tmp, exist_ok=True)
            local = os.path.join(tmp, f"{iid}_{k}.pptx")
            try:
                shutil.copyfile(src, local)
                r = subprocess.run(["powershell", "-NoProfile", "-File", os.path.join(OUT, "_export.ps1"), os.path.abspath(local), os.path.abspath(d), ",".join(map(str, pages))], capture_output=True, text=True, timeout=240)
                if r.returncode:
                    print("PPTX 실패", iid, r.stderr[:120])
            except Exception as e:
                print("PPTX 실패", iid, e)
        print("완료", iid, k, sorted(os.listdir(d)))

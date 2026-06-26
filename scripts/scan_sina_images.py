#!/usr/bin/env python3
"""
扫描仓库中所有 sinaimg.cn 和 imgs.ovh 格式的图片链接
输出：文件路径、行号、完整URL
"""

import os
import re
from pathlib import Path

# 匹配需要替换的图床域名（含 http/https 变体）
DOMAINS = ['sinaimg\\.cn', 'imgs\\.ovh']
URL_PATTERN = re.compile(r'https?://[^/\\s\\)\\"\\\'\\>\\]]*(' + '|'.join(DOMAINS) + r')/[^\\s\\)\\"\\\'\\>\\]]+')

# 扫描的文件扩展名
EXTENSIONS = {'.md', '.html', '.js', '.css', '.json', '.yml', '.yaml'}

# 忽略的目录
IGNORE_DIRS = {'.git', 'node_modules', 'public', 'resources', '.claude'}


def scan_file(filepath: Path) -> list[dict]:
    """扫描单个文件，返回匹配的链接列表"""
    results = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                for match in URL_PATTERN.finditer(line):
                    results.append({
                        'file': str(filepath),
                        'line': line_num,
                        'url': match.group(),
                        'context': line.strip(),
                    })
    except (UnicodeDecodeError, PermissionError):
        pass
    return results


def main():
    repo_root = Path(__file__).parent.parent
    all_results = []
    file_count = 0

    for root, dirs, files in os.walk(repo_root):
        # 跳过忽略目录
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for filename in files:
            if Path(filename).suffix.lower() not in EXTENSIONS:
                continue
            filepath = Path(root) / filename
            results = scan_file(filepath)
            if results:
                file_count += 1
                all_results.extend(results)

    # 输出报告
    print(f"=" * 70)
    print(f"扫描结果：共 {len(all_results)} 处待替换链接")
    print(f"涉及文件：{file_count} 个")
    print(f"=" * 70)

    # 按文件分组输出
    current_file = None
    for r in all_results:
        if r['file'] != current_file:
            current_file = r['file']
            rel_path = Path(current_file).relative_to(repo_root)
            print(f"\n📄 {rel_path}")
        print(f"   第 {r['line']:>3} 行 | {r['url']}")

    print(f"\n{'=' * 70}")
    print(f"汇总：{len(all_results)} 个链接待替换")
    print(f"目标域名：image.theworldr4.eu.org")


if __name__ == '__main__':
    main()

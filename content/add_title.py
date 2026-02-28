import os
import re
import glob

base_dir = '/Users/yusufabdulaziz/quartz/content'
index_files = glob.glob(f'{base_dir}/**/Index.md', recursive=True) + glob.glob(f'{base_dir}/Index.md')
# deduplicate just in case
index_files = list(set(index_files))

for filepath in index_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the first H1
    h1_match = re.search(r'^#\s+(.+)$', content, flags=re.MULTILINE)
    title = h1_match.group(1).strip() if h1_match else "Index"

    # remove emojis or special chars optionally, but quotes are safer
    title = title.replace('"', '\\"')

    # Check if there is frontmatter
    if content.startswith('---'):
        # Has frontmatter, check if title already exists
        if not re.search(r'^title:\s+', content, flags=re.MULTILINE):
            # inject title
            content = re.sub(r'(---\n)', f'\\1title: "{title}"\n', content, count=1)
    else:
        # No frontmatter
        new_frontmatter = f'---\ntitle: "{title}"\n---\n'
        content = new_frontmatter + content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated {filepath} with title: {title}")

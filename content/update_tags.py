import os
import re

updates = {
    '01_Core_Concepts': ['touchdesigner', 'td/core'],
    '02_The_Operators': ['touchdesigner', 'td/operators'],
    '03_Rendering_and_Output': ['touchdesigner', 'td/rendering'],
    '04_Scripting_and_Architecture': ['touchdesigner', 'td/architecture'],
    '05_Connectivity_and_Shaders': ['touchdesigner', 'td/connectivity'],
    '06_Recipes_and_Projects': ['touchdesigner', 'td/recipes']
}

base_dir = '/Users/yusufabdulaziz/quartz/content'

for folder, module_tags in updates.items():
    folder_path = os.path.join(base_dir, folder)
    if not os.path.exists(folder_path): continue
    for f in os.listdir(folder_path):
        if not f.endswith('.md'): continue
        filepath = os.path.join(folder_path, f)
        
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = parts[1]
                body = parts[2]
                
                # We extract the existing tags
                # A simple regex to find the tags block:
                tag_match = re.search(r'tags:\s*\n((?:\s*-[^\n]*\n)*)', frontmatter)
                
                existing_tags = set()
                if tag_match:
                    tag_lines = tag_match.group(1).split('\n')
                    for line in tag_lines:
                        line = line.strip()
                        if line.startswith('-'):
                            tag = line[1:].strip()
                            existing_tags.add(tag)
                    
                    # Remove the old tags block from frontmatter
                    frontmatter = frontmatter.replace(tag_match.group(0), '')
                
                final_tags = set(module_tags)
                for t in existing_tags:
                    if t != 'touchdesigner' and not t.startswith('td/'):
                         final_tags.add(t)
                
                tag_block = "tags:\n"
                tag_block += f"  - touchdesigner\n"
                tag_block += f"  - {module_tags[1]}\n"
                for t in sorted(list(final_tags)):
                    if t not in ['touchdesigner', module_tags[1]]:
                        tag_block += f"  - {t}\n"
                
                clean_fm_lines = [l for l in frontmatter.split('\n') if l.strip()]
                new_frontmatter = "\n".join(clean_fm_lines)
                if new_frontmatter:
                    new_frontmatter += "\n"
                new_frontmatter += tag_block
                
                new_content = "---\n" + new_frontmatter.strip() + "\n---\n" + body.lstrip()
                
                with open(filepath, 'w', encoding='utf-8') as out_file:
                    out_file.write(new_content)
        elif content.strip() != "":
            tag_block = "tags:\n"
            tag_block += f"  - touchdesigner\n"
            tag_block += f"  - {module_tags[1]}\n"
            new_content = "---\n" + tag_block + "---\n" + content
            with open(filepath, 'w', encoding='utf-8') as out_file:
                 out_file.write(new_content)

print("Tags updated successfully!")

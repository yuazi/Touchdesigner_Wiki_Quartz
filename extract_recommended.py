import os
import re
import fitz

# Define the tasks for the recommended slides
tasks = [
    (
        "content/notes/mpl/pdfs/Lecture 01 --- Introduction.pdf",
        "content/notes/mlp/01-introduction.md",
        89,
        "Lecture01_Pg089_Patterns_In_Backward_Flow.png",
        "![[Lecture01_Pg090_Patterns_In_Backward_Flow.png]]" # Replaces/adds to existing
    ),
    (
        "content/notes/mpl/pdfs/Lecture 01 --- Introduction.pdf",
        "content/notes/mlp/01-introduction.md",
        98,
        "Lecture01_Pg098_Saturated_Neurons_Kill_The_Gradients.png",
        "## Sigmoid — The Old Standard"
    ),
    (
        "content/notes/mpl/pdfs/Lecture 01 --- Introduction.pdf",
        "content/notes/mlp/01-introduction.md",
        83,
        "Lecture01_Pg083_Mini_Batch_Training.png",
        "![[Lecture01_Pg082_Mini_Batch_Training.png]]"
    ),
    (
        "content/notes/mpl/pdfs/Lecture 06 --- ViT.pdf",
        "content/notes/mlp/06-vit.md",
        9,
        "Lecture06_Pg009_Vision_Transformer_Replacing_Cnns_With_Self_Attention.png",
        "## Inspiration from NLP"
    ),
    (
        "content/notes/mpl/pdfs/Lecture 09 --- GenAI VAE.pdf",
        "content/notes/mlp/09-vae.md",
        50,
        "Lecture09_Pg050_Variational_Autoencoders_Evidence_Lower_Bound_Elbo.png",
        "### Evidence Lower Bound (ELBO)"
    ),
    (
        "content/notes/mpl/pdfs/Lecture 09 --- GenAI VAE.pdf",
        "content/notes/mlp/09-vae.md",
        71,
        "Lecture09_Pg071_Variational_Autoencoders_Reparametrisation_Trick.png",
        "### 🧠 Deep Dive: The Reparameterization Trick"
    ),
    (
        "content/notes/mpl/pdfs/Lecture 10 --- GANs.pdf",
        "content/notes/mlp/10-gans.md",
        44,
        "Lecture10_Pg044_Generative_Adversarial_Networks_Gans_Gans_Vs_Vae.png",
        "## Summary"
    ),
    (
        "content/notes/mpl/pdfs/Lecture 10 --- GANs.pdf",
        "content/notes/mlp/10-gans.md",
        62,
        "Lecture10_Pg062_Applications_Cyclegan_Overview.png",
        "## CycleGAN"
    ),
    (
        "content/notes/mpl/pdfs/Lecture 12 --- Diffusion.pdf",
        "content/notes/mlp/12-diffusion.md",
        63,
        "Lecture12_Pg063_Text_Guided_Diffusion_Models.png",
        "## Text-to-Image Generation"
    )
]

base_dir = "/Users/yusufabdulaziz/quartzyus"

def insert_placeholder(md_path, image_name, anchor):
    full_path = os.path.join(base_dir, md_path)
    if not os.path.exists(full_path): return
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if image_name in content: return
    
    placeholder = f"\n\n![[{image_name}]]\n\n<p class=\"image-caption\">Most complete version of this build sequence.</p>\n"
    if anchor in content:
        content = content.replace(anchor, anchor + placeholder)
    else:
        if "## Summary" in content:
            content = content.replace("## Summary", placeholder + "## Summary")
        elif "## References" in content:
            content = content.replace("## References", placeholder + "## References")
        else:
            content += placeholder
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

def extract_screenshot(pdf_path, page_num, output_path):
    full_pdf = os.path.join(base_dir, pdf_path)
    full_out = os.path.join(base_dir, output_path)
    if not os.path.exists(os.path.dirname(full_out)): os.makedirs(os.path.dirname(full_out))
    doc = fitz.open(full_pdf)
    page = doc[page_num - 1]
    mat = fitz.Matrix(5, 5)
    pix = page.get_pixmap(matrix=mat)
    pix.save(full_out)
    print(f"Extracted {output_path}")

for pdf_path, md_path, pg, img, anchor in tasks:
    lec_num = re.search(r'Lecture (\d+)', pdf_path).group(1)
    out_path = f"content/pictures/mpl/{lec_num}/{img}"
    extract_screenshot(pdf_path, pg, out_path)
    insert_placeholder(md_path, img, anchor)

print("All recommended extractions completed.")

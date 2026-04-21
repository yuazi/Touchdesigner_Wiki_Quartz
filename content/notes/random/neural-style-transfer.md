---
title: "Real-time Neural Style Transfer"
tags:
  - touchdesigner
  - td/recipes
  - deep-learning
  - mlp
  - onnx
date: 2026-03-12
---

> **Inspired by:** [Gatys et al. (A Neural Algorithm of Artistic Style)](https://arxiv.org/abs/1508.06576)

I’ve been looking for a way to actually "see" the concepts from my [[/notes/mlp/02-cnn|CNN theory]] notes in a live environment. Neural Style Transfer (NST) turns out to be the answer—it uses a pre-trained network to "repaint" your camera feed using the visual DNA of a specific artwork. Since optimization loops are too slow for real-time work, I reach for **Feed-forward Style Transfer** to keep things running at a steady 60fps.

> [!info] Operator Families in this Recipe
>
> - **Script TOP (Texture Operators):** Used as the Python bridge to run OpenCV’s DNN module.

---

## Part 1: Setup & Models

The first step is hooking up your camera and pointing TouchDesigner to the right model file.

1.  **Video Device In TOP:** This is your "eye." It pulls the feed from your MacBook's webcam. 
2.  **Script TOP:** Create a **Script TOP** and connect your camera to its input. This acts as the Python bridge.
3.  **Model Selection:** You'll need a pre-trained `.onnx` file. You can grab these from the [ONNX Model Zoo](https://github.com/onnx/models) under the **Vision > Image Manipulation** section (look for "Fast Neural Style Transfer"). 

> [!tip] Hugging Face
> Many models from the ONNX Zoo have moved to [Hugging Face](https://huggingface.co/onnxmodelzoo). If the GitHub link is down, check there for the latest `.onnx` versions.

### Recommended Models
Different models have different "personalities." Here are the ones that work best for real-time:
- **`mosaic`**: Very strong, geometric textures. Great for high-contrast scenes.
- **`udnie`**: A mix of sharp lines and muted colors. Very "painterly."
- **`rain-princess`**: Bright, vibrant blues and yellows. Very expressive.
- **`candy`**: High-saturation, smooth shapes. Great for colorful lighting.
- **`pointilism`**: Soft, dotted textures. Perfect for subtle, dreamy looks.

4.  **Custom Page:** Open the script callbacks and add a file parameter in the `onSetupParameters` function.
    ```python
    def onSetupParameters(scriptOp):
        page = scriptOp.appendCustomPage('Style')
        page.appendFile('Modelpath', label='ONNX Model Path')
    ```
5.  **Assign Model:** Point the new **Model Path** parameter to your downloaded `.onnx` file.

---

## Part 1.5: How Model Paths Work

When the code asks for a **Model Path**, it’s looking for the literal address of the `.onnx` file on your MacBook's hard drive.

- **The Address:** Something like `/Users/yourname/Downloads/mosaic.onnx`.
- **The Shortcut:** Instead of typing it out, you can click the **folder icon** next to the **Model Path** parameter or simply **drag and drop** the file from your Finder directly onto the parameter field in TouchDesigner.
- **The Code Logic:** The script uses `scriptOp.par.Modelpath.eval()` to grab that address and pass it to OpenCV. If the path is wrong, the network won't load and you'll get a black screen.

> [!tip] Troubleshooting Paths
> If it's not working, open the **Textport** (`Alt+T`). If you see an error like `cv2.error: ... can't open file`, it means the path is pointing to a file that doesn't exist or is in a folder TouchDesigner can't access.

---

## Part 2: The Inference Loop

The `onCook` callback handles the data flow: taking pixels from the input, running them through the neural net, and copying them back to the TOP.

1.  **Initialize the Net:** Load the model once and store it in a global variable so it doesn't reload every frame.
2.  **Prepare the Image:** Convert the incoming TOP data into a 0-255 RGB Numpy array.
3.  **Run Inference:** Use `cv2.dnn.blobFromImage` to format the data and `net.forward()` to get the result.

```python
import cv2
import numpy as np

net = None

def onCook(scriptOp):
    global net
    model_path = scriptOp.par.Modelpath.eval()
    if not model_path: return

    # Load the net once
    if net is None:
        net = cv2.dnn.readNetFromONNX(model_path)
        # Optimized for M1 Pro (Apple Silicon):
        net.setPreferableBackend(cv2.dnn.DNN_BACKEND_DEFAULT)
        net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)

    # 1. Grab pixels
    input_img = scriptOp.inputs[0].numpyArray(delayed=True)
    
    # 2. Convert to 0-255 RGB
    input_img = (input_img[:, :, :3] * 255).astype(np.uint8)
    
    # 3. Predict
    blob = cv2.dnn.blobFromImage(input_img, 1.0, (640, 480), (103.9, 116.7, 123.6), swapRB=False)
    net.setInput(blob)
    output = net.forward()

    # 4. Clean up for TD (H, W, 4)
    output = output.reshape(3, output.shape[2], output.shape[3]).transpose(1, 2, 0)
    output = np.clip(output, 0, 255) / 255.0
    h, w, _ = output.shape
    final = np.ones((h, w, 4), dtype=np.float32)
    final[:, :, :3] = output

    scriptOp.copyNumpyArray(final)
```

---

## Part 3: Mac Optimization

Running neural networks in Python can bottleneck quickly. Since we're on an M1 Pro, I use a few tricks to keep the UI from locking up.

1.  **Delayed Arrays:** Setting `delayed=True` in the `numpyArray` call prevents the CPU from waiting for the GPU to finish, which stops the UI from stuttering.
2.  **Resolution Scaling:** I usually run the inference at `640x480` or even `320x240`. Style transfer is very forgiving—you can scale it back up with a **Resolution TOP** and the painterly textures hide the low-res artifacts perfectly.

---

## Troubleshooting

- **"The UI is lagging!"** — Lower the resolution in `blobFromImage`. Python is single-threaded, so heavy inference will eat your frame time.
- **"It's just a black screen."** — Ensure your input image isn't empty and that the `Modelpath` parameter is pointing to a valid ONNX file.
- **"The colors look weird."** — Toggle `swapRB` in the `blobFromImage` function; some models expect BGR instead of RGB.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Model Resolution** | Higher = more detail but slower FPS; Lower = faster but "blockier" textures. |
| **Delayed Array** | `True` keeps the UI responsive; `False` can cause micro-stutters during heavy loads. |
| **Backend Target** | M1 Pro works best with `DNN_TARGET_CPU` for standard OpenCV DNN calls. |

---

## Network Architecture

Here is how the data flows through the operator and the Python script:

```text
[ VIDEO INPUT ] ──▶ [ Script TOP ] ──▶ [ Resolution TOP ] ──▶ [ OUT ]
                        │
                        ▼
                [ onCook Callback ]
                        │
                ( Numpy Array Conversion )
                        │
                ( OpenCV DNN Inference )
                        │
                ( Normalize & Copy Back )
```

### Data Flow Explanation
1.  **Input:** A live camera feed or pre-recorded video enters the `Script TOP`.
2.  **Conversion:** We pull the texture data into Python as a Numpy array.
3.  **Inference:** The OpenCV library crunches the numbers based on the latent space of the artwork we're mimicking.
4.  **Upscaling:** Since we run the heavy math at low res, the `Resolution TOP` brings it back to full screen for display.

---

## See Also

- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|(y-) Python in TouchDesigner]] — More on how to use external libraries like OpenCV.
- [[/notes/mlp/01-introduction|(y-) Introduction to Machine Learning]] — The foundation for understanding how networks "see."
- [[work/index|(y) The Workshop]] — Other creative coding experiments and finished projects.

---
[[notes/index|(y) Return to Notes]] | [[notes/random/index|(y) Return to Random Hub]] | [[/index|(y) Return to Home]]

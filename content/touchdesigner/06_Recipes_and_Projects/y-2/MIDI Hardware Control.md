---
title: "MIDI Hardware Control"
tags:
  - touchdesigner
  - td/recipes
  - midi
  - control
  - performance
  - recipes
date: 2026-05-26
---

Connect a physical MIDI controller - knobs, sliders, pads - to your TouchDesigner patch and control any visual parameter in real time. This is the foundation of a live VJ performance rig, turning a hardware controller into a fully custom control surface.

> [!info] Operator Families in this Recipe
>
> - **CHOPs (Channel Operators):** Reading, filtering, and routing MIDI signal data.

---

## Before You Start

You need a MIDI controller (e.g., Arturia MiniLab, Novation Launch Control, KORG nanoKONTROL). Connect it via USB. Most modern controllers are class-compliant and require no extra drivers - they appear instantly in TouchDesigner.

---

## Part 1: Read the MIDI Signal

1. Press **Tab** and add a **MIDI In CHOP**.
2. Set the **Device** parameter to your controller's name (the dropdown shows all connected MIDI devices).
3. Set **Active** → `On`.
4. Wiggle a knob or move a slider on your controller.

New channels will appear in the CHOP viewer. Each channel represents one physical control on your device.

> [!info] Channel Naming Convention
> - **Knobs and sliders (CC messages):** Named `ch1_ctrl[N]` where N is the CC number. For example, `ch1_ctrl7` = CC 7 on MIDI channel 1.
> - **Pads and keys (Note messages):** Named `ch1_note[N]` where N is the MIDI note number.
> - **Pitch bend:** Named `ch1_pitch`.
>
> Move each control once to see exactly what channel it sends.

---

## Part 2: Extract Specific Controls

1. Add a **Select CHOP** after the MIDI In CHOP.
2. In the **Channel Names** field, type the names of the channels you want, separated by spaces (e.g., `ch1_ctrl1 ch1_ctrl7 ch1_ctrl10`).
3. Add a **Rename CHOP** after the Select CHOP.
   - In the **From** field (top line), list the original channel names.
   - In the **To** field (bottom line), list your new meaningful names: `brightness`, `hue`, `speed`.

---

## Part 3: Remap to Useful Ranges

Raw MIDI values are integers from `0` to `127`. Most visual parameters expect values in a `0` to `1` range.

1. Add a **Math CHOP** after the Rename CHOP.
2. Go to the **Range** tab:
   - **From Range:** `0` to `127`.
   - **To Range:** `0` to `1` (for most parameters).
   - For hue offset: use `0` to `360`. For rotation speed: use `-1` to `1`.
3. Connect to a **Null CHOP** named `CTRL`.

---

## Part 4: Bind to Visual Parameters

1. Make `CTRL` active by clicking the **+** icon in its bottom-right corner.
2. Navigate to the visual parameter you want to control (e.g., **Brightness 1** on a Level TOP).
3. Click and drag the channel from the CTRL viewer directly onto the parameter name.
4. In the popup menu, select **CHOP Reference** for a live connection.

---

## Part 5: Example VJ Setup

Build a minimal performance rig by mapping three controls:

| Controller | Channel | Mapped to |
| ---------- | ------- | --------- |
| Knob 1 | `brightness` | Level TOP - Brightness |
| Knob 2 | `hue` | HSV Adjust TOP - Hue Offset |
| Fader 1 | `speed` | Noise TOP - Period (animation speed) |

Now you can reshape the visuals live with your hands while the music plays.

---

## Part 6: Using Pads as Scene Triggers

Pads send Note On (value = 64 or 127) and Note Off (value = 0) messages. To turn a pad press into a one-shot trigger:

1. Add a **Select CHOP** and grab the pad's channel (e.g., `ch1_note36`).
2. Add a **Trigger CHOP** after it.
   - This converts the Note On/Off pair into a single clean pulse (0 to 1 and back).
3. Feed the Trigger CHOP into a **Count CHOP** to cycle through visual scenes on each pad hit.

---

## Troubleshooting

- **"No channels appear after wiggling controls."** - Check that **Active** is `On` on the MIDI In CHOP and try toggling it off and on again. Confirm the correct device is selected.
- **"Values jump erratically."** - Raw MIDI is integers; add a **Lag CHOP** (Lag In/Out: `0.04`) between the Rename CHOP and the Null CHOP to smooth movement.
- **"Wrong channel prefix (ch2_ instead of ch1_)."** - Most controllers default to MIDI channel 1. Check your controller's settings menu.
- **"Pad stays at 127 and never returns to 0."** - This is a Note On message. Use a **Trigger CHOP** to convert the on/off pair into a proper pulse.

---

## Next Steps

- **Template it:** Build this MIDI rig once, save as a `.tox`, and drop it into any future project for instant hardware control.
- **MIDI Clock sync:** Use the **MIDI In DAT** with "MIDI Clock" mode to receive BPM timing pulses from an Ableton session and sync your visual tempo.
- **Two-way feedback:** Use a **MIDI Out CHOP** to send values back to the controller (if it supports motorized faders or LED rings) for tactile visual feedback.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Select CHOP Filter** | Narrow (specific names) = clean signal; Wildcard (`ch1_ctrl*`) = pass all CC from device. |
| **Math Remap To Range** | Change to match what the target parameter expects (e.g., `-180` to `180` for rotation). |
| **Lag Smoothing** | Higher = smooth, weighted knob feel; Lower = instant, snappy response to fast turns. |
| **Trigger CHOP** | Converts note-on/off into a clean 0-to-1 pulse - ideal for scene switching and particle bursts. |

## Network Architecture

```text
[ MIDI DEVICE ]
Controller ──────────────────────▶ MIDI In CHOP
                                         │
                                         ▼
                                  Select CHOP
                                  (ch1_ctrl1, ch1_ctrl7...)
                                         │
                                         ▼
                                  Rename CHOP
                                  (brightness, hue...)
                                         │
                                         ▼
                                  Math CHOP
                                  (0-127 → 0-1)
                                         │
                                         ▼
                                  Lag CHOP (optional smooth)
                                         │
                                         ▼
                              Null CHOP (CTRL) ──▶ CHOP Reference ──▶ Visual Parameters
```

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]

---
title: "09_VR-AR - Perception and Psychology"
tags:
  - vrar
  - perception
  - psychology
  - attention
  - gestalt
date: 2026-06-13
---

[[/notes/lectures/virtualaugmentedreality/08_VR-AR_VisualCoherence|Previous: (y-08) Visual Coherence]] | [[/notes/lectures/virtualaugmentedreality/index|VR/AR Index]]

## Mental Model First

- Earlier lectures asked the system to deliver pixels that match the world geometrically (tracking, calibration, coherence). This lecture asks what the brain on the other side of those pixels is actually doing with them.
- Perception is sensory input plus interpretation. Two viewers can stare at the same scene and see different things because attention, prior knowledge, and gestalt grouping shape what reaches awareness.
- In VR and AR the rules from 2D visualization research (Cleveland and McGill, preattentive features, gestalt laws) do not transfer directly. Depth and size are underestimated. Colour fights real or synthetic backgrounds. New cues like binocular disparity become available.
- Attention is the bottleneck. Designers can either work with it (preattentive features, gestalt grouping) or guide it deliberately (highlights, blur, motion, dichoptic disparity), trading naturalness against effectiveness.
- VR and AR are not only a display technology but a psychological intervention: the same property that fools depth perception can also be used therapeutically for anxiety, OCD, or negative thought patterns.

## 1. What Is Perception

### A Collection Of Aphorisms

![[pictures/virtualaugmentedreality/09/Lecture09_Pg002_What_Is_Perception_Quotes.png]]

<p class="image-caption">Four quotes (Riordan, Bergson, Planck, Huxley) framing the lecture: humans see what they want to see, what the mind is prepared to comprehend, and what their stance on the world allows.</p>

The four quotes are the lecture's hook. Perception is not a passive readout of the optic array; it is filtered by expectation, mood, task, and prior experience. That filtering is what makes VR illusions possible (and what makes them fragile).

### Sensory Pathway And A Working Definition

![[pictures/virtualaugmentedreality/09/Lecture09_Pg003_What_Is_Perception_Definition.png]]

<p class="image-caption">Sensory organs (eye, ear, nose, tongue, skin) deliver information to specialized cortices via thalamus and brain stem. Visual perception is the process of understanding and interpreting what the eyes see.</p>

Sensory organs receive information and pass it to the relevant cortex; the brain then converts physical input into smell or sight. The working definition for the rest of the lecture is narrower: visual perception is the process of understanding and interpreting what our eyes see.

## 2. Why Perception Matters For VR And AR

![[pictures/virtualaugmentedreality/09/Lecture09_Pg004_Why_Is_This_Important.png]]

<p class="image-caption">For visualization and graphics, perception research gives optimized presentation and helps hidden structure emerge. With AR/VR the presentation space grows, and the need for an optimized layout grows with it.</p>

- Visualization and graphics: perception research tells us how to encode quantitative and qualitative information so that people can see patterns and outliers. The classical 2D theory underwrites every chart we draw.
- AR and VR: the presentation space jumps from a flat screen to a whole room or world. More space means more freedom, but also more chances to bury the signal. The perceptual question becomes how to lay out information in a 3D environment that the user navigates with their head and body.

## 3. Graphical Perception In 2D

![[pictures/virtualaugmentedreality/09/Lecture09_Pg005_Graphical_Perception_In_2d.png]]

<p class="image-caption">Cleveland and McGill (1984): elementary perceptual tasks ranked by human accuracy. Position on a common scale is most accurate, then non-aligned position, length, direction, angle, area, volume, curvature, shading and colour saturation.</p>

Cleveland and McGill built the foundation by identifying elementary perceptual tasks: position on a common scale, position on non-aligned scales, length, direction, angle, area, volume, curvature, and shading or colour saturation. They ordered these by human accuracy. This ranking still drives chart-type decisions in 2D: a bar chart (position, length) outperforms a pie chart (angle, area) for reading numbers.

## 4. Graphical Perception In 3D

![[pictures/virtualaugmentedreality/09/Lecture09_Pg006_Graphical_Perception_In_3d.png]]

<p class="image-caption">From small multiples on a 2D screen to a single 3D cube on screen to immersive cube in AR/VR. Findings from 2D do not translate directly: AR mixes real and virtual, VR makes data harder to perceive at all.</p>

The 2D ranking does not survive the move to 3D. Two complications appear:

- AR: the real world potentially interferes with the data. Colour, illumination, and occlusion of the surrounding environment compete with the visual encoding.
- VR: data is harder to perceive in a virtual environment, because depth and size perception themselves are degraded.

The rest of the lecture works through the specific visual features that break.

### 4.1 Depth

![[pictures/virtualaugmentedreality/09/Lecture09_Pg007_Visual_Features_Depth.png]]

<p class="image-caption">Egocentric depth (observer to target) and exocentric depth (between two targets) are both underestimated in AR and VR. Visual adjustments, sensory feedback, presence, stereopsis and motion can claw some of it back.</p>

Two flavours of depth, both biased the same way:

- Egocentric depth: distance from observer to target. Underestimated in both AR and VR. Counter-measures include visual property tweaks (shadows, lighting coherence), sensory feedback, and stronger sense of presence.
- Exocentric depth: distance between two targets in the scene. Also underestimated. Stereopsis and motion parallax help.

For data visualization in VR this matters because relative positions encode quantities; if depth is systematically compressed the chart lies.

### 4.2 Size

![[pictures/virtualaugmentedreality/09/Lecture09_Pg008_Visual_Features_Size.png]]

<p class="image-caption">A linear relationship exists between size and depth-judgement error. Size is underestimated in virtual environments, and depends on display and environment context. Avatar hand realism (Ogawa et al.) and AR display type (Ahn et al.) modulate the effect.</p>

- Size and depth errors scale linearly: misjudging one biases the other.
- Size is underestimated in virtual environments.
- The effect depends on display type (HMD versus handheld AR) and on surrounding context. The avatar through which the user views the object (low-poly to photorealistic hand) shifts size perception measurably.

### 4.3 Colour In AR

![[pictures/virtualaugmentedreality/09/Lecture09_Pg009_Visual_Features_Color_Ar.png]]

<p class="image-caption">2D colour guidelines exist, but in AR the illumination and colours of the real world interfere with the virtual encoding (data viz overlaid on a building facade, situated visualization on a building exterior).</p>

The 2D guidelines for colour encoding (palettes, perceptual uniformity, colour-blind safe choices) carry over only in part. AR adds interference: real illumination and real surface colours mix with the virtual colours, and the same encoding looks different against different backgrounds.

### 4.4 Colour In VR

![[pictures/virtualaugmentedreality/09/Lecture09_Pg010_Visual_Features_Color_Vr.png]]

<p class="image-caption">VR has the same problem against the skybox and the terrain: virtual scatterplot colours fight a sky-blue background; red/green/blue squares are read differently when the sky is bright.</p>

In VR the interference comes from the virtual background instead of the real world. Skyboxes, terrain colours, and ambient lighting all push the apparent colour of the data marks around. Even a fully controlled virtual environment is not a neutral canvas; the background has to be designed alongside the encoding.

### 4.5 Graphical Perception In 3D Visualizations

![[pictures/virtualaugmentedreality/09/Lecture09_Pg011_Graphical_Perception_3d_Visualizations.png]]

<p class="image-caption">Research designs that test 3D graphical perception: point clouds and scatterplots, trend identification and outlier detection tasks, on 2D desktop versus handheld AR versus HMD, measured objectively (accuracy, time) and subjectively (ease of use).</p>

A typical study in this space looks like this:

- Visualization types: point cloud, scatterplot.
- Tasks important for data analysis: identifying trends, detecting outliers.
- Display types: 2D desktop, handheld AR, head-mounted VR.
- Measures: objective (accuracy, response time), subjective (ease of use).

This is the experimental scaffolding behind the depth, size, and colour findings above.

## 5. Visual Attention

### What Attention Is

![[pictures/virtualaugmentedreality/09/Lecture09_Pg012_Visual_Attention.png]]

<p class="image-caption">A rabbit photo next to the same photo with a saliency heatmap. Visual attention is a cognitive process that selects relevant information and filters out the rest. Overt attention moves the eyes; covert attention does not.</p>

Visual attention is the collection of cognitive processes that pick relevant information out of a scene and drop the irrelevant. Two modes:

- Overt attention: actively move the eyes to the area of interest.
- Covert attention: pay attention to an area without moving the eyes there.

Most heatmap-style eye tracking captures overt attention; covert attention has to be inferred from behaviour.

### The Visual System Has A Tiny Detail Window

![[pictures/virtualaugmentedreality/09/Lecture09_Pg013_Visual_System_Fixations_Saccades.png]]

<p class="image-caption">Only a small part of the visual field has detailed vision. To build a detailed impression of the scene the eye alternates between fixations (acquiring detail) and saccades (jumping to a new location).</p>

Detailed vision is restricted to the fovea (a tiny central patch). To collect detail across the scene the eye alternates fixations (where information is acquired) with saccades (rapid jumps to a new location, during which vision is suppressed). The subjectively continuous, sharp scene is reconstructed across many such samples.

### Preattentive Features

![[pictures/virtualaugmentedreality/09/Lecture09_Pg014_Preattentive_Features.png]]

<p class="image-caption">An orange dot among blue dots and an orange dot among red squares pop out within 200-250ms regardless of distractor count. Conjunctions of features (orange dot among blue dots and orange squares) require serial search.</p>

Preattentive features are visual properties detected within an initiation time of 200-250 ms. Two diagnostic properties:

- Performance does not degrade as the number of distractors grows.
- A conjunction of features (more than one visual property) cannot be detected preattentively and forces a serial search.

These are the building blocks of any "make this stand out" design decision.

### Feature Integration Theory

![[pictures/virtualaugmentedreality/09/Lecture09_Pg015_Preattentive_Features_Treisman.png]]

<p class="image-caption">Treisman's Feature Integration Theory: separate feature maps (red, green, yellow, blue, luminance, orientation, size, contrast) feed a master map of locations under a focus of attention.</p>

Treisman's Feature Integration Theory is the dominant account of preattentive processing. The model has separate feature maps (colour channels, luminance, orientation, size, contrast) and a master map of locations. Attention focuses on a location in the master map and binds the features at that location into an object. Preattentive features classify into target detection and boundary detection tasks, measured by accuracy and response time.

### Post-Attentive Amnesia

![[pictures/virtualaugmentedreality/09/Lecture09_Pg016_Post_Attentive_Amnesia.png]]

<p class="image-caption">Studies on how much of a scene people retain after viewing it. Letting people preview the scene before the search task does not improve their search time.</p>

A counter-intuitive result: even after attending to a scene, people do not retain enough to speed up a later visual search. Pre-exposure to the scene before a search task gives no benefit in search time. Memory of attended scenes is shallower than introspection suggests.

### Change Blindness

![[pictures/virtualaugmentedreality/09/Lecture09_Pg017_Change_Blindness.png]]

<p class="image-caption">The classic Simons and Levin (1998) "Door" Study: people fail to notice that the person they are talking to is swapped with a different person when a door briefly interrupts the view.</p>

Change blindness: viewers fail to notice large changes that happen during an interruption of the scene (a blink, a cut, a door passing through). The visual system relies on continuity of attention to flag change; remove the continuity and the change does not register.

### Inattentional Blindness

![[pictures/virtualaugmentedreality/09/Lecture09_Pg018_Inattentional_Blindness.png]]

<p class="image-caption">The Simons gorilla-style study: a salient object passes through the centre of the field of view while the viewer focuses on a counting task, and is not perceived.</p>

Inattentional blindness: salient objects in the direct field of view are not perceived if attention is occupied elsewhere. Famous demonstration is the basketball-counting study where a person in a costume walks through the scene and a sizeable fraction of viewers never see them.

The two blindnesses (change and inattentional) are the practical reason why "I put a label there, why didn't you read it?" is not a valid argument from a UX designer.

## 6. Benefits Of Visual Attention

![[pictures/virtualaugmentedreality/09/Lecture09_Pg019_Benefits_Of_Visual_Attention.png]]

<p class="image-caption">Two uses of attention research: attention guidance (steering the user) and interaction with scattered attention (designing for users whose attention is already split).</p>

Two practical pay-offs for a VR/AR designer:

- Attention guidance: deliberately steer the user's gaze toward a target.
- Interaction with scattered attention: build experiences that survive an audience whose attention is partial or split (passers-by in a museum, drivers glancing at an AR HUD).

The rest of section 6 unpacks the factors that determine where attention goes.

### 6.1 Subjective Goals, Tasks, And Depicted Content

![[pictures/virtualaugmentedreality/09/Lecture09_Pg020_Attention_Guidance_Goals.png]]

<p class="image-caption">A view of a garden with a small rabbit at the tree base; a grid of hand-drawn emoji faces. What you are looking for shapes what you see.</p>

The most powerful determinant: what the user is trying to do. The same scene reads differently when the task is "find the rabbit" versus "describe the lawn". For depicted content (like an emoji grid) the viewer's affective state changes which faces stand out.

### 6.2 Scene Context

![[pictures/virtualaugmentedreality/09/Lecture09_Pg021_Attention_Guidance_Scene_Context.png]]

<p class="image-caption">A kitchen interior and a city street: gist of the scene is recognized in roughly 100 ms, and that gist constrains what the viewer attends to next.</p>

Scene context (kitchen, street, forest) is recognized very quickly and pre-loads expectations about what objects will be present and where. The system then directs attention to the spots where task-relevant items are likely to be.

### 6.3 Image Properties

![[pictures/virtualaugmentedreality/09/Lecture09_Pg022_Attention_Guidance_Image_Properties.png]]

<p class="image-caption">High contrast photograph of a silhouette in a beam of light. Local image properties (contrast, edge density, luminance) bias attention bottom-up.</p>

Bottom-up image statistics matter independently of the task. High contrast, salient edges, luminance jumps, and texture singularities all pull the eye. The classical saliency map literature (Itti, Koch) operationalises this.

### 6.4 Preattentive Features

![[pictures/virtualaugmentedreality/09/Lecture09_Pg023_Attention_Guidance_Preattentive_Features.png]]

<p class="image-caption">Searching for the red line among black lines is trivial; a starburst among coloured rectangles also pops. Not all preattentive features work equally well.</p>

Preattentive features (orientation, colour, motion) are the most reliable lever for attention guidance. They do not all work equally well, however: some features (colour) dominate over others (orientation), and the strength depends on the distractor set.

### 6.5 Level Of Detail And Rendering Style

![[pictures/virtualaugmentedreality/09/Lecture09_Pg024_Attention_Guidance_Level_Of_Detail.png]]

<p class="image-caption">A non-photorealistic painted rendering of a street scene. Reducing detail outside the target region, or rendering it in a different style, steers attention to the target.</p>

Level of detail and rendering type matter. Reducing detail in non-target regions (selective abstraction, NPR styling) is a quiet way to highlight a target without overlaying any new graphics.

### 6.6 Motion And Flickering

![[pictures/virtualaugmentedreality/09/Lecture09_Pg025_Attention_Guidance_Motion_Flickering.png]]

<p class="image-caption">A raccoon in a "praying" pose. Motion and flicker are extremely strong attention magnets, used widely in animation and UI.</p>

Motion and flicker are very effective. They are the reason animated UI elements (badges, tooltips) reliably capture attention, and the reason they should be used sparingly.

### 6.7 Subtle Approaches

![[pictures/virtualaugmentedreality/09/Lecture09_Pg026_Attention_Guidance_Subtle_Sgd.png]]

<p class="image-caption">Bailey, McNamara et al.'s Subtle Gaze Direction (SGD): a brief, peripheral luminance modulation pulls the gaze to a target region without being consciously noticed.</p>

Subtle Gaze Direction (Bailey, McNamara et al.) uses brief, peripheral modulations of luminance that the viewer does not consciously perceive but which the visual system reacts to with a saccade toward the modulated region. The user feels they "just happened to look" at the target.

## 7. Attention Guidance In AR And VR

### Why The 2D Toolkit Is Not Enough

![[pictures/virtualaugmentedreality/09/Lecture09_Pg027_Attention_Guidance_Arvr_Tradeoffs.png]]

<p class="image-caption">2D solutions can work in AR/VR, but they alter targets, can have negative implications, and feel unnatural in an immersive environment.</p>

Three reasons to be careful when porting 2D attention guidance into AR/VR:

- They alter the targets (modifying or annotating the object of interest).
- They can have negative implications (breaking immersion, masking adjacent content).
- They feel unnatural in an immersive environment (a flat arrow in a 3D world is jarring).

The next slides walk through the AR/VR-specific techniques.

### 7.1 Adding Additional Elements

![[pictures/virtualaugmentedreality/09/Lecture09_Pg028_Attention_Guidance_Arvr_Adding_Elements.png]]

<p class="image-caption">An arrow pointing at an apple in a tree (Lange et al., HiveFive 2020); a yellow ring around the same apple (Doerr et al., Bees Birds and Butterflies, CHI EA 2023).</p>

Add a graphical element near the target: arrow, halo, ring, label. Simple, effective, and visible. The cost is exactly the warning above: a new element is overlaid on the scene, immersion suffers, and the target is altered.

### 7.2 Blurring

![[pictures/virtualaugmentedreality/09/Lecture09_Pg029_Attention_Guidance_Arvr_Blurring.png]]

<p class="image-caption">The apple tree with all non-target apples blurred; an impressionist painting (Hata, Koike, Sato) where unnoticed blur subtly redirects attention.</p>

Blur everything that is not the target. The target stays sharp and is unmodified; only the surround changes. Subtle when the blur is mild (Hata, Koike, Sato: unnoticed blur effect), stronger when the contrast in sharpness is large.

### 7.3 Automatic Locomotion

![[pictures/virtualaugmentedreality/09/Lecture09_Pg030_Attention_Guidance_Arvr_Move_User.png]]

<p class="image-caption">A person on a spinning stool at a street performance. Moving the user automatically (rotating or translating their viewpoint) brings the target into view.</p>

If the user does not look in the right direction, move them. Translate or rotate the viewpoint so the target enters the field of view. Powerful but invasive; the user surrenders agency and motion sickness is a risk.

### 7.4 Virtual Actor

![[pictures/virtualaugmentedreality/09/Lecture09_Pg031_Attention_Guidance_Arvr_Actor.png]]

<p class="image-caption">A pointing gesture from a person on a Lego-Masters set. A virtual actor who looks or points at the target uses social gaze cueing to redirect the user.</p>

Use a virtual character whose gaze or pointing gesture cues the user. Joint attention is socially powerful: we follow other people's gaze almost reflexively. The cost is an extra agent in the scene.

### 7.5 Motion Cues (HiveFive)

![[pictures/virtualaugmentedreality/09/Lecture09_Pg032_Attention_Guidance_Arvr_Motion_Hivefive.png]]

<p class="image-caption">HiveFive (Lange et al.): a swarm of small motion cues around the target leverages the very strong attention pull of motion.</p>

HiveFive (Lange et al.) drops a swarm of small moving elements around the target. Motion is one of the strongest preattentive features, and a swarm is hard to miss without being a single bold overlay. The technique tries to keep immersion intact by mimicking natural movement (insects).

### 7.6 Binocular Disparity (Deadeye)

![[pictures/virtualaugmentedreality/09/Lecture09_Pg033_Attention_Guidance_Arvr_Binocular_Disparity.png]]

<p class="image-caption">Deadeye (Krekhov et al.): the target is shown to one eye only (dichoptic presentation). The visual system flags this binocular rivalry as salient even though nothing in the image looks different.</p>

Deadeye (Krekhov et al.) is a VR-specific trick that does not exist in 2D: render the target to only one eye. The other eye sees the surround without the target. The visual system experiences this as binocular rivalry, which is preattentive but does not require any change in the rendered image (no extra elements, no blur, no motion). It only works in stereo HMDs.

## 8. Gestalt Laws

The gestalt laws are perceptual grouping rules: how the visual system decides that several elements belong together as a single object. They are the toolkit for organizing information on a 2D or 3D canvas.

### 8.1 Similarity

![[pictures/virtualaugmentedreality/09/Lecture09_Pg034_Gestalt_Similarity.png]]

<p class="image-caption">Grids of squares and circles read as alternating columns; a grid where some circles are red reads as a coloured pattern overlaid on a grid of circles.</p>

Elements that share a visual property (shape, colour, size, orientation) are perceived as belonging together. The classic demonstration is a grid where columns of squares alternate with columns of circles; the eye reads stripes.

### 8.2 Proximity

![[pictures/virtualaugmentedreality/09/Lecture09_Pg035_Gestalt_Proximity.png]]

<p class="image-caption">Six panels of squares: a regular grid reads as a grid, but spacing the squares into pairs or rotating the array makes the same elements group into pairs, rows, or diamonds.</p>

Elements that are spatially close are grouped together regardless of their colour or shape. Proximity is usually the strongest of the gestalt laws; spacing controls grouping more reliably than colour does.

### 8.3 Closure

![[pictures/virtualaugmentedreality/09/Lecture09_Pg036_Gestalt_Closure.png]]

<p class="image-caption">A fragmented outline of a tiger and a dashed silhouette of an airplane: the visual system fills in the missing contours and perceives a complete shape.</p>

The visual system fills in missing contours to perceive complete shapes. Partial outlines are read as whole objects. Used in iconography, logos, and minimalist illustration.

### 8.4 Good Continuation

![[pictures/virtualaugmentedreality/09/Lecture09_Pg037_Gestalt_Good_Continuation.png]]

<p class="image-caption">Two crossing curves are perceived as two smooth continuous lines, not as four meeting endpoints. Two diverging lines of dots are perceived as two lines, not as a cloud.</p>

Lines and curves are perceived as continuing along their smoothest path. Where two contours cross, the visual system reads two continuing curves rather than four meeting endpoints. This is why crossing lines in a network diagram still read as separate paths.

### 8.5 Common Fate

![[pictures/virtualaugmentedreality/09/Lecture09_Pg038_Gestalt_Common_Fate.png]]

<p class="image-caption">A murmuration of birds and a small flock all moving the same direction. Elements moving in the same direction are grouped together regardless of their distance or appearance.</p>

Elements that move together belong together. A flock of birds is a single thing because they move on the same trajectory; the same dots scattered randomly would not group. Common fate is the gestalt law most relevant to animated VR scenes.

### 8.6 Good Figure (Pragnanz)

![[pictures/virtualaugmentedreality/09/Lecture09_Pg039_Gestalt_Good_Figure.png]]

<p class="image-caption">The Olympic rings are perceived as five overlapping circles, not as the complex curved regions formed by their intersections. Overlapping square, circle and triangle read as three simple shapes.</p>

Among possible interpretations of a figure, the visual system prefers the simplest. The Olympic rings are read as five circles, not as a tangle of arcs. The principle (sometimes labelled Pragnanz or "good figure") underlies why simple silhouettes outperform complex ones in icons.

## 9. Psychology And VR/AR

The lecture closes with a turn from perception to clinical and affective uses of immersive technology.

### 9.1 Overview Of Mental Health Applications

![[pictures/virtualaugmentedreality/09/Lecture09_Pg040_Psychology_Vrar_Overview.png]]

<p class="image-caption">Timeline 2001-2022 of AR/VR in mental health (neurosurgery, neurodevelopmental disorders, autism spectrum, HoloLens and Oculus research); application areas (clinical emergency management, anatomy and physiology education, electronic health record, procedural training).</p>

AR and VR have been used in mental health and illness as a therapeutic tool and to raise awareness. The historical arc goes from clinical applications in neurosurgery (2001-2005), through pervasive developmental and autism-spectrum work (2006-2010), into AR/VR for medical training and neurodevelopmental disorders (2011-2015), and into HoloLens and Oculus-based mental and surgical research (2016-2022).

### 9.2 Trash It, Punch It, Burn It

![[pictures/virtualaugmentedreality/09/Lecture09_Pg041_Psychology_Vrar_Trash_It.png]]

<p class="image-caption">Grieger, Klapperich, Hassenzahl (CHI EA 2021): VR scenes in which the user trashes, punches, or burns text representations of negative thoughts as a coping mechanism. A positivity condition replaces them with positive statements.</p>

A VR coping mechanism: the user encounters a textual representation of a negative thought (a critical comment, a bad memory) and physically destroys it (trash, punch, burn) or replaces it with a positive statement. The embodied action provides closure that pure introspection does not, and the body owns the gesture in a way that a typed reply would not.

### 9.3 Embodied Avatars And Body Awareness

![[pictures/virtualaugmentedreality/09/Lecture09_Pg042_Psychology_Vrar_Embodied_Avatars.png]]

<p class="image-caption">Doellinger, Wolf, Botsch, Latoschik, Wienrich (CHI 2023): the user sees a virtual body from behind and from a mirror. Embodiment can shift body awareness in measurable ways.</p>

Embodied avatars affect the user's self-experience. Seeing one's body as someone else's (different gender, different build, different age) changes body awareness and can be deployed both for awareness-raising and as a therapy adjunct. The same effect raises a risk: virtual embodiment is not a neutral mirror.

### 9.4 OCD Exposure Therapy

![[pictures/virtualaugmentedreality/09/Lecture09_Pg043_Psychology_Vrar_Ocd_Therapy.png]]

<p class="image-caption">Torrao et al. (ICGI 2021) and Francova et al. (ICVR 2019): VR kitchens and bathrooms used as controlled exposure environments for obsessive-compulsive disorder therapy.</p>

Obsessive-compulsive disorder is treated clinically with exposure-and-response-prevention. VR provides a controlled, reproducible exposure environment (a tap left running, a contaminated surface) without the cost and unpredictability of in-vivo exposure. Patients can experience the triggering scene at a chosen intensity.

### 9.5 Social Anxiety Awareness

![[pictures/virtualaugmentedreality/09/Lecture09_Pg044_Psychology_Vrar_Social_Anxiety.png]]

<p class="image-caption">Maue and Flechtner (MuC 2022): a VR application Hopohopo that puts a viewer through everyday situations (handing out flyers, taking a bus, giving a lecture) to raise awareness of what social anxiety feels like.</p>

A different use: rather than treat sufferers, simulate the experience for others. Hopohopo (Maue and Flechtner) puts the user through everyday social situations as a person with social anxiety disorder might experience them. The goal is empathy and awareness rather than therapy.

### 💡 Intuition

Perception is the ceiling on what VR and AR can do. The display can be perfect and the tracking sub-millimetre and depth will still be underestimated, colour will still fight the background, gestalt grouping will still group whatever shares motion or proximity, and a salient gorilla can still walk through the field of view unnoticed. Design for the visual system you have, not the one the spec sheet implies.

### 🧠 Deep Dive

Three threads cut through the lecture.

First, the 2D-to-3D translation problem. Cleveland and McGill's ranking, the preattentive features list, and the gestalt laws were all formulated for flat displays viewed under normal lighting. In VR and AR they need re-validation. Some results survive (preattentive features, gestalt grouping with appropriate spacing). Some break (the absolute accuracy ordering on position-versus-length). And some new entries appear (binocular disparity as a preattentive feature, scene context as a stronger predictor of attention).

Second, attention as a bottleneck. Post-attentive amnesia, change blindness, and inattentional blindness collectively say that the brain processes far less of the visual field than introspection suggests. Designers therefore cannot rely on the user to notice information just because it is in the field of view. Either work with attention (preattentive features, gestalt grouping) or guide it actively (highlights, blur, motion, dichoptic disparity), accepting that each technique trades naturalness for effectiveness.

Third, VR and AR are not only display technologies but also psychological interventions. The same depth misperception that makes a chart misleading is, in another framing, an embodied illusion that can be used therapeutically. Trash-It, embodied avatars, OCD exposure, Hopohopo: in each case the technology's perceptual peculiarity is the mechanism rather than a side effect.

## Self-Check

1. Why do Cleveland and McGill's accuracy rankings for elementary perceptual tasks not transfer cleanly from 2D to AR/VR?

> [!success]- Answer
> The rankings were measured on flat displays where the only variable was the visual encoding. In AR the real world's illumination, colour, and texture interfere with the encoding. In VR depth and size are underestimated, so an encoding that relies on accurate length or position is corrupted by perception itself. New variables (binocular disparity, scene background, embodied viewpoint) appear that the original studies never controlled for, so the ordering does not survive.

2. What makes a visual property a preattentive feature, and why does a conjunction of two preattentive features fail to be one?

> [!success]- Answer
> A preattentive feature is detected within ~200-250 ms regardless of the number of distractors, because the visual system processes it in parallel across the entire field. A conjunction (find the orange dot among blue dots and orange squares) cannot be solved by any single feature map alone; colour alone is ambiguous, shape alone is ambiguous. The visual system has to combine maps location by location, which is serial and grows with the number of distractors.

3. State the difference between change blindness and inattentional blindness, and give a VR/AR design implication of each.

> [!success]- Answer
> Change blindness: viewers miss large changes that happen during a brief interruption of the scene (a blink, a cut, a frame drop). Implication: do not rely on a static label appearing while the user looks elsewhere; the change between absent and present can be missed. Inattentional blindness: viewers miss salient objects that are in the direct field of view while their attention is on another task. Implication: do not assume a HUD warning will be seen just because it is in the centre of the display; if the user is busy with another task, attention may not be available.

4. Walk through the Subtle Gaze Direction technique and explain why it is "subtle".

> [!success]- Answer
> A brief luminance modulation is presented in the periphery of the visual field near the target region. The peripheral retina has poor spatial detail but is highly sensitive to luminance change, so the modulation triggers a saccade toward the modulated region. By the time the eye arrives, the modulation has stopped, so the viewer fixates on the target and never consciously sees the modulation. The user feels they "just happened to look" at the right place; the manipulation is below the threshold of awareness.

5. How does Deadeye guide attention without changing the rendered image of either eye in a visible way?

> [!success]- Answer
> The target is rendered to one eye only. Both eye images are individually plausible; nothing pops out in either one. The binocular system, however, sees inconsistency between the two views at the target location: an object present for one eye and absent (or with the background showing through) for the other. This dichoptic presentation triggers binocular rivalry, which the visual system flags as salient. The user experiences the target as standing out without being able to point to what is different.

6. Walk through the gestalt laws and pair each one with a VR/AR design situation where it dominates.

> [!success]- Answer
> Similarity: encoding categorical attributes through shared shape or colour groups them across the scene. Proximity: spatial layout in a virtual room is read as grouping, so putting two panels close together is read as "these belong together" even if their colours differ. Closure: simplified icons and silhouettes read as whole objects, so AR labels can use minimal outlines. Good continuation: lines and edges across virtual content register as paths; a cable, a route, or a connector reads correctly even when it crosses other content. Common fate: animated swarms (HiveFive) work because elements moving together group together, which is the trick that makes the swarm read as one attention magnet rather than as many distractors. Good figure: prefer simple geometric icons; viewers will interpret a complex overlay as the simplest plausible reading, so design for that reading.

7. Why might depth underestimation in VR be a feature rather than a bug in some applications, and what would change in the design as a result?

> [!success]- Answer
> In clinical applications (OCD exposure, social anxiety simulation, embodied avatars) the goal is not metric accuracy but psychological impact. Underestimated depth makes a virtual character feel closer than the corresponding real distance, which can amplify social discomfort or trigger anxiety responses. The therapeutic value depends on those responses, not on the geometry being right. The design would actively exploit the underestimation: place virtual interlocutors at distances that, if rendered metrically correctly, would feel safe, knowing the user will perceive them as intrusively close.

8. The lecture argues VR and AR are also "psychological interventions". Sketch the chain of reasoning from a perceptual finding to a therapeutic application using one concrete example.

> [!success]- Answer
> Take embodied avatars (Doellinger et al.). The perceptual finding is that the visual system accepts a virtual body as one's own when motor synchrony, viewpoint, and visual appearance are aligned; this is the rubber-hand illusion extended to a full body. The intervention chain: (i) put the user in an avatar that differs from their physical body (different gender, weight, age); (ii) the visual system updates body awareness to match the avatar; (iii) after the session, the updated body awareness persists for a while and can shift attitudes toward the depicted group. The therapeutic version uses this to treat body-image disorders or to raise empathy for under-represented groups. The mechanism is purely perceptual; nothing about the experience explicitly tells the user what to feel.

---

[[/notes/lectures/virtualaugmentedreality/08_VR-AR_VisualCoherence|Previous: (y-08) Visual Coherence]] | [[/notes/lectures/virtualaugmentedreality/index|(y) Back to VR/AR Index]]

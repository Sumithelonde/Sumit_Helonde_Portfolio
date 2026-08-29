(() => {
  const canvas = document.querySelector("#hero");
  const context = canvas.getContext("2d", { alpha: false });
  const frameCount = 300;
  const frameDirectory = "ezgif-1b36008f5a229d43-jpg";
  const frames = new Array(frameCount);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const heroScroll = document.querySelector(".hero-scroll");
  const cues = [...document.querySelectorAll(".hero-cue")];
  const bandScrim = document.querySelector(".hero-scrim--band");
  const leadScrim = document.querySelector(".hero-scrim--lead");
  const trailScrim = document.querySelector(".hero-scrim--trail");
  const aboutScroll = document.querySelector(".about-scroll");
  const aboutSticky = document.querySelector(".about-sticky");
  const aboutMoments = [...document.querySelectorAll("[data-about-moment]")];
  const aboutObjects = [...document.querySelectorAll(".about-object")];
  const technology = document.querySelector(".technology");
  const technologyStage = document.querySelector(".technology-stage");
  const technologyScenes = [...document.querySelectorAll("[data-tech-scene]")];
  const technologyLogos = [...document.querySelectorAll(".technology-logo-frame img")];
  const projects = document.querySelector(".projects");
  const projectsStage = document.querySelector(".projects-stage");
  const projectsHeader = document.querySelector(".projects-header");
  const projectScenes = [...document.querySelectorAll("[data-project-scene]")];
  const projectsProgressBar = document.querySelector("#projects-progress-bar");
  const projectsStepIndicator = document.querySelector("#projects-step-indicator");
  const experience = document.querySelector(".experience");
  const experienceStage = document.querySelector(".experience-stage");
  const experienceReveals = [...document.querySelectorAll("[data-exp-reveal]")];
  const experienceChips = [...document.querySelectorAll("[data-exp-chip]")];
  const recognition = document.querySelector(".recognition");
  const recognitionStage = document.querySelector(".recognition-stage");
  const recognitionMoments = [...document.querySelectorAll("[data-recognition-moment]")];
  const educationCommunity = document.querySelector(".education-community");
  const educationCommunityStage = document.querySelector(".education-community-stage");
  const educationCommunityScenes = [...document.querySelectorAll("[data-education-community-scene]")];
  const contact = document.querySelector(".contact-scroll");
  const contactStage = document.querySelector(".contact-stage");
  const contactContent = document.querySelector(".contact-content");
  const contactReveals = [...document.querySelectorAll("[data-contact-reveal]")];
  const contactDirectory = document.querySelector("[data-contact-directory]");
  const contactLinks = [...document.querySelectorAll("[data-contact-link]")];
  const contactFooter = document.querySelector("[data-contact-footer]");

  let currentFrame = 0;
  let targetFrame = 0;
  let displayedFrame = -1;
  let animationFrame = 0;
  let viewportWidth = 0;
  let viewportHeight = 0;
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const clamp = (value, minimum = 0, maximum = 1) =>
    Math.min(Math.max(value, minimum), maximum);

  const smoothstep = (from, to, value) => {
    const progress = clamp((value - from) / Math.max(to - from, 0.0001));
    return progress * progress * (3 - 2 * progress);
  };

  const frameSource = (index) =>
    `${frameDirectory}/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

  function sizeCanvas() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    viewportWidth = innerWidth;
    viewportHeight = innerHeight;
    canvas.width = Math.round(viewportWidth * ratio);
    canvas.height = Math.round(viewportHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    displayedFrame = -1;
  }

  function draw(image) {
    if (!image?.complete || !image.naturalWidth) return false;

    const scale = Math.max(
      viewportWidth / image.naturalWidth,
      viewportHeight / image.naturalHeight,
    );
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    const x = (viewportWidth - width) / 2;
    const y = (viewportHeight - height) / 2;

    context.fillStyle = "#040608";
    context.fillRect(0, 0, viewportWidth, viewportHeight);
    context.drawImage(image, x, y, width, height);
    return true;
  }

  function nearestLoadedFrame(index) {
    if (frames[index]?.complete && frames[index].naturalWidth) return index;

    for (let distance = 1; distance < frameCount; distance += 1) {
      const before = index - distance;
      const after = index + distance;
      if (before >= 0 && frames[before]?.complete && frames[before].naturalWidth) {
        return before;
      }
      if (after < frameCount && frames[after]?.complete && frames[after].naturalWidth) {
        return after;
      }
    }

    return -1;
  }

  function render(index) {
    const loadedIndex = nearestLoadedFrame(index);
    if (loadedIndex < 0 || loadedIndex === displayedFrame) return;
    if (draw(frames[loadedIndex])) displayedFrame = loadedIndex;
  }

  function updateTypography(progress) {
    let nameOpacity = 0;
    let leadOpacity = 0;
    let trailOpacity = 0;
    let exploreOpacity = 0;

    cues.forEach((cue) => {
      const start = Number(cue.dataset.start || 0);
      const hold = cue.dataset.hold === "true";
      const end = hold ? 1 : Number(cue.dataset.end || 1);
      const span = Math.max(end - start, 0.01);
      const fadeInEnd = start + Math.min(0.055, span * 0.28);
      const fadeOutStart = end - Math.min(0.065, span * 0.3);
      const enterProgress = start === 0 ? 1 : smoothstep(start, fadeInEnd, progress);
      const exitProgress = hold ? 0 : smoothstep(fadeOutStart, end, progress);
      const opacity = clamp(enterProgress * (1 - exitProgress));
      const enterX = Number(cue.dataset.enterX || 0);
      const enterY = Number(cue.dataset.enterY || 0);
      const exitX = Number(cue.dataset.exitX || 0);
      const exitY = Number(cue.dataset.exitY || 0);
      const motionScale = reducedMotion.matches ? 0 : 1;
      const x = ((1 - enterProgress) * enterX + exitProgress * exitX) * motionScale;
      const y = ((1 - enterProgress) * enterY + exitProgress * exitY) * motionScale;

      cue.style.setProperty("--cue-opacity", opacity.toFixed(4));
      cue.style.setProperty("--cue-x", `${x.toFixed(3)}vw`);
      cue.style.setProperty("--cue-y", `${y.toFixed(3)}vh`);

      if (cue.classList.contains("hero-name")) nameOpacity = opacity;
      if (cue.classList.contains("hero-capability--lead")) leadOpacity = opacity;
      if (cue.classList.contains("hero-capability--trail")) trailOpacity = opacity;
      if (cue.classList.contains("hero-explore")) exploreOpacity = opacity;
    });

    bandScrim.style.opacity = (Math.max(nameOpacity, exploreOpacity) * 0.94).toFixed(4);
    leadScrim.style.opacity = (leadOpacity * 0.82).toFixed(4);
    trailScrim.style.opacity = (trailOpacity * 0.88).toFixed(4);
  }

  function updateAbout() {
    if (!aboutScroll || !aboutSticky || !aboutMoments.length) return;
    const travel = Math.max(aboutScroll.offsetHeight - innerHeight, 1);
    const progress = clamp((scrollY - aboutScroll.offsetTop) / travel);
    const motionScale = reducedMotion.matches ? 0 : 1;
    const titleMoveStart = 0.018;
    const titleMoveEnd = 0.14;
    const momentStart = 0.18;
    const titleShift = smoothstep(titleMoveStart, titleMoveEnd, progress);
    const titleLayoutShift = reducedMotion.matches ? (progress >= titleMoveEnd ? 1 : 0) : titleShift;
    const titleExit = smoothstep(0.975, 1, progress);
    const titleRefine = Math.sin(titleShift * Math.PI);
    const titleOpacity = (1 - titleRefine * 0.1) * (1 - titleExit);
    const pinnedScale = innerWidth <= 700 ? 0.72 : 0.5;
    const titleScale = 1 - titleLayoutShift * (1 - pinnedScale);
    const titleY = -titleLayoutShift * 38;
    const titleBlur = titleRefine * 0.65 * motionScale;

    aboutSticky.style.setProperty("--title-opacity", titleOpacity.toFixed(4));
    aboutSticky.style.setProperty("--title-scale", titleScale.toFixed(4));
    aboutSticky.style.setProperty("--title-y", `${titleY.toFixed(3)}vh`);
    aboutSticky.style.setProperty("--title-blur", `${titleBlur.toFixed(2)}px`);

    const momentsStarted = progress >= momentStart;
    const momentsProgress = clamp((progress - momentStart) / (1 - momentStart));
    const momentSpan = 1 / aboutMoments.length;

    aboutMoments.forEach((moment, index) => {
      const start = index * momentSpan;
      const rawLocalProgress = (momentsProgress - start) / momentSpan;
      const localProgress = clamp(rawLocalProgress);
      const enter = momentsStarted ? smoothstep(0, 0.08, localProgress) : 0;
      const isFinalMoment = index === aboutMoments.length - 1;
      const exit = isFinalMoment
        ? smoothstep(0.82, 1, localProgress)
        : smoothstep(0.7, 0.95, rawLocalProgress);
      const opacity = clamp(enter * (1 - exit));
      const direction = index % 2 === 0 ? 1 : -1;
      const parallax = (localProgress - 0.5) * (0.9 + index * 0.1);
      const x = ((1 - enter) * direction * 3.5 - exit * direction * 3) * motionScale;
      const y = ((1 - enter) * 2.1 - exit * 1.6 + parallax) * motionScale;
      const scale = 1 - (1 - enter) * 0.04 * motionScale - exit * 0.025 * motionScale;
      const blur = ((1 - enter) * 7 + exit * 3) * motionScale;

      moment.style.setProperty("--about-moment-opacity", opacity.toFixed(4));
      moment.style.setProperty("--about-moment-x", `${x.toFixed(3)}vw`);
      moment.style.setProperty("--about-moment-y", `${y.toFixed(3)}rem`);
      moment.style.setProperty("--about-moment-scale", scale.toFixed(4));
      moment.style.setProperty("--about-moment-blur", `${blur.toFixed(2)}px`);

      const pieces = [...moment.querySelectorAll("[data-about-piece]")];
      pieces.forEach((piece, pieceIndex) => {
        const pieceStart = 0.045 + pieceIndex * 0.095;
        const pieceEnter = momentsStarted
          ? smoothstep(pieceStart, pieceStart + 0.16, localProgress)
          : 0;
        const pieceOpacity = clamp(pieceEnter * (1 - exit));
        const pieceY = ((1 - pieceEnter) * 1.5 - exit * 0.65) * motionScale;
        const pieceScale = 1 - (1 - pieceEnter) * 0.03 * motionScale - exit * 0.012 * motionScale;
        const pieceBlur = ((1 - pieceEnter) * 7 + exit * 2.5) * motionScale;

        piece.style.setProperty("--about-piece-opacity", pieceOpacity.toFixed(4));
        piece.style.setProperty("--about-piece-y", `${pieceY.toFixed(3)}rem`);
        piece.style.setProperty("--about-piece-scale", pieceScale.toFixed(4));
        piece.style.setProperty("--about-piece-blur", `${pieceBlur.toFixed(2)}px`);
      });
    });

    const objectEnter = smoothstep(momentStart, momentStart + 0.14, progress);
    const objectExit = smoothstep(0.88, 0.99, progress);
    const objectOpacity = clamp(objectEnter * (1 - objectExit) * 0.48);

    aboutObjects.forEach((object, index) => {
      const depth = Number(object.dataset.depth || 1);
      const enterX = Number(object.dataset.enterX || 0);
      const enterY = Number(object.dataset.enterY || 0);
      const exitX = Number(object.dataset.exitX || 0);
      const exitY = Number(object.dataset.exitY || 0);
      const drift = (progress - momentStart) * depth;
      const x = ((1 - objectEnter) * enterX + objectExit * exitX + drift * 10) * motionScale;
      const y = ((1 - objectEnter) * enterY + objectExit * exitY - drift * 7) * motionScale;
      const rotation = ((1 - objectEnter) * (index % 2 ? 8 : -8) + objectExit * (index % 2 ? -6 : 6) + drift * 4) * motionScale;

      object.style.setProperty("--object-opacity", objectOpacity.toFixed(4));
      object.style.setProperty("--object-x", `${x.toFixed(2)}px`);
      object.style.setProperty("--object-y", `${y.toFixed(2)}px`);
      object.style.setProperty("--object-r", `${rotation.toFixed(2)}deg`);
    });
  }

  function updateTechnology() {
    const travel = Math.max(technology.offsetHeight - innerHeight, 1);
    const progress = clamp((scrollY - technology.offsetTop) / travel);
    const motionScale = reducedMotion.matches ? 0 : 1;
    const titleMoveStart = 0.018;
    const titleMoveEnd = 0.135;
    const chapterStart = 0.175;
    const titleShift = smoothstep(titleMoveStart, titleMoveEnd, progress);
    const titleLayoutShift = reducedMotion.matches ? (progress >= titleMoveEnd ? 1 : 0) : titleShift;
    const titleExit = smoothstep(0.975, 1, progress);
    const titleRefine = Math.sin(titleShift * Math.PI);
    const titleOpacity = (1 - titleRefine * 0.1) * (1 - titleExit);
    const pinnedTitleScale = innerWidth <= 700 ? 0.72 : 0.52;
    const titleScale = 1 - titleLayoutShift * (1 - pinnedTitleScale);
    const titleY = -titleLayoutShift * 38.5;

    technologyStage.style.setProperty("--tech-title-opacity", titleOpacity.toFixed(4));
    technologyStage.style.setProperty("--tech-title-scale", titleScale.toFixed(4));
    technologyStage.style.setProperty("--tech-title-y", `${titleY.toFixed(3)}vh`);
    technologyStage.style.setProperty("--tech-title-blur", `${(titleRefine * 0.7 * motionScale).toFixed(3)}px`);

    const chapterProgress = clamp((progress - chapterStart) / (1 - chapterStart));
    const chaptersStarted = progress >= chapterStart;
    const sceneSpan = 1 / technologyScenes.length;
    technologyScenes.forEach((scene, sceneIndex) => {
      const sceneStart = sceneIndex * sceneSpan;
      const rawLocalProgress = (chapterProgress - sceneStart) / sceneSpan;
      const localProgress = clamp(rawLocalProgress);
      const sceneEnter = chaptersStarted ? smoothstep(0, 0.16, localProgress) : 0;
      const isFinalScene = sceneIndex === technologyScenes.length - 1;
      const sceneExit = isFinalScene
        ? smoothstep(0.86, 1, localProgress)
        : smoothstep(0.74, 0.96, rawLocalProgress);
      const sceneOpacity = clamp(sceneEnter * (1 - sceneExit));
      const sceneX = ((1 - sceneEnter) * 2.5 - sceneExit * 2.5) * motionScale;
      const sceneY = ((1 - sceneEnter) * 1.7 - sceneExit * 2.2) * motionScale;

      scene.style.setProperty("--scene-opacity", sceneOpacity.toFixed(4));
      scene.style.setProperty("--scene-x", `${sceneX.toFixed(3)}vw`);
      scene.style.setProperty("--scene-y", `${sceneY.toFixed(3)}vh`);

      const category = scene.querySelector(".technology-category");
      const categoryEnter = chaptersStarted ? smoothstep(0.015, 0.16, localProgress) : 0;
      const categoryOpacity = clamp(categoryEnter * (1 - sceneExit));
      const categoryY = ((1 - categoryEnter) * 4 - sceneExit * 4) * motionScale;
      category.style.setProperty("--category-opacity", categoryOpacity.toFixed(4));
      category.style.setProperty("--category-y", `${categoryY.toFixed(3)}vh`);

      const items = [...scene.querySelectorAll(".technology-item")];
      items.forEach((item, itemIndex) => {
        const staggerStart = 0.16 + itemIndex * 0.058;
        const logoEnter = chaptersStarted ? smoothstep(staggerStart, staggerStart + 0.15, localProgress) : 0;
        const nameEnter = chaptersStarted ? smoothstep(staggerStart + 0.08, staggerStart + 0.22, localProgress) : 0;
        const depth = 0.7 + itemIndex * 0.08;
        const parallax = (localProgress - 0.5) * depth * 11;
        const itemX = ((1 - logoEnter) * -30 + sceneExit * 32) * motionScale;
        const itemY = ((1 - logoEnter) * 34 - sceneExit * 30 + parallax) * motionScale;
        const itemScale = 1 - (1 - logoEnter) * 0.06 * motionScale - sceneExit * 0.04 * motionScale;

        item.style.setProperty("--logo-opacity", clamp(logoEnter * (1 - sceneExit)).toFixed(4));
        item.style.setProperty("--logo-scale", (0.94 + logoEnter * 0.06 - sceneExit * 0.03).toFixed(4));
        item.style.setProperty("--name-opacity", clamp(nameEnter * (1 - sceneExit)).toFixed(4));
        item.style.setProperty("--name-y", `${((1 - nameEnter) * 0.8 * motionScale).toFixed(3)}rem`);
        item.style.setProperty("--item-x", `${itemX.toFixed(2)}px`);
        item.style.setProperty("--item-y", `${itemY.toFixed(2)}px`);
        item.style.setProperty("--item-scale", itemScale.toFixed(4));
      });
    });
  }

  function updateProjects() {
    if (!projects || !projectsStage || !projectScenes.length) return;
    const travel = Math.max(projects.offsetHeight - innerHeight, 1);
    const progress = clamp((scrollY - projects.offsetTop) / travel);
    const motionScale = reducedMotion.matches ? 0 : 1;
    const count = projectScenes.length;
    const titleMoveStart = 0.02;
    const titleMoveEnd = 0.18;
    const scenesStart = 0.22;
    const titleShift = smoothstep(titleMoveStart, titleMoveEnd, progress);
    const titleLayoutShift = reducedMotion.matches ? (progress >= titleMoveEnd ? 1 : 0) : titleShift;
    const titleExit = smoothstep(0.975, 1, progress);
    const titleRefine = Math.sin(titleShift * Math.PI);
    const pinnedScale = innerWidth <= 700 ? 0.82 : innerWidth <= 900 ? 0.65 : 0.5;
    const titleScale = 1 - titleLayoutShift * (1 - pinnedScale);
    const titleY = -titleLayoutShift * 38;

    projectsStage.style.setProperty(
      "--projects-title-opacity",
      ((1 - titleRefine * 0.08) * (1 - titleExit)).toFixed(4)
    );
    projectsStage.style.setProperty("--projects-title-scale", titleScale.toFixed(4));
    projectsStage.style.setProperty("--projects-title-y", `${titleY.toFixed(3)}vh`);

    const headerReveal = smoothstep(0.19, 0.25, progress) * (1 - titleExit);
    if (projectsHeader) {
      projectsHeader.style.setProperty("--projects-header-opacity", headerReveal.toFixed(4));
      projectsHeader.style.setProperty(
        "--projects-header-y",
        `${((1 - headerReveal) * motionScale).toFixed(3)}rem`
      );
    }

    const scenesStarted = progress >= scenesStart;
    const scenesProgress = clamp((progress - scenesStart) / (1 - scenesStart));
    const sceneSpan = 1 / count;
    const activeIndex = scenesStarted
      ? Math.min(Math.floor(scenesProgress * count), count - 1)
      : 0;

    if (projectsProgressBar) {
      const barPercent = 25 + scenesProgress * 75;
      projectsProgressBar.style.setProperty("--projects-bar-scale", (barPercent / 100).toFixed(4));
    }

    if (projectsStepIndicator) {
      projectsStepIndicator.textContent = `0${activeIndex + 1} / 0${count}`;
    }

    projectScenes.forEach((scene, index) => {
      const sceneStart = index * sceneSpan;
      const rawLocal = (scenesProgress - sceneStart) / sceneSpan;
      const local = clamp(rawLocal);

      const enter = scenesStarted ? smoothstep(0, 0.16, local) : 0;
      const isLast = index === count - 1;
      const exit = isLast ? smoothstep(0.96, 1, local) : smoothstep(0.78, 0.98, rawLocal);
      const opacity = clamp(enter * (1 - exit));
      const x = ((1 - enter) * 2.5 - exit * 2.5) * motionScale;
      const y = ((1 - enter) * 2.0 - exit * 2.0) * motionScale;
      const scale = 0.97 + enter * 0.03 - exit * 0.03;

      scene.style.setProperty("--scene-opacity", opacity.toFixed(4));
      scene.style.setProperty("--scene-x", `${x.toFixed(3)}vw`);
      scene.style.setProperty("--scene-y", `${y.toFixed(3)}vh`);
      scene.style.setProperty("--scene-scale", scale.toFixed(4));

      if (opacity > 0.35) {
        scene.classList.add("is-active");
      } else {
        scene.classList.remove("is-active");
      }
    });
  }

  function updateExperience() {
    if (!experience || !experienceStage) return;
    const travel = Math.max(experience.offsetHeight - innerHeight, 1);
    const progress = clamp((scrollY - experience.offsetTop) / travel);
    const motionScale = reducedMotion.matches ? 0 : 1;

    // Title: large + centered → shrinks to top, then exits
    const titleMoveStart = 0.02;
    const titleMoveEnd = 0.18;
    const titleShift = smoothstep(titleMoveStart, titleMoveEnd, progress);
    const titleLayoutShift = reducedMotion.matches ? (progress >= titleMoveEnd ? 1 : 0) : titleShift;
    const titleExit = smoothstep(0.97, 1, progress);
    const titleRefine = Math.sin(titleShift * Math.PI);
    const titleOpacity = (1 - titleRefine * 0.1) * (1 - titleExit);
    const pinnedScale = innerWidth <= 700 ? 0.7 : 0.48;
    const titleScale = 1 - titleLayoutShift * (1 - pinnedScale);
    const titleY = -titleLayoutShift * 38;

    experienceStage.style.setProperty("--exp-title-opacity", titleOpacity.toFixed(4));
    experienceStage.style.setProperty("--exp-title-scale", titleScale.toFixed(4));
    experienceStage.style.setProperty("--exp-title-y", `${titleY.toFixed(3)}vh`);
    experienceStage.style.setProperty("--exp-title-blur", `${(titleRefine * 0.6 * motionScale).toFixed(3)}px`);

    // Reveal elements (company, role, summary, focus) staggered after title pins
    const revealStart = 0.22;
    const revealEnd = 0.88;
    experienceReveals.forEach((el, i) => {
      // i=0 company, i=1 role, i=2 summary, i=3 focus — focus gets a big extra delay
      const stagger = i < 3 ? i * 0.07 : 0.42;
      const enter = smoothstep(revealStart + stagger, revealStart + stagger + 0.14, progress);
      const exit = smoothstep(revealEnd, revealEnd + 0.07, progress);
      const opacity = clamp(enter * (1 - exit));
      const y = ((1 - enter) * 2.2 - exit * 1.5) * motionScale;
      const scale = 1 - (1 - enter) * 0.04 * motionScale - exit * 0.025 * motionScale;
      el.style.setProperty("--exp-reveal-opacity", opacity.toFixed(4));
      el.style.setProperty("--exp-reveal-y", `${y.toFixed(3)}rem`);
      el.style.setProperty("--exp-reveal-scale", scale.toFixed(4));
    });

    // Focus chips: staggered individual reveals — start only after summary is settled
    const chipStart = 0.68;
    experienceChips.forEach((chip, i) => {
      const chipDelay = i * 0.055;
      const chipEnter = smoothstep(chipStart + chipDelay, chipStart + chipDelay + 0.12, progress);
      const chipExit = smoothstep(0.93, 0.99, progress);
      const chipOpacity = clamp(chipEnter * (1 - chipExit));
      const chipY = ((1 - chipEnter) * 1.2) * motionScale;
      chip.style.setProperty("--focus-opacity", chipOpacity.toFixed(4));
      chip.style.setProperty("--focus-y", `${chipY.toFixed(3)}rem`);
    });
  }

  function updateRecognition() {
    if (!recognition || !recognitionStage || !recognitionMoments.length) return;
    const travel = Math.max(recognition.offsetHeight - innerHeight, 1);
    const progress = clamp((scrollY - recognition.offsetTop) / travel);
    const motionScale = reducedMotion.matches ? 0 : 1;

    const titleMoveStart = 0.02;
    const titleMoveEnd = 0.15;
    const momentStart = 0.19;
    const titleShift = smoothstep(titleMoveStart, titleMoveEnd, progress);
    const titleLayoutShift = reducedMotion.matches ? (progress >= titleMoveEnd ? 1 : 0) : titleShift;
    const titleExit = smoothstep(0.975, 1, progress);
    const titleRefine = Math.sin(titleShift * Math.PI);
    const titleOpacity = (1 - titleRefine * 0.1) * (1 - titleExit);
    const pinnedScale = innerWidth <= 760 ? 0.72 : 0.5;
    const titleScale = 1 - titleLayoutShift * (1 - pinnedScale);
    const titleY = -titleLayoutShift * 38;

    recognitionStage.style.setProperty("--recognition-title-opacity", titleOpacity.toFixed(4));
    recognitionStage.style.setProperty("--recognition-title-scale", titleScale.toFixed(4));
    recognitionStage.style.setProperty("--recognition-title-y", `${titleY.toFixed(3)}vh`);
    recognitionStage.style.setProperty("--recognition-title-blur", `${(titleRefine * 0.6 * motionScale).toFixed(3)}px`);

    const momentsStarted = progress >= momentStart;
    const momentsProgress = clamp((progress - momentStart) / (1 - momentStart));
    const momentSpan = 1 / recognitionMoments.length;

    recognitionMoments.forEach((moment, index) => {
      const momentStartAt = index * momentSpan;
      const rawLocalProgress = (momentsProgress - momentStartAt) / momentSpan;
      const localProgress = clamp(rawLocalProgress);
      const enter = momentsStarted ? smoothstep(0, 0.18, localProgress) : 0;
      const isFinalMoment = index === recognitionMoments.length - 1;
      const exit = isFinalMoment
        ? smoothstep(0.82, 1, localProgress)
        : smoothstep(0.7, 0.95, rawLocalProgress);
      const opacity = clamp(enter * (1 - exit));
      const direction = index % 2 === 0 ? 1 : -1;
      const parallax = (localProgress - 0.5) * 1.4;
      const x = ((1 - enter) * direction * 3.8 - exit * direction * 3.2) * motionScale;
      const y = ((1 - enter) * 2.2 - exit * 1.8 + parallax) * motionScale;
      const scale = 1 - (1 - enter) * 0.04 * motionScale - exit * 0.025 * motionScale;

      moment.style.setProperty("--recognition-opacity", opacity.toFixed(4));
      moment.style.setProperty("--recognition-x", `${x.toFixed(3)}vw`);
      moment.style.setProperty("--recognition-y", `${y.toFixed(3)}rem`);
      moment.style.setProperty("--recognition-scale", scale.toFixed(4));
      moment.style.setProperty(
        "--recognition-image-parallax",
        `${((localProgress - 0.5) * 18 * motionScale).toFixed(2)}px`
      );

      const pieces = [...moment.querySelectorAll("[data-recognition-piece]")];
      pieces.forEach((piece, pieceIndex) => {
        const pieceStart = 0.035 + pieceIndex * 0.072;
        const pieceEnter = momentsStarted
          ? smoothstep(pieceStart, pieceStart + 0.13, localProgress)
          : 0;
        const pieceOpacity = clamp(pieceEnter * (1 - exit));
        const pieceY = ((1 - pieceEnter) * 1.35 - exit * 0.7) * motionScale;
        const pieceScale = 1 - (1 - pieceEnter) * 0.03 * motionScale - exit * 0.015 * motionScale;
        const pieceBlur = ((1 - pieceEnter) * 6 + exit * 2.5) * motionScale;

        piece.style.setProperty("--recognition-piece-opacity", pieceOpacity.toFixed(4));
        piece.style.setProperty("--recognition-piece-y", `${pieceY.toFixed(3)}rem`);
        piece.style.setProperty("--recognition-piece-scale", pieceScale.toFixed(4));
        piece.style.setProperty("--recognition-piece-blur", `${pieceBlur.toFixed(2)}px`);
      });
    });
  }

  function updateEducationCommunity() {
    if (!educationCommunity || !educationCommunityStage || !educationCommunityScenes.length) return;
    const travel = Math.max(educationCommunity.offsetHeight - innerHeight, 1);
    const progress = clamp((scrollY - educationCommunity.offsetTop) / travel);
    const motionScale = reducedMotion.matches ? 0 : 1;

    const titleMoveStart = 0.02;
    const titleMoveEnd = 0.17;
    const sceneStart = 0.21;
    const titleShift = smoothstep(titleMoveStart, titleMoveEnd, progress);
    const titleLayoutShift = reducedMotion.matches ? (progress >= titleMoveEnd ? 1 : 0) : titleShift;
    const titleExit = smoothstep(0.975, 1, progress);
    const titleRefine = Math.sin(titleShift * Math.PI);
    const titleOpacity = (1 - titleRefine * 0.1) * (1 - titleExit);
    const pinnedScale = innerWidth <= 900 ? 0.7 : 0.48;
    const titleScale = 1 - titleLayoutShift * (1 - pinnedScale);
    const titleY = -titleLayoutShift * 38;

    educationCommunityStage.style.setProperty("--education-title-opacity", titleOpacity.toFixed(4));
    educationCommunityStage.style.setProperty("--education-title-scale", titleScale.toFixed(4));
    educationCommunityStage.style.setProperty("--education-title-y", `${titleY.toFixed(3)}vh`);
    educationCommunityStage.style.setProperty(
      "--education-title-blur",
      `${(titleRefine * 0.65 * motionScale).toFixed(3)}px`
    );

    const scenesStarted = progress >= sceneStart;
    const scenesProgress = clamp((progress - sceneStart) / (1 - sceneStart));
    const sceneSpan = 1 / educationCommunityScenes.length;

    educationCommunityScenes.forEach((scene, index) => {
      const start = index * sceneSpan;
      const rawLocalProgress = (scenesProgress - start) / sceneSpan;
      const localProgress = clamp(rawLocalProgress);
      const enter = scenesStarted ? smoothstep(0, 0.15, localProgress) : 0;
      const isFinalScene = index === educationCommunityScenes.length - 1;
      const exit = isFinalScene
        ? smoothstep(0.84, 1, localProgress)
        : smoothstep(0.72, 0.96, rawLocalProgress);
      const opacity = clamp(enter * (1 - exit));
      const direction = index % 2 === 0 ? 1 : -1;
      const parallax = (localProgress - 0.5) * 1.15;
      const x = ((1 - enter) * direction * 4 - exit * direction * 3.2) * motionScale;
      const y = ((1 - enter) * 2.1 - exit * 1.7 + parallax) * motionScale;
      const scale = 1 - (1 - enter) * 0.04 * motionScale - exit * 0.025 * motionScale;

      scene.style.setProperty("--education-scene-opacity", opacity.toFixed(4));
      scene.style.setProperty("--education-scene-x", `${x.toFixed(3)}vw`);
      scene.style.setProperty("--education-scene-y", `${y.toFixed(3)}rem`);
      scene.style.setProperty("--education-scene-scale", scale.toFixed(4));
      scene.style.setProperty(
        "--education-image-parallax",
        `${((localProgress - 0.5) * 18 * motionScale).toFixed(2)}px`
      );

      const pieces = [...scene.querySelectorAll("[data-education-community-piece]")];
      pieces.forEach((piece, pieceIndex) => {
        const pieceStart = 0.035 + pieceIndex * 0.075;
        const pieceEnter = scenesStarted
          ? smoothstep(pieceStart, pieceStart + 0.14, localProgress)
          : 0;
        const pieceOpacity = clamp(pieceEnter * (1 - exit));
        const pieceY = ((1 - pieceEnter) * 1.4 - exit * 0.7) * motionScale;
        const pieceScale = 1 - (1 - pieceEnter) * 0.03 * motionScale - exit * 0.015 * motionScale;
        const pieceBlur = ((1 - pieceEnter) * 6 + exit * 2.5) * motionScale;

        piece.style.setProperty("--education-piece-opacity", pieceOpacity.toFixed(4));
        piece.style.setProperty("--education-piece-y", `${pieceY.toFixed(3)}rem`);
        piece.style.setProperty("--education-piece-scale", pieceScale.toFixed(4));
        piece.style.setProperty("--education-piece-blur", `${pieceBlur.toFixed(2)}px`);
      });
    });
  }

  function updateContact() {
    if (!contact || !contactStage || !contactContent) return;
    const travel = Math.max(contact.offsetHeight - innerHeight, 1);
    const progress = clamp((scrollY - contact.offsetTop) / travel);
    const motionScale = reducedMotion.matches ? 0 : 1;

    const titleMoveStart = 0.02;
    const titleMoveEnd = 0.18;
    const titleShift = smoothstep(titleMoveStart, titleMoveEnd, progress);
    const titleLayoutShift = reducedMotion.matches ? (progress >= titleMoveEnd ? 1 : 0) : titleShift;
    const titleRefine = Math.sin(titleShift * Math.PI);
    const pinnedScale = innerWidth <= 700 ? 0.62 : 0.44;

    contactStage.style.setProperty("--contact-title-opacity", (1 - titleRefine * 0.08).toFixed(4));
    contactStage.style.setProperty(
      "--contact-title-scale",
      (1 - titleLayoutShift * (1 - pinnedScale)).toFixed(4)
    );
    contactStage.style.setProperty("--contact-title-y", `${(-titleLayoutShift * 39).toFixed(3)}vh`);

    const contentReady = progress >= 0.205;
    if (contentReady) contactContent.removeAttribute("inert");
    else contactContent.setAttribute("inert", "");

    contactReveals.forEach((element, index) => {
      const start = 0.23 + index * 0.065;
      const reveal = smoothstep(start, start + 0.13, progress);
      element.style.setProperty("--contact-reveal-opacity", reveal.toFixed(4));
      element.style.setProperty("--contact-reveal-y", `${((1 - reveal) * 1.75 * motionScale).toFixed(3)}rem`);
      element.style.setProperty(
        "--contact-reveal-scale",
        (1 - (1 - reveal) * 0.025 * motionScale).toFixed(4)
      );
    });

    const directoryReveal = smoothstep(0.38, 0.5, progress);
    if (contactDirectory) {
      contactDirectory.style.setProperty("--contact-directory-opacity", directoryReveal.toFixed(4));
      contactDirectory.style.setProperty(
        "--contact-directory-y",
        `${((1 - directoryReveal) * 2 * motionScale).toFixed(3)}rem`
      );
      contactDirectory.style.setProperty(
        "--contact-directory-scale",
        (1 - (1 - directoryReveal) * 0.02 * motionScale).toFixed(4)
      );
    }

    contactLinks.forEach((element, index) => {
      const start = 0.46 + index * 0.04;
      const reveal = smoothstep(start, start + 0.1, progress);
      element.style.setProperty("--contact-link-opacity", reveal.toFixed(4));
      element.style.setProperty(
        "--contact-link-x",
        `${((1 - reveal) * 1.4 * motionScale).toFixed(3)}rem`
      );
    });

    const footerReveal = smoothstep(0.72, 0.84, progress);
    if (contactFooter) {
      contactFooter.style.setProperty("--contact-footer-opacity", footerReveal.toFixed(4));
      contactFooter.style.setProperty(
        "--contact-footer-y",
        `${((1 - footerReveal) * motionScale).toFixed(3)}rem`
      );
    }
  }

  function prepareTechnologyLogos() {
    technologyLogos.forEach((image) => {
      const frame = image.closest(".technology-logo-frame");
      const markLoaded = () => frame.classList.add("is-loaded");
      const markFailed = () => {
        image.hidden = true;
        frame.classList.remove("is-loaded");
      };

      image.addEventListener("load", markLoaded, { once: true });
      image.addEventListener("error", markFailed, { once: true });
      if (image.complete) {
        if (image.naturalWidth) markLoaded();
        else markFailed();
      }
    });
  }

  function updateTarget() {
    const scrollRange = Math.max(heroScroll.offsetHeight - innerHeight, 1);
    const progress = Math.min(Math.max(scrollY / scrollRange, 0), 1);
    const heroReleased = scrollY >= heroScroll.offsetTop + heroScroll.offsetHeight;
    document.documentElement.classList.toggle("hero-released", heroReleased);
    targetFrame = reducedMotion.matches ? 0 : progress * (frameCount - 1);
    updateTypography(progress);
    updateAbout();
    updateTechnology();
    updateProjects();
    updateExperience();
    updateRecognition();
    updateEducationCommunity();
    updateContact();
    requestTick();
  }

  function renderPointer() {
    pointerFrame = 0;
    const motionScale = reducedMotion.matches || !finePointer.matches ? 0 : 1;
    aboutObjects.forEach((object) => {
      const depth = Number(object.dataset.depth || 1);
      object.style.setProperty("--pointer-x", `${(pointerX * depth * 7 * motionScale).toFixed(2)}px`);
      object.style.setProperty("--pointer-y", `${(pointerY * depth * 7 * motionScale).toFixed(2)}px`);
    });
  }

  function updatePointer(event) {
    pointerX = (event.clientX / innerWidth - 0.5) * 2;
    pointerY = (event.clientY / innerHeight - 0.5) * 2;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(renderPointer);
  }

  function tick() {
    animationFrame = 0;
    currentFrame += (targetFrame - currentFrame) * 0.24;
    if (Math.abs(targetFrame - currentFrame) < 0.05) currentFrame = targetFrame;
    render(Math.round(currentFrame));
    if (currentFrame !== targetFrame) requestTick();
  }

  function requestTick() {
    if (!animationFrame) animationFrame = requestAnimationFrame(tick);
  }

  function loadFrame(index, eager = false) {
    if (frames[index]) return;
    const image = new Image();
    frames[index] = image;
    image.decoding = "async";
    image.fetchPriority = eager ? "high" : "low";
    image.onload = () => {
      if (index === 0 || Math.abs(index - targetFrame) < 3) render(Math.round(targetFrame));
    };
    image.src = frameSource(index);
  }

  function preloadFrames() {
    loadFrame(0, true);

    const connection = navigator.connection;
    const constrained = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "");
    if (constrained || reducedMotion.matches) return;

    const order = [];
    for (let step = 10; step < frameCount; step += 10) order.push(step);
    for (let index = 1; index < frameCount; index += 1) {
      if (index % 10 !== 0) order.push(index);
    }

    let cursor = 0;
    const loadBatch = () => {
      const end = Math.min(cursor + 12, order.length);
      while (cursor < end) loadFrame(order[cursor++]);
      if (cursor < order.length) setTimeout(loadBatch, 40);
    };

    loadBatch();
  }

  addEventListener("scroll", updateTarget, { passive: true });
  addEventListener("pointermove", updatePointer, { passive: true });
  addEventListener("resize", () => {
    sizeCanvas();
    updateTarget();
    render(Math.round(currentFrame));
  });
  addEventListener("pagehide", () => {
    cancelAnimationFrame(animationFrame);
    cancelAnimationFrame(pointerFrame);
  }, { once: true });
  reducedMotion.addEventListener("change", () => {
    updateTarget();
    if (!reducedMotion.matches) preloadFrames();
  });

  sizeCanvas();
  prepareTechnologyLogos();
  updateTarget();
  preloadFrames();
})();

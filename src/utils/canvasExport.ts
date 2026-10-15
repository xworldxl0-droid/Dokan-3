import { TextOverlayConfig } from '../types/thumbnail';

/**
 * Draws the composite 1280x720 thumbnail to an offscreen canvas and returns the canvas
 */
export async function renderThumbnailCanvas(
  imageSource: string,
  textConfig: TextOverlayConfig
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Draw base image
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw cover to 1280x720
      const imgRatio = img.width / img.height;
      const targetRatio = 1280 / 720;
      let sWidth = img.width;
      let sHeight = img.height;
      let sx = 0;
      let sy = 0;

      if (imgRatio > targetRatio) {
        sWidth = img.height * targetRatio;
        sx = (img.width - sWidth) / 2;
      } else {
        sHeight = img.width / targetRatio;
        sy = (img.height - sHeight) / 2;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 1280, 720);
      resolve();
    };
    img.onerror = () => {
      // Fallback background if image fails to load
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);
      resolve();
    };
    img.src = imageSource;
  });

  // 2. If text overlay is enabled, draw text and badges
  if (textConfig.enabled && (textConfig.title || textConfig.subtitle || textConfig.badgeEnabled)) {
    // Wait for fonts to be ready
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font wait failures
    }

    // Determine base coordinates
    let baseX = 70;
    let baseY = 160;
    let textAlign: CanvasTextAlign = 'left';

    switch (textConfig.position) {
      case 'top-left':
        baseX = 70;
        baseY = 160;
        textAlign = 'left';
        break;
      case 'bottom-left':
        baseX = 70;
        baseY = 460;
        textAlign = 'left';
        break;
      case 'top-right':
        baseX = 1210;
        baseY = 160;
        textAlign = 'right';
        break;
      case 'center-top':
        baseX = 640;
        baseY = 150;
        textAlign = 'center';
        break;
      case 'custom':
        if (textConfig.customX !== undefined && textConfig.customY !== undefined) {
          baseX = (textConfig.customX / 100) * 1280;
          baseY = (textConfig.customY / 100) * 720;
          textAlign = textConfig.customX > 60 ? 'right' : textConfig.customX < 40 ? 'left' : 'center';
        }
        break;
    }

    ctx.save();

    // Rotation if set
    if (textConfig.rotation) {
      ctx.translate(baseX, baseY);
      ctx.rotate((textConfig.rotation * Math.PI) / 180);
      ctx.translate(-baseX, -baseY);
    }

    // A. Draw badge sticker if enabled
    if (textConfig.badgeEnabled && textConfig.badgeText) {
      const badgeFontSize = 28;
      ctx.font = `800 ${badgeFontSize}px '${textConfig.font}', sans-serif`;
      const badgeText = textConfig.badgeText.toUpperCase();
      const badgeMetrics = ctx.measureText(badgeText);
      const bPaddingX = 20;
      const bHeight = 44;
      const bWidth = badgeMetrics.width + bPaddingX * 2;

      let bx = baseX;
      if (textAlign === 'right') {
        bx = baseX - bWidth;
      } else if (textAlign === 'center') {
        bx = baseX - bWidth / 2;
      }

      const by = baseY - 85;

      // Badge background pill/box
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = textConfig.badgeColor || '#e11d48';
      ctx.beginPath();
      ctx.roundRect(bx, by, bWidth, bHeight, 8);
      ctx.fill();
      ctx.restore();

      // Badge text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, bx + bPaddingX, by + bHeight / 2);
    }

    // B. Draw Main Title
    if (textConfig.title) {
      const titleLines = textConfig.title.split('\n');
      const fontSize = textConfig.titleSize * 1.35; // scaled for 1280x720 canvas
      ctx.font = `900 ${fontSize}px '${textConfig.font}', Impact, sans-serif`;
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'top';

      let currentY = baseY;

      for (const line of titleLines) {
        if (!line.trim()) continue;

        // If badgeStyle is 'box' or 'highlight', draw background backing
        if (textConfig.badgeStyle === 'box' || textConfig.badgeStyle === 'highlight') {
          const metrics = ctx.measureText(line);
          const padX = 24;
          const padY = 12;
          const rectH = fontSize + padY * 2;
          let rx = baseX - padX;
          if (textAlign === 'right') {
            rx = baseX - metrics.width - padX;
          } else if (textAlign === 'center') {
            rx = baseX - metrics.width / 2 - padX;
          }
          const rectW = metrics.width + padX * 2;

          ctx.save();
          ctx.fillStyle = textConfig.badgeStyle === 'highlight' ? 'rgba(234, 179, 8, 0.95)' : 'rgba(0, 0, 0, 0.85)';
          ctx.beginPath();
          ctx.roundRect(rx, currentY - padY, rectW, rectH, 10);
          ctx.fill();
          ctx.restore();
        }

        // Drop shadow / glow
        ctx.save();
        if (textConfig.glowRadius > 0) {
          ctx.shadowColor = textConfig.glowColor || 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = textConfig.glowRadius * 2;
          ctx.shadowOffsetX = 4;
          ctx.shadowOffsetY = 6;
        }

        // Stroke (vital for YouTube thumbnail clarity)
        if (textConfig.strokeWidth > 0) {
          ctx.strokeStyle = textConfig.strokeColor || '#000000';
          ctx.lineWidth = textConfig.strokeWidth * 2;
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;
          ctx.strokeText(line, baseX, currentY);
        }

        // Fill text
        ctx.fillStyle = textConfig.badgeStyle === 'highlight' ? '#000000' : (textConfig.textColor || '#ffffff');
        ctx.fillText(line, baseX, currentY);
        ctx.restore();

        currentY += fontSize * 1.12;
      }

      // C. Draw Subtitle
      if (textConfig.subtitle) {
        const subFontSize = textConfig.subtitleSize * 1.1;
        ctx.font = `700 ${subFontSize}px '${textConfig.font}', sans-serif`;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'top';

        // Background bar for subtitle
        const subLines = textConfig.subtitle.split('\n');
        for (const subLine of subLines) {
          if (!subLine.trim()) continue;

          ctx.save();
          if (textConfig.strokeWidth > 0) {
            ctx.strokeStyle = textConfig.strokeColor || '#000000';
            ctx.lineWidth = Math.max(3, textConfig.strokeWidth * 1.2);
            ctx.lineJoin = 'round';
            ctx.strokeText(subLine, baseX, currentY + 12);
          }
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(subLine, baseX, currentY + 12);
          ctx.restore();

          currentY += subFontSize * 1.15;
        }
      }
    }

    ctx.restore();
  }

  return canvas;
}

/**
 * Downloads the current canvas as 1280x720 PNG or JPG
 */
export async function downloadThumbnail(
  imageSource: string,
  textConfig: TextOverlayConfig,
  format: 'png' | 'jpeg' = 'png',
  filename = 'thumbgenius-thumbnail'
): Promise<void> {
  const canvas = await renderThumbnailCanvas(imageSource, textConfig);
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${filename}-${Date.now()}.${format === 'jpeg' ? 'jpg' : 'png'}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Copies the 1280x720 thumbnail to the clipboard as PNG
 */
export async function copyThumbnailToClipboard(
  imageSource: string,
  textConfig: TextOverlayConfig
): Promise<boolean> {
  try {
    const canvas = await renderThumbnailCanvas(imageSource, textConfig);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          resolve(true);
        } catch (err) {
          console.warn('Clipboard write failed:', err);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.warn('Failed to copy thumbnail:', err);
    return false;
  }
}

# GenSpark Image Download Skill

## When to Use
Downloading images from GenSpark that require authentication (API URLs with `genspark.ai/api/files`).

## Problem
GenSpark API URLs require authentication — can't download with curl.

## Solution: Browser JS Injection

### Step 1: Get image URLs from page
```javascript
browser.act({kind: "evaluate", fn: "() => { 
  const imgs = document.querySelectorAll('img'); 
  const urls = []; 
  imgs.forEach(img => { 
    if (img.src && img.src.includes('genspark.ai/api/files') && img.width > 200) { 
      urls.push({src: img.src, alt: img.alt || ''}); 
    }
  }); 
  return urls; 
}"})
```

### Step 2: Trigger downloads via anchor clicks
```javascript
browser.act({kind: "evaluate", fn: "() => { 
  const downloads = [
    {url: 'https://www.genspark.ai/api/files/s/XXXXX', name: 'filename.png'},
  ]; 
  downloads.forEach((d, i) => { 
    setTimeout(() => { 
      const link = document.createElement('a'); 
      link.href = d.url; 
      link.download = d.name; 
      document.body.appendChild(link); 
      link.click(); 
      document.body.removeChild(link); 
    }, i * 1500);
  }); 
  return 'Triggered downloads'; 
}"})
```

**Key insight:** Browser has auth cookies; `<a download>` uses them automatically.

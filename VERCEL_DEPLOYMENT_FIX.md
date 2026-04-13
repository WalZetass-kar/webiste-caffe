# 🚀 Vercel Deployment - Troubleshooting Guide

## Error yang Terjadi
Deployment ke Vercel gagal dengan error saat build.

---

## 🔍 Langkah Troubleshooting

### 1. Cek Build Logs Detail di Vercel

Di halaman Vercel deployment yang error:
1. Klik "Build Logs" 
2. Scroll ke bawah sampai menemukan error message yang lengkap
3. Cari baris yang dimulai dengan "Error:" atau "Failed to compile"

**Common errors:**
- `Module not found`
- `Type error`
- `Out of memory`
- `Build exceeded maximum duration`

---

### 2. Test Build Locally

Jalankan build di local untuk melihat error yang sama:

```bash
# Stop development server dulu
npm run build
```

Jika ada error, akan muncul di terminal. Fix error tersebut sebelum deploy lagi.

---

### 3. Check Dependencies

Pastikan semua dependencies terinstall:

```bash
npm install
```

Cek apakah ada missing dependencies di `package.json`:

```json
{
  "dependencies": {
    "chart.js": "^4.x.x",
    "react-chartjs-2": "^5.x.x",
    // ... other dependencies
  }
}
```

---

### 4. Vercel Build Settings

Di Vercel dashboard, cek settings:

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

**Node Version:**
- Recommended: `20.x` atau `18.x`
- Set di `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

### 5. Environment Variables

Jika ada environment variables yang dibutuhkan, tambahkan di Vercel:

1. Go to Project Settings
2. Environment Variables
3. Add variables yang dibutuhkan

---

### 6. Memory Issues

Jika error "Out of memory":

**Option 1: Increase Node Memory**
Di `package.json`, ubah build script:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

**Option 2: Optimize Build**
- Remove unused dependencies
- Optimize images
- Use dynamic imports

---

### 7. Common Fixes

#### Fix 1: Clear Vercel Cache
```bash
# Di Vercel dashboard
Settings → General → Clear Build Cache
```

#### Fix 2: Redeploy
```bash
# Push ke Git lagi
git add .
git commit -m "fix: deployment issues"
git push
```

#### Fix 3: Check .gitignore
Pastikan file penting tidak di-ignore:
```
# .gitignore
node_modules/
.next/
.env.local

# Jangan ignore ini:
# package.json
# package-lock.json
# next.config.js
```

---

## 🐛 Specific Errors & Solutions

### Error: "Module not found: Can't resolve 'chart.js'"

**Solution:**
```bash
npm install chart.js react-chartjs-2
```

Commit dan push lagi.

---

### Error: "Type error: Property 'X' does not exist"

**Solution:**
1. Check TypeScript errors locally:
```bash
npx tsc --noEmit
```

2. Fix all type errors
3. Commit dan push

---

### Error: "Build exceeded maximum duration"

**Solution:**
1. Optimize build:
   - Remove unused code
   - Use dynamic imports
   - Optimize images

2. Upgrade Vercel plan (if needed)

---

### Error: "Out of memory"

**Solution:**
Add to `package.json`:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

## 📝 Checklist Before Deploy

- [ ] `npm run build` works locally
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] All dependencies in `package.json`
- [ ] `.gitignore` configured correctly
- [ ] Environment variables set in Vercel
- [ ] Node version specified
- [ ] Build settings correct in Vercel

---

## 🔧 Quick Fix Commands

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Test build
npm run build

# 3. Check TypeScript
npx tsc --noEmit

# 4. Commit and push
git add .
git commit -m "fix: build issues"
git push
```

---

## 📊 Debugging Steps

### Step 1: Local Build Test
```bash
npm run build
```
✅ If success → Problem is Vercel-specific
❌ If fails → Fix local errors first

### Step 2: Check Vercel Logs
Look for specific error message in build logs

### Step 3: Compare Environments
- Local Node version vs Vercel Node version
- Local dependencies vs deployed dependencies

### Step 4: Incremental Deploy
- Deploy without new features
- Add features one by one
- Identify which feature causes error

---

## 🆘 Still Having Issues?

### Get More Info:

1. **Full Build Logs**
   - Copy entire build log from Vercel
   - Look for first error (not last)

2. **Local Build Output**
   ```bash
   npm run build > build.log 2>&1
   ```

3. **TypeScript Check**
   ```bash
   npx tsc --noEmit > typescript.log 2>&1
   ```

### Common Vercel-Specific Issues:

1. **Case-sensitive imports**
   - Local: Windows (case-insensitive)
   - Vercel: Linux (case-sensitive)
   - Fix: Match exact file names

2. **Missing files**
   - Check if all files are committed
   - Check `.gitignore`

3. **Build timeout**
   - Optimize build
   - Upgrade plan

---

## 💡 Best Practices

### 1. Always Test Build Locally
```bash
npm run build
npm start
```

### 2. Use TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 3. Monitor Build Time
- Keep build under 10 minutes
- Optimize if needed

### 4. Version Control
- Commit working versions
- Tag releases
- Easy rollback if needed

---

## 📞 Next Steps

1. **Screenshot error lengkap** dari Vercel build logs
2. **Copy error message** yang spesifik
3. **Share error** untuk analisis lebih detail

Atau coba:
```bash
# Clean build locally
npm run build

# If success, redeploy to Vercel
git push
```

---

**Status**: Waiting for detailed error message
**Priority**: HIGH
**Action**: Check Vercel build logs for specific error

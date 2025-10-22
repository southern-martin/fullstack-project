# 🐳 Docker Not Running - Quick Fix

## Problem

```
Cannot connect to the Docker daemon at unix:///Users/tannguyen/.docker/run/docker.sock
Is the docker daemon running?
```

This means **Docker Desktop is not running** on your Mac.

## Solution

### Step 1: Start Docker Desktop

**Option A: Using Spotlight (Fastest)**
```
1. Press Cmd + Space
2. Type "Docker"
3. Press Enter
```

**Option B: From Applications**
```
1. Open Finder
2. Go to Applications
3. Double-click "Docker" or "Docker Desktop"
```

**Option C: Using Terminal**
```bash
open -a Docker
```

### Step 2: Wait for Docker to Initialize

After opening Docker Desktop:

1. **Look for the Docker icon** in your Mac menu bar (top-right, near the clock)
2. **Wait until it shows**: "Docker Desktop is running"
   - The icon will be **solid/stable** (not animated)
   - Usually takes **30-60 seconds**
3. **Click the icon** to verify it says "Running"

You'll see something like:
```
🐳 Docker Desktop is running
   ✓ Containers: 0
   ✓ Images: X
   ✓ Volumes: X
```

### Step 3: Verify Docker is Ready

Run this command to confirm Docker is working:

```bash
docker info
```

If it shows Docker info (version, containers, etc.), you're ready!

If it still shows an error, wait another 30 seconds and try again.

### Step 4: Start All Services

Now you can run:

```bash
cd /opt/cursor-project/fullstack-project
./start-all-services.sh
```

Or manually:

```bash
docker-compose -f docker-compose.hybrid.yml up -d
```

---

## Complete Startup Sequence

Here's the full sequence from scratch:

```bash
# 1. Start Docker Desktop
open -a Docker

# 2. Wait for Docker to be ready (check menu bar icon)
echo "Waiting for Docker to start..."
while ! docker info > /dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo ""
echo "✅ Docker is ready!"

# 3. Navigate to project
cd /opt/cursor-project/fullstack-project

# 4. Start all services
./start-all-services.sh
```

---

## Troubleshooting

### Docker Desktop Won't Start

**Issue**: Docker Desktop doesn't open

**Solutions**:
1. Check if it's already running: Look for Docker icon in menu bar
2. Restart your Mac if Docker won't launch
3. Reinstall Docker Desktop from: https://www.docker.com/products/docker-desktop

### Docker Icon Shows Error

**Issue**: Docker icon has a red exclamation mark

**Solutions**:
1. Click the icon and read the error message
2. Common fixes:
   - **Not enough disk space**: Free up disk space (need ~10GB)
   - **VirtFS not available**: Restart Mac
   - **Permission issues**: Run `sudo chown -R $(whoami) ~/.docker`

### Docker Takes Forever to Start

**Normal**: First time startup can take 2-3 minutes
**If stuck**: 
1. Quit Docker Desktop completely
2. Kill any Docker processes:
   ```bash
   killall Docker
   killall com.docker.backend
   ```
3. Start Docker Desktop again

### Still Getting Socket Error

If you still see socket errors after Docker Desktop shows "Running":

```bash
# Check Docker socket permissions
ls -la /Users/tannguyen/.docker/run/docker.sock

# Should show: srw-rw----  ... tannguyen  staff  ...

# If not, fix permissions:
sudo chown $(whoami) /Users/tannguyen/.docker/run/docker.sock
```

---

## Quick Reference

### Check Docker Status
```bash
# Is Docker running?
docker info

# List running containers
docker ps

# List all containers
docker ps -a

# Docker Desktop version
docker version
```

### Common Docker Commands
```bash
# Start Docker Desktop
open -a Docker

# Check if Docker is ready
docker info > /dev/null 2>&1 && echo "Ready!" || echo "Not ready"

# View Docker Desktop settings
open -a Docker  # Then click Settings gear icon
```

---

## After Docker Starts

Once Docker Desktop is running:

1. ✅ Menu bar icon shows "Docker Desktop is running"
2. ✅ `docker info` command works
3. ✅ Ready to start services!

Run:
```bash
cd /opt/cursor-project/fullstack-project
./start-all-services.sh
```

This will:
- Start all 6 backend services
- Start MySQL database
- Start Redis cache
- Verify all services are healthy
- Show you login credentials

Then open http://localhost:3000 and test the translations! 🎉

---

## Expected Timeline

- **Docker Desktop startup**: 30-60 seconds
- **Services startup**: 60-90 seconds
- **Total time**: ~2-3 minutes from start to ready

---

**Next Command**: After Docker Desktop shows "Running" in menu bar:

```bash
cd /opt/cursor-project/fullstack-project
./start-all-services.sh
```

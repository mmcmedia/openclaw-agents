# Tempest Mockups Skill

Generate Etsy product mockups automatically using the Tempest Photoshop script.

## Prerequisites
- Adobe Photoshop 2026 installed
- Tempest script at `~/Desktop/Tempest/Tempest-2.0.9.jsxbin`
- Accessibility permissions enabled for `node` and `Claude` (System Settings > Privacy & Security > Accessibility)

## Folder Structure
```
~/Desktop/Tempest/
├── Input/          # Place source images here (the art to mockup)
├── Output/         # Generated mockups appear here
├── Mockups/        # Mockup templates
├── Backup/         # Backup files
├── Videos/         # Video outputs (if enabled)
└── Tempest-2.0.9.jsxbin  # The script
```

## Usage

### 1. Prepare Input Files
Place art files in `~/Desktop/Tempest/Input/`

### 2. Run Tempest Script
```applescript
-- Open Photoshop
tell application "Adobe Photoshop 2026" to activate

-- Wait for Photoshop to load
delay 2

-- Navigate to File > Scripts > Browse
tell application "System Events"
    tell process "Adobe Photoshop 2026"
        set frontmost to true
        delay 1
        click menu bar item "File" of menu bar 1
        delay 0.5
        click menu item "Scripts" of menu "File" of menu bar 1
        delay 0.5
        click menu item "Browse..." of menu "Scripts" of menu item "Scripts" of menu "File" of menu bar 1
    end tell
end tell

-- Navigate to script file
delay 1
tell application "System Events"
    keystroke "g" using {command down, shift down}
    delay 1
    keystroke "/Users/mmcassistant/Desktop/Tempest/"
    keystroke return
    delay 1
    keystroke "Tempest-2.0.9.jsxbin"
    delay 0.5
    keystroke return
end tell
```

### 3. Configure Tempest Dialog
When the "Tempest - Normal Run" dialog appears:
- **Orientation**: Leave as "Vertical (4x5)" for standard prints
- **Midjourney Name field**: CLEAR THIS (delete any text like "shine for Christ")
- **Options**: Leave defaults (Create Cropped Image, Create Mockups checked)

### 4. Start Processing
Press Enter or click OK to start. Monitor with:
```applescript
tell application "System Events"
    tell process "Adobe Photoshop 2026"
        set windowList to name of every window
    end tell
end tell
return windowList
```

Look for "Progress" window = script is running.

## Timing
- ~80 files takes 20-30 minutes
- Check Output folder for completed mockups

## Troubleshooting
- **"osascript is not allowed assistive access"**: Enable node and Claude in System Settings > Privacy & Security > Accessibility
- **Dialog closes unexpectedly**: Re-run the script, ensure Photoshop is fully loaded first
- **Menu items not found**: Wait longer for Photoshop to load (increase delay)
- **Can't see Photoshop (different Space)**: You can still run the script blindly! The `do javascript` command works even when windows aren't visible. Monitor progress by checking Output folder count.

## Blind Execution (when windows on different Space)
If Photoshop is on a different macOS desktop Space:
```bash
# Run script blindly
osascript -e 'tell application "Adobe Photoshop 2026" to do javascript file "/Users/mmcassistant/Desktop/Tempest/Tempest-2.0.9.jsxbin"' &

# Wait for dialog, then press Enter to start
sleep 10
osascript -e 'tell application "System Events" to keystroke return'

# Monitor progress
watch -n 30 "ls ~/Desktop/Tempest/Output/4x5Vertical_Output/ | wc -l"
```

## Next Steps After Mockups
Upload to Etsy via Downpour (see downpour-etsy skill)

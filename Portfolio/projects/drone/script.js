/**
 * Drone Disaster Response Monitor - Client-Side Human Detection
 * Uses TensorFlow.js and COCO-SSD for real-time human detection in the browser
 */

// Configuration
const DETECTION_INTERVAL = 100; // milliseconds between detections (10 FPS)
const MAX_LOG_ENTRIES = 50; // maximum number of log entries to keep
const MODEL_CONFIDENCE = 0.6; // default confidence threshold

// DOM Elements
const elements = {
    // Input and controls
    cameraSelect: document.getElementById('cameraSelect'),
    refreshCamerasBtn: document.getElementById('refreshCamerasBtn'),
    rtmpUrl: document.getElementById('rtmpUrl'),
    rtmpServerUrl: document.getElementById('rtmpServerUrl'),
    rtmpStreamKey: document.getElementById('rtmpStreamKey'),
    cameraGroup: document.getElementById('cameraGroup'),
    rtmpGroup: document.getElementById('rtmpGroup'),
    confidenceSlider: document.getElementById('confidenceSlider'),
    confidenceValue: document.getElementById('confidenceValue'),
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    toggleDetectionBtn: document.getElementById('toggleDetectionBtn'),
    
    // Status indicators
    connectionStatus: document.getElementById('connectionStatus'),
    streamStatus: document.getElementById('streamStatus'),
    lastUpdate: document.getElementById('lastUpdate'),
    
    // Content displays
    videoDisplay: document.getElementById('videoDisplay'),
    videoElement: document.getElementById('videoElement'),
    detectionCanvas: document.getElementById('detectionCanvas'),
    humanCount: document.getElementById('humanCount'),
    detectionLog: document.getElementById('detectionLog'),
    currentDetections: document.getElementById('currentDetections'),
    fpsDisplay: document.getElementById('fpsDisplay'),
    processTimeDisplay: document.getElementById('processTimeDisplay'),
    
    // Modals and overlays
    loadingOverlay: document.getElementById('loadingOverlay'),
    errorModal: document.getElementById('errorModal'),
    errorMessage: document.getElementById('errorMessage'),
    closeErrorModal: document.getElementById('closeErrorModal'),
    errorOkBtn: document.getElementById('errorOkBtn'),
    successModal: document.getElementById('successModal'),
    successMessage: document.getElementById('successMessage'),
    closeSuccessModal: document.getElementById('closeSuccessModal'),
    successOkBtn: document.getElementById('successOkBtn'),
    
    // Contact form
    contactModal: document.getElementById('contactModal'),
    contactUsBtn: document.getElementById('contactUsBtn'),
    closeContactModal: document.getElementById('closeContactModal'),
    cancelContactBtn: document.getElementById('cancelContactBtn'),
    sendContactBtn: document.getElementById('sendContactBtn'),
    contactForm: document.getElementById('contactForm')
};

// Application State
const appState = {
    isDetecting: false,
    isDetectionEnabled: true,
    detectionInterval: null,
    lastHumanCount: 0,
    detectionHistory: [],
    currentStream: null,
    model: null,
    lastDetectionTime: 0,
    frameSkipCount: 0,
    currentInputType: 'camera',
    performanceStats: {
        fps: 0,
        processingTime: 0,
        lastUpdate: 0
    },
    availableCameras: [],
    cameraLoadRetries: 0,
    maxCameraRetries: 3
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initializeAnimations();
    
    // Load available cameras
    loadAvailableCameras();
    
    // Load AI model
    loadDetectionModel();
    
    // Input type change listeners
    document.querySelectorAll('input[name="inputType"]').forEach(radio => {
        radio.addEventListener('change', handleInputTypeChange);
    });
    
    // Button event listeners
    elements.startBtn.addEventListener('click', (e) => {
        animateButtonClick(e.target);
        startDetection();
    });
    elements.stopBtn.addEventListener('click', (e) => {
        animateButtonClick(e.target);
        stopDetection();
    });
    elements.toggleDetectionBtn.addEventListener('click', (e) => {
        animateButtonClick(e.target);
        toggleDetection();
    });
    elements.refreshCamerasBtn.addEventListener('click', (e) => {
        animateButtonClick(e.target);
        loadAvailableCameras();
    });
    elements.confidenceSlider.addEventListener('input', updateConfidence);
    
    // Modal event listeners
    elements.closeErrorModal.addEventListener('click', () => hideModal(elements.errorModal));
    elements.errorOkBtn.addEventListener('click', () => hideModal(elements.errorModal));
    elements.closeSuccessModal.addEventListener('click', () => hideModal(elements.successModal));
    elements.successOkBtn.addEventListener('click', () => hideModal(elements.successModal));
    
    // Contact form event listeners
    elements.contactUsBtn.addEventListener('click', (e) => {
        animateButtonClick(e.target);
        openContactModal();
    });
    elements.closeContactModal.addEventListener('click', () => hideModal(elements.contactModal));
    elements.cancelContactBtn.addEventListener('click', () => hideModal(elements.contactModal));
    elements.sendContactBtn.addEventListener('click', handleContactFormSubmit);
    
    // Close modals when clicking outside
    elements.contactModal.addEventListener('click', (e) => {
        if (e.target === elements.contactModal) {
            hideModal(elements.contactModal);
        }
    });
    
    // Add card hover animations
    document.querySelectorAll('.stats-card').forEach(card => {
        card.addEventListener('mouseenter', () => animateCardHover(card));
        card.addEventListener('mouseleave', () => animateCardLeave(card));
    });
});

/**
 * Initialize page animations
 */
function initializeAnimations() {
    // Header animation
    anime({
        targets: '.animate-header',
        opacity: [0, 1],
        translateY: [-50, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 200
    });

    // Icon animation
    anime({
        targets: '.animate-icon',
        opacity: [0, 1],
        scale: [0.5, 1],
        rotate: [-180, 0],
        duration: 1200,
        easing: 'easeOutElastic(1, .8)',
        delay: 400
    });

    // Title animation
    anime({
        targets: '.animate-title',
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 600
    });

    // Status indicator animation
    anime({
        targets: '.animate-status',
        opacity: [0, 1],
        translateX: [30, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 800
    });

    // Control panel animation
    anime({
        targets: '.animate-panel',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 1000
    });

    // Input selector animation
    anime({
        targets: '.animate-selector',
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 1200
    });

    // Input options animation
    anime({
        targets: '.animate-option',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: function(el, i) {
            return 1400 + (i * 100);
        }
    });

    // Input groups animation
    anime({
        targets: '.animate-input',
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: function(el) {
            return 1600 + (parseInt(el.dataset.delay) || 0);
        }
    });

    // Buttons animation
    anime({
        targets: '.animate-buttons',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 1800
    });

    // Individual button animations
    anime({
        targets: '.animate-btn',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .6)',
        delay: function(el) {
            return 2000 + (parseInt(el.dataset.delay) || 0);
        }
    });

    // Main content animation
    anime({
        targets: '.animate-main',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 2200
    });

    // Sections animation
    anime({
        targets: '.animate-section',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: function(el) {
            return 2400 + (parseInt(el.dataset.delay) || 0);
        }
    });

    // Cards animation
    anime({
        targets: '.animate-card',
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: function(el) {
            return 2600 + (parseInt(el.dataset.delay) || 0);
        }
    });

    // Placeholder animation
    anime({
        targets: '.animate-placeholder',
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 2800
    });
}

/**
 * Animate button click
 */
function animateButtonClick(button) {
    anime({
        targets: button,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeInOutQuad'
    });
}

/**
 * Animate card hover
 */
function animateCardHover(card) {
    anime({
        targets: card,
        translateY: [0, -5],
        scale: [1, 1.02],
        duration: 300,
        easing: 'easeOutExpo'
    });
}

/**
 * Animate card leave
 */
function animateCardLeave(card) {
    anime({
        targets: card,
        translateY: [-5, 0],
        scale: [1.02, 1],
        duration: 300,
        easing: 'easeOutExpo'
    });
}

/**
 * Animate number counter
 */
function animateCounter(element, start, end, duration = 1000) {
    anime({
        targets: { value: start },
        value: end,
        duration: duration,
        easing: 'easeOutExpo',
        update: function(anim) {
            element.textContent = Math.round(anim.animatables[0].target.value);
        }
    });
}

/**
 * Animate status change
 */
function animateStatusChange(element, newStatus) {
    anime({
        targets: element,
        scale: [1, 1.1, 1],
        color: ['#ffa726', '#00d4aa'],
        duration: 600,
        easing: 'easeOutExpo',
        complete: function() {
            element.textContent = newStatus;
        }
    });
}

/**
 * Animate detection result
 */
function animateDetectionResult(count) {
    const countElement = elements.humanCount;
    
    // Animate the number change
    animateCounter(countElement, parseInt(countElement.textContent), count);
    
    // Animate the card
    anime({
        targets: '.human-count-card',
        scale: [1, 1.05, 1],
        duration: 400,
        easing: 'easeOutElastic(1, .6)'
    });
}

/**
 * Animate modal appearance
 */
function animateModalShow(modal) {
    anime({
        targets: modal,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 300,
        easing: 'easeOutExpo'
    });
}

/**
 * Animate modal hide
 */
function animateModalHide(modal) {
    anime({
        targets: modal,
        opacity: [1, 0],
        scale: [1, 0.8],
        duration: 200,
        easing: 'easeInExpo',
        complete: function() {
            modal.style.display = 'none';
        }
    });
}

/**
 * Handle input type change (Camera vs RTMP)
 */
function handleInputTypeChange(event) {
    const inputType = event.target.value;
    appState.currentInputType = inputType;
    
    if (inputType === 'camera') {
        elements.cameraGroup.style.display = 'block';
        elements.rtmpGroup.style.display = 'none';
        // Load cameras if not already loaded
        if (appState.availableCameras.length === 0) {
            loadAvailableCameras();
        }
    } else {
        elements.cameraGroup.style.display = 'none';
        elements.rtmpGroup.style.display = 'block';
    }
}

/**
 * Load available cameras
 */
async function loadAvailableCameras() {
    try {
        console.log(`Loading cameras (attempt ${appState.cameraLoadRetries + 1})...`);
        
        // First, try to get user media to trigger permission request
        // This is needed to get proper camera labels
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // Stop the stream immediately, we just needed permission
            stream.getTracks().forEach(track => track.stop());
            console.log('Camera permission granted');
        } catch (permissionError) {
            console.log('Camera permission not granted yet:', permissionError);
        }
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('All devices:', devices);
        
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Video devices found:', videoDevices);
        
        appState.availableCameras = videoDevices;
        updateCameraSelect(videoDevices);
        
        if (videoDevices.length === 0) {
            if (appState.cameraLoadRetries < appState.maxCameraRetries) {
                appState.cameraLoadRetries++;
                console.log(`No cameras found, retrying in 1 second... (${appState.cameraLoadRetries}/${appState.maxCameraRetries})`);
                setTimeout(loadAvailableCameras, 1000);
                return;
            }
            showError('No cameras found. Please connect a camera and refresh.');
        } else {
            console.log(`Successfully loaded ${videoDevices.length} camera(s)`);
            appState.cameraLoadRetries = 0; // Reset retry counter on success
        }
    } catch (error) {
        console.error('Error loading cameras:', error);
        
        if (appState.cameraLoadRetries < appState.maxCameraRetries) {
            appState.cameraLoadRetries++;
            console.log(`Error loading cameras, retrying in 1 second... (${appState.cameraLoadRetries}/${appState.maxCameraRetries})`);
            setTimeout(loadAvailableCameras, 1000);
            return;
        }
        
        showError('Error accessing cameras. Please check permissions.');
    }
}

/**
 * Update camera select dropdown
 */
function updateCameraSelect(cameras) {
    elements.cameraSelect.innerHTML = '';
    
    if (cameras.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No cameras found';
        elements.cameraSelect.appendChild(option);
        return;
    }
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a camera...';
    elements.cameraSelect.appendChild(defaultOption);
    
    cameras.forEach((camera, index) => {
        const option = document.createElement('option');
        option.value = camera.deviceId;
        // Use a more descriptive label
        const label = camera.label || `Camera ${index + 1}`;
        option.textContent = label;
        console.log(`Added camera option: ${label} (${camera.deviceId})`);
        elements.cameraSelect.appendChild(option);
    });
    
    // Auto-select the first camera if only one is available
    if (cameras.length === 1) {
        elements.cameraSelect.value = cameras[0].deviceId;
        console.log('Auto-selected single camera:', cameras[0].label || 'Camera 1');
    }
}

/**
 * Load TensorFlow.js COCO-SSD model
 */
async function loadDetectionModel() {
    try {
        showLoading(true);
        console.log('Loading COCO-SSD model...');
        
        appState.model = await cocoSsd.load();
        console.log('Model loaded successfully');
        
        updateConnectionStatus(true);
        showSuccess('AI model loaded successfully');
        
    } catch (error) {
        console.error('Error loading model:', error);
        showError(`Failed to load AI model: ${error.message}`);
        updateConnectionStatus(false);
    } finally {
        showLoading(false);
    }
}

/**
 * Start human detection
 */
async function startDetection() {
    if (!appState.model) {
        showError('AI model not loaded yet. Please wait...');
        return;
    }
    
    try {
        showLoading(true);
        
        if (appState.currentInputType === 'camera') {
            await startCameraDetection();
        } else {
            await startRTMPDetection();
        }
        
    } catch (error) {
        console.error('Error starting detection:', error);
        showError(`Failed to start detection: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

/**
 * Start camera detection
 */
async function startCameraDetection() {
    const cameraId = elements.cameraSelect.value;
    
    if (!cameraId) {
        showError('Please select a camera');
        return;
    }
    
    try {
        console.log('Starting camera detection with ID:', cameraId);
        
        // Get camera stream
        const constraints = {
            video: {
                deviceId: { exact: cameraId },
                width: { ideal: 640 },
                height: { ideal: 480 },
                frameRate: { ideal: 30 }
            }
        };
        
        appState.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        elements.videoElement.srcObject = appState.currentStream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
            elements.videoElement.onloadedmetadata = resolve;
        });
        
        // Show video and canvas
        elements.videoElement.style.display = 'block';
        elements.detectionCanvas.style.display = 'block';
        elements.videoDisplay.querySelector('.placeholder-content').style.display = 'none';
        
        // Start detection loop
        appState.isDetecting = true;
        updateDetectionControls(true);
        startDetectionLoop();
        
        showSuccess('Camera detection started successfully');
        addToDetectionLog(`Detection started with camera: ${elements.cameraSelect.selectedOptions[0].text}`);
        
    } catch (error) {
        console.error('Error starting camera detection:', error);
        
        // Try with default constraints if specific device fails
        if (error.name === 'NotFoundError' || error.name === 'NotReadableError') {
            console.log('Trying with default camera constraints...');
            try {
                const defaultConstraints = { video: true };
                appState.currentStream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
                elements.videoElement.srcObject = appState.currentStream;
                
                await new Promise((resolve) => {
                    elements.videoElement.onloadedmetadata = resolve;
                });
                
                elements.videoElement.style.display = 'block';
                elements.detectionCanvas.style.display = 'block';
                elements.videoDisplay.querySelector('.placeholder-content').style.display = 'none';
                
                appState.isDetecting = true;
                updateDetectionControls(true);
                startDetectionLoop();
                
                showSuccess('Camera detection started with default camera');
                addToDetectionLog('Detection started with default camera');
                return;
            } catch (defaultError) {
                console.error('Default camera also failed:', defaultError);
            }
        }
        
        showError(`Failed to start camera detection: ${error.message}`);
    }
}

/**
 * Start RTMP detection
 */
async function startRTMPDetection() {
    const fullUrlInput = elements.rtmpUrl ? elements.rtmpUrl.value.trim() : '';
    const serverUrlInput = elements.rtmpServerUrl ? elements.rtmpServerUrl.value.trim() : '';
    const streamKeyInput = elements.rtmpStreamKey ? elements.rtmpStreamKey.value.trim() : '';

    // Prefer server URL + stream key if both provided; otherwise fall back to full URL
    let rtmpUrl = '';
    if (serverUrlInput && streamKeyInput) {
        // Ensure there is exactly one slash between server URL and stream key
        const hasTrailingSlash = serverUrlInput.endsWith('/') || serverUrlInput.endsWith('\\');
        rtmpUrl = hasTrailingSlash ? `${serverUrlInput}${streamKeyInput}` : `${serverUrlInput}/${streamKeyInput}`;
    } else {
        rtmpUrl = fullUrlInput;
    }

    if (!rtmpUrl) {
        showError('Please provide RTMP Server URL + Stream Key or a full RTMP URL');
        return;
    }
    
    // Create video element for RTMP stream
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.style.display = 'none';
    
    // Try to load RTMP stream (this might not work in all browsers)
    video.src = rtmpUrl;
    
    // Wait for video to be ready
    await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
        video.load();
    });
    
    // Replace the video element
    const oldVideo = elements.videoElement;
    oldVideo.parentNode.replaceChild(video, oldVideo);
    elements.videoElement = video;
    
    // Show video and canvas
    elements.videoElement.style.display = 'block';
    elements.detectionCanvas.style.display = 'block';
    elements.videoDisplay.querySelector('.placeholder-content').style.display = 'none';
    
    // Start detection loop
    appState.isDetecting = true;
    updateDetectionControls(true);
    startDetectionLoop();
    
    showSuccess('RTMP detection started successfully');
    addToDetectionLog(`Detection started with RTMP: ${rtmpUrl}`);
}

/**
 * Stop human detection
 */
function stopDetection() {
    // Stop camera stream if active
    if (appState.currentStream && appState.currentInputType === 'camera') {
        appState.currentStream.getTracks().forEach(track => track.stop());
        appState.currentStream = null;
    }
    
    // Stop RTMP stream if active
    if (appState.currentInputType === 'rtmp' && elements.videoElement) {
        elements.videoElement.pause();
        elements.videoElement.src = '';
    }
    
    stopDetectionLoop();
    appState.isDetecting = false;
    updateDetectionControls(false);
    
    // Hide video and show placeholder
    elements.videoElement.style.display = 'none';
    elements.detectionCanvas.style.display = 'none';
    elements.videoDisplay.querySelector('.placeholder-content').style.display = 'block';
    
    // Clear canvas
    const ctx = elements.detectionCanvas.getContext('2d');
    ctx.clearRect(0, 0, elements.detectionCanvas.width, elements.detectionCanvas.height);
    
    // Reset displays
    elements.humanCount.textContent = '0';
    elements.streamStatus.textContent = 'Inactive';
    elements.streamStatus.classList.remove('active');
    elements.currentDetections.innerHTML = '';
    
    showSuccess('Detection stopped');
    addToDetectionLog('Detection stopped');
}

/**
 * Toggle detection on/off while keeping camera active
 */
function toggleDetection() {
    appState.isDetectionEnabled = !appState.isDetectionEnabled;
    
    if (appState.isDetectionEnabled) {
        elements.toggleDetectionBtn.innerHTML = '<i class="fas fa-eye"></i> Detection ON';
        elements.toggleDetectionBtn.classList.remove('btn-disabled');
        addToDetectionLog('Detection enabled');
    } else {
        elements.toggleDetectionBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Detection OFF';
        elements.toggleDetectionBtn.classList.add('btn-disabled');
        addToDetectionLog('Detection disabled');
    }
}

/**
 * Start the detection loop
 */
function startDetectionLoop() {
    if (appState.detectionInterval) {
        clearInterval(appState.detectionInterval);
    }
    
    // Start immediately
    detectHumans();
    
    // Then set up regular detection
    appState.detectionInterval = setInterval(detectHumans, DETECTION_INTERVAL);
}

/**
 * Stop the detection loop
 */
function stopDetectionLoop() {
    if (appState.detectionInterval) {
        clearInterval(appState.detectionInterval);
        appState.detectionInterval = null;
    }
}

/**
 * Main detection function
 */
async function detectHumans() {
    if (!appState.isDetecting || !appState.isDetectionEnabled || !appState.model) {
        return;
    }
    
    const startTime = performance.now();
    
    try {
        // Get current frame from video
        const video = elements.videoElement;
        const canvas = elements.detectionCanvas;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match video
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Run detection
        const predictions = await appState.model.detect(canvas);
        
        // Filter for humans only
        const humanDetections = predictions.filter(prediction => 
            prediction.class === 'person' && 
            prediction.score >= parseFloat(elements.confidenceSlider.value)
        );
        
        // Draw bounding boxes
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        humanDetections.forEach((detection, index) => {
            const [x, y, width, height] = detection.bbox;
            
            // Draw bounding box
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            
            // Draw label
            ctx.fillStyle = '#00ff00';
            ctx.font = '14px Arial';
            ctx.fillText(
                `Person ${index + 1} (${(detection.score * 100).toFixed(1)}%)`,
                x, y - 5
            );
        });
        
        // Update displays
        updateDetectionDisplay(humanDetections);
        
        // Update performance stats
        const processingTime = performance.now() - startTime;
        appState.performanceStats.processingTime = processingTime;
        appState.performanceStats.fps = 1000 / DETECTION_INTERVAL;
        appState.performanceStats.lastUpdate = Date.now();
        
        updatePerformanceDisplay();
        
    } catch (error) {
        console.error('Error during detection:', error);
    }
}

/**
 * Update detection display
 */
function updateDetectionDisplay(detections) {
    const humanCount = detections.length;
    
    // Update human count with animation
    if (humanCount !== appState.lastHumanCount) {
        animateDetectionResult(humanCount);
        appState.lastHumanCount = humanCount;
        addToDetectionLog(`Detected ${humanCount} humans`);
    }
    
    // Update stream status with animation
    if (!elements.streamStatus.classList.contains('active')) {
        animateStatusChange(elements.streamStatus, 'Active');
        elements.streamStatus.classList.add('active');
    }
    
    // Update timestamp
    const now = new Date();
    elements.lastUpdate.textContent = `Last update: ${now.toLocaleTimeString()}`;
    
    // Update current detections
    updateCurrentDetections(detections);
}

/**
 * Update current detections display
 */
function updateCurrentDetections(detections) {
    elements.currentDetections.innerHTML = '';
    
    if (!detections || detections.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'detection-empty';
        emptyEl.textContent = 'No detections in current frame';
        elements.currentDetections.appendChild(emptyEl);
        return;
    }
    
    detections.forEach((detection, index) => {
        const detectionEl = document.createElement('div');
        detectionEl.className = 'detection-item';
        
        const confidenceEl = document.createElement('div');
        confidenceEl.className = 'detection-confidence';
        confidenceEl.textContent = `${Math.round(detection.score * 100)}%`;
        
        const labelEl = document.createElement('div');
        labelEl.className = 'detection-label';
        labelEl.textContent = `Person ${index + 1}`;
        
        detectionEl.appendChild(confidenceEl);
        detectionEl.appendChild(labelEl);
        
        elements.currentDetections.appendChild(detectionEl);
    });
}

/**
 * Update performance display
 */
function updatePerformanceDisplay() {
    const stats = appState.performanceStats;
    
    // Update FPS display
    if (elements.fpsDisplay) {
        elements.fpsDisplay.textContent = Math.round(stats.fps || 0);
    }
    
    // Update processing time display
    if (elements.processTimeDisplay) {
        const processTime = Math.round(stats.processingTime || 0);
        elements.processTimeDisplay.textContent = `${processTime}ms`;
    }
}

/**
 * Update confidence threshold
 */
function updateConfidence() {
    const value = elements.confidenceSlider.value;
    elements.confidenceValue.textContent = value;
    addToDetectionLog(`Confidence threshold set to ${value}`);
}

/**
 * Add an entry to the detection log
 */
function addToDetectionLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    
    // Create log item
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    
    const timeEl = document.createElement('div');
    timeEl.className = 'log-timestamp';
    timeEl.textContent = timestamp;
    
    logItem.appendChild(messageEl);
    logItem.appendChild(timeEl);
    
    // Remove empty placeholder if present
    const emptyLog = elements.detectionLog.querySelector('.log-empty');
    if (emptyLog) {
        elements.detectionLog.removeChild(emptyLog);
    }
    
    // Add to log and scroll to bottom
    elements.detectionLog.prepend(logItem);
    
    // Limit log entries
    const logItems = elements.detectionLog.querySelectorAll('.log-item');
    if (logItems.length > MAX_LOG_ENTRIES) {
        for (let i = MAX_LOG_ENTRIES; i < logItems.length; i++) {
            elements.detectionLog.removeChild(logItems[i]);
        }
    }
    
    // Add to history array
    appState.detectionHistory.push({
        message,
        timestamp
    });
    
    // Limit history array
    if (appState.detectionHistory.length > MAX_LOG_ENTRIES) {
        appState.detectionHistory = appState.detectionHistory.slice(0, MAX_LOG_ENTRIES);
    }
}

/**
 * Clear the detection log
 */
function clearDetectionLog() {
    elements.detectionLog.innerHTML = '';
    
    const emptyLog = document.createElement('div');
    emptyLog.className = 'log-empty';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-search';
    
    const text = document.createElement('p');
    text.textContent = 'No detections yet';
    
    emptyLog.appendChild(icon);
    emptyLog.appendChild(text);
    
    elements.detectionLog.appendChild(emptyLog);
    
    // Clear history array
    appState.detectionHistory = [];
}

/**
 * Update the detection controls based on detection state
 */
function updateDetectionControls(isDetecting) {
    if (isDetecting) {
        elements.startBtn.disabled = true;
        elements.stopBtn.disabled = false;
        elements.cameraSelect.disabled = true;
        elements.toggleDetectionBtn.disabled = false;
    } else {
        elements.startBtn.disabled = false;
        elements.stopBtn.disabled = true;
        elements.cameraSelect.disabled = false;
        elements.toggleDetectionBtn.disabled = true;
    }
}

/**
 * Update the connection status indicator
 */
function updateConnectionStatus(isConnected) {
    const statusDot = elements.connectionStatus.querySelector('.status-dot');
    const statusText = elements.connectionStatus.querySelector('.status-text');
    
    if (isConnected) {
        statusDot.classList.add('connected');
        statusDot.classList.remove('error');
        statusText.textContent = 'Ready';
    } else {
        statusDot.classList.remove('connected');
        statusDot.classList.add('error');
        statusText.textContent = 'Not Ready';
    }
}

/**
 * Show the loading overlay
 */
function showLoading(show) {
    elements.loadingOverlay.style.display = show ? 'flex' : 'none';
}

/**
 * Show an error message
 */
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorModal.style.display = 'flex';
    animateModalShow(elements.errorModal);
}

/**
 * Show a success message
 */
function showSuccess(message) {
    elements.successMessage.textContent = message;
    elements.successModal.style.display = 'flex';
    animateModalShow(elements.successModal);
}

/**
 * Hide a modal
 */
function hideModal(modal) {
    animateModalHide(modal);
}

/**
 * Open the contact modal
 */
function openContactModal() {
    elements.contactModal.style.display = 'flex';
    animateModalShow(elements.contactModal);
    
    // Clear any previous form data
    if (elements.contactForm) {
        elements.contactForm.reset();
    }
}

/**
 * Handle contact form submission
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    // Validate form
    if (!name || !email || !subject || !message) {
        showError('Please fill in all fields');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Animate button click
    animateButtonClick(elements.sendContactBtn);
    
    // In a real application, you would send this data to a server
    // For now, we'll just log it and show a success message
    console.log('Contact form submitted:', { name, email, subject, message });
    
    // Store the contact submission in localStorage (for demo purposes)
    const contactSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    contactSubmissions.push({
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(contactSubmissions));
    
    // Hide contact modal and show success message
    hideModal(elements.contactModal);
    
    setTimeout(() => {
        showSuccess(`Thank you for contacting us, ${name}! We'll get back to you soon at ${email}.`);
        
        // Reset the form
        elements.contactForm.reset();
    }, 300);
}
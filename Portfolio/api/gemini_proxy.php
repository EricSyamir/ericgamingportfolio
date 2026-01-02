<?php
// Simple Gemini proxy to protect API key
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Proxy-Token');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$token = $_SERVER['HTTP_X_PROXY_TOKEN'] ?? '';
// Optional: set your own token to limit public abuse
$expected = getenv('PROXY_TOKEN') ?: 'change-this-token';
if ($expected && $token !== $expected) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
$prompt = $data['prompt'] ?? '';
$system = $data['system'] ?? '';
$context = $data['context'] ?? '';
$history = $data['history'] ?? [];
if (!$prompt) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing prompt']);
    exit;
}

// Config
$apiKey = getenv('GEMINI_API_KEY') ?: 'AIzaSyBsEYJOYou8lvm5gj0sXST9yQbPIufoD3w';
$model = getenv('GEMINI_MODEL') ?: 'gemini-2.0-flash'; // default to 2.0 flash per placeholder
$baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/';
$endpoint = $baseUrl . rawurlencode($model) . ':generateContent';

$parts = [];
if ($system) { $parts[] = ['text' => $system]; }
if ($context) { $parts[] = ['text' => $context]; }
$parts[] = ['text' => $prompt];

$payload = [
    'contents' => [
        [ 'parts' => $parts ]
    ],
    'generationConfig' => [
        'temperature' => 0.2,
        'topP' => 0.95,
        'topK' => 40,
        'maxOutputTokens' => 512
    ]
];

$headers = [
    'Content-Type: application/json',
    'X-goog-api-key: ' . $apiKey,
];

$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

// If model not found, try fallbacks
if (!$err && ($httpCode === 404 || $httpCode === 400) && stripos($response, 'not found') !== false) {
    $fallbacks = ['gemini-1.5-flash', 'gemini-1.5-flash-002'];
    foreach ($fallbacks as $fb) {
        $endpoint = $baseUrl . rawurlencode($fb) . ':generateContent';
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        if ($err === '' && $httpCode >= 200 && $httpCode < 300) break;
    }
}

curl_close($ch);

if ($err) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL error', 'detail' => $err]);
    exit;
}

http_response_code($httpCode);
echo $response;

<?php
/**
 * Usługi Busem – obsługa formularza wyceny (wersja 6).
 *
 * Konfiguracja: wpisz adres, na który mają przychodzić zapytania (RECIPIENT),
 * oraz adres nadawcy w Twojej domenie (SENDER), np. formularz@twojadomena.pl.
 * Na Hostingerze adres nadawcy powinien istnieć jako skrzynka w panelu hPanel,
 * inaczej wiadomości mogą trafiać do spamu.
 */
const RECIPIENT = '';
const SENDER = '';
const SITE_NAME = 'Usługi Busem';

const MAX_FILES = 6;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
const MIN_FILL_SECONDS = 3;
const RATE_LIMIT = 5;          // najwięcej zapytań z jednego adresu IP...
const RATE_WINDOW = 3600;      // ...w ciągu godziny

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function field(string $name, int $max = 300): string
{
    $v = isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
    $v = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '');
    return mb_substr($v, 0, $max);
}

function oneLine(string $v): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $v) ?? '');
}

/** Wartość z listy dozwolonych albo pusty tekst. */
function choice(string $name, array $allowed): string
{
    $v = oneLine(field($name, 120));
    return in_array($v, $allowed, true) ? $v : '';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Formularz przyjmuje tylko wysyłkę metodą POST.']);
}

if (RECIPIENT === '' || SENDER === '') {
    respond(503, ['ok' => false, 'error' => 'not_configured',
        'message' => 'Wysyłka formularza nie jest jeszcze skonfigurowana. Zadzwoń do nas, a przygotujemy wycenę przez telefon.']);
}

// Ochrona przed botami: ukryte pole i zbyt szybkie wypełnienie.
$started = (int) field('started', 20);
if (field('website') !== '' || ($started > 0 && (time() * 1000 - $started) < MIN_FILL_SECONDS * 1000)) {
    respond(200, ['ok' => true]);
}

// Limit zapytań z jednego adresu IP (plik w katalogu tymczasowym serwera).
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
$rateFile = rtrim(sys_get_temp_dir(), '/') . '/ub_rate_' . hash('sha256', $ip . '|' . __FILE__);
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(array_map('intval', explode(',', (string) file_get_contents($rateFile))), fn($t) => $t > time() - RATE_WINDOW);
}
if (count($hits) >= RATE_LIMIT) {
    respond(429, ['ok' => false, 'message' => 'Wysłano już kilka zapytań z tego urządzenia. Spróbuj za godzinę albo zadzwoń do nas.']);
}

$KINDS = ['Przeprowadzka mieszkania', 'Przeprowadzka domu', 'Przeprowadzka biura lub firmy', 'Transport mebli',
    'Transport rzeczy wielkogabarytowych', 'Transport busem (inne rzeczy)', 'Opróżnianie i wywóz'];
$SIZES = ['Kawalerka', '2 pokoje', '3 pokoje', '4 pokoje i więcej', 'Dom', 'Biuro', 'Pojedyncze meble lub rzeczy'];
$FLOORS = ['Parter', '1. piętro', '2. piętro', '3. piętro', '4. piętro', '5. piętro', '6.–10. piętro', 'Powyżej 10. piętra'];
$LIFTS = ['W obu miejscach', 'Tylko przy załadunku', 'Tylko przy rozładunku', 'Nigdzie nie ma windy', 'Nie wiem'];
$HELP = ['Tak', 'Nie', 'Nie wiem'];
$EXTRAS = ['Demontaż i montaż mebli', 'Wywóz niepotrzebnych rzeczy', 'Transport rzeczy wielkogabarytowych', 'Inne – opiszę w uwagach'];

$date = oneLine(field('date', 10));
if ($date !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $date = '';

$extras = [];
if (isset($_POST['extras']) && is_array($_POST['extras'])) {
    foreach ($_POST['extras'] as $e) {
        if (is_string($e) && in_array($e, $EXTRAS, true) && !in_array($e, $extras, true)) $extras[] = $e;
    }
}

$data = [
    'name' => oneLine(field('name', 120)),
    'phone' => oneLine(field('phone', 40)),
    'email' => oneLine(field('email', 160)),
    'from' => oneLine(field('from', 200)),
    'to' => oneLine(field('to', 200)),
    'date' => $date,
    'flexible' => field('flexible', 3) === 'tak',
    'kind' => choice('kind', $KINDS),
    'size' => choice('size', $SIZES),
    'floor_from' => choice('floor_from', $FLOORS),
    'floor_to' => choice('floor_to', $FLOORS),
    'lift' => choice('lift', $LIFTS),
    'help' => choice('help', $HELP),
    'extras' => $extras,
    'details' => field('details', 3000),
    'consent' => field('consent', 3) === 'tak',
];

$errors = [];
if (mb_strlen($data['name']) < 3) $errors['name'] = 'Wpisz imię i nazwisko.';
$digits = preg_replace('/^(\+48|0048)/', '', preg_replace('/[\s().-]/', '', $data['phone']) ?? '');
if (!preg_match('/^\d{9}$/', (string) $digits)) $errors['phone'] = 'Wpisz 9-cyfrowy numer telefonu.';
if ($data['email'] !== '' && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Sprawdź adres e-mail.';
if (mb_strlen($data['from']) < 2) $errors['from'] = 'Wpisz adres załadunku.';
if ($data['kind'] === '') $errors['kind'] = 'Wybierz rodzaj przeprowadzki lub transportu.';
if (!$data['consent']) $errors['consent'] = 'Zaznacz zgodę, żeby wysłać zapytanie.';

// Zdjęcia
$attachments = [];
if (!empty($_FILES['photos']) && is_array($_FILES['photos']['name'])) {
    $count = count(array_filter($_FILES['photos']['name'], fn($n) => $n !== ''));
    $total = 0;
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/heic' => 'heic', 'image/heif' => 'heif'];
    if ($count > MAX_FILES) {
        $errors['photos'] = 'Możesz dodać najwyżej 6 zdjęć.';
    } else {
        foreach ($_FILES['photos']['name'] as $i => $origName) {
            if ($origName === '') continue;
            $err = $_FILES['photos']['error'][$i];
            $tmp = $_FILES['photos']['tmp_name'][$i];
            $size = (int) $_FILES['photos']['size'][$i];
            if ($err !== UPLOAD_ERR_OK || !is_uploaded_file($tmp)) { $errors['photos'] = 'Nie udało się przesłać jednego ze zdjęć. Spróbuj ponownie.'; break; }
            if ($size > MAX_FILE_BYTES) { $errors['photos'] = 'Każde zdjęcie może mieć najwyżej 8 MB.'; break; }
            $total += $size;
            if ($total > MAX_TOTAL_BYTES) { $errors['photos'] = 'Łącznie zdjęcia mogą mieć najwyżej 20 MB.'; break; }
            $mime = $finfo->file($tmp) ?: '';
            if (!isset($allowed[$mime])) { $errors['photos'] = 'Dodaj zdjęcia w formacie JPG, PNG, WEBP lub HEIC.'; break; }
            $attachments[] = ['name' => sprintf('zdjecie-%d.%s', count($attachments) + 1, $allowed[$mime]), 'mime' => $mime, 'path' => $tmp];
        }
    }
}

if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors, 'message' => 'Popraw pola zaznaczone na czerwono.']);
}

$or = fn(string $v, string $empty = 'nie podano') => $v !== '' ? $v : $empty;
$term = $data['date'] !== '' ? $data['date'] : 'nie podano';
if ($data['flexible']) $term .= ' (termin elastyczny)';

// Treść wiadomości
$lines = [
    'Nowe zapytanie o wycenę ze strony ' . SITE_NAME,
    '',
    'DANE KLIENTA',
    'Imię i nazwisko: ' . $data['name'],
    'Telefon: ' . $data['phone'],
    'E-mail: ' . $or($data['email']),
    '',
    'PRZEPROWADZKA',
    'Rodzaj: ' . $data['kind'],
    'Wielkość: ' . $or($data['size']),
    'Adres załadunku: ' . $data['from'],
    'Piętro załadunku: ' . $or($data['floor_from']),
    'Adres rozładunku: ' . $or($data['to']),
    'Piętro rozładunku: ' . $or($data['floor_to']),
    'Winda: ' . $or($data['lift']),
    'Preferowany termin: ' . $term,
    'Pomoc przy załadunku i rozładunku: ' . $or($data['help']),
    'Usługi dodatkowe: ' . ($data['extras'] ? implode(', ', $data['extras']) : 'brak'),
    '',
    'OPIS ZLECENIA',
    $data['details'] !== '' ? $data['details'] : 'brak',
    '',
    'Zdjęcia w załącznikach: ' . count($attachments),
    'Zgoda na przetwarzanie danych: tak, ' . date('Y-m-d H:i'),
];
$body = implode("\r\n", $lines);

$enc = fn(string $s) => '=?UTF-8?B?' . base64_encode($s) . '?=';
$subject = $enc('Wycena: ' . $data['kind'] . ' – ' . $data['name']);
$boundary = 'ub_' . bin2hex(random_bytes(12));

$headers = [
    'From: ' . $enc(SITE_NAME) . ' <' . SENDER . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
];
if ($data['email'] !== '') $headers[] = 'Reply-To: ' . $enc($data['name']) . ' <' . $data['email'] . '>';

$message = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($body)) . "\r\n";
foreach ($attachments as $a) {
    $message .= "--$boundary\r\nContent-Type: {$a['mime']}; name=\"{$a['name']}\"\r\nContent-Transfer-Encoding: base64\r\n"
        . "Content-Disposition: attachment; filename=\"{$a['name']}\"\r\n\r\n"
        . chunk_split(base64_encode((string) file_get_contents($a['path']))) . "\r\n";
}
$message .= "--$boundary--\r\n";

$sent = mail(RECIPIENT, $subject, $message, implode("\r\n", $headers), '-f' . SENDER);

if (!$sent) {
    respond(502, ['ok' => false, 'message' => 'Serwer nie wysłał wiadomości. Spróbuj ponownie za chwilę albo zadzwoń do nas.']);
}
$hits[] = time();
@file_put_contents($rateFile, implode(',', $hits), LOCK_EX);
respond(200, ['ok' => true]);

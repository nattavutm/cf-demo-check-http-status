const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HTTP Status Checker</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:           #f0f4f8;
      --surface:      #ffffff;
      --border:       #e2e8f0;
      --text:         #0f172a;
      --muted:        #64748b;
      --accent:       #6366f1;
      --accent-dark:  #4f46e5;
      --accent-light: #eef2ff;
      --ok-fg:    #059669; --ok-bg:    #ecfdf5;
      --rd-fg:    #2563eb; --rd-bg:    #eff6ff;
      --cl-fg:    #d97706; --cl-bg:    #fffbeb;
      --sv-fg:    #dc2626; --sv-bg:    #fef2f2;
      --er-fg:    #64748b; --er-bg:    #f1f5f9;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding: 2.5rem 1rem 3rem;
    }

    .container { max-width: 820px; margin: 0 auto; }

    /* ── Header ─────────────────────────────────── */
    header { text-align: center; margin-bottom: 2.25rem; }

    header h1 { font-size: 1.8rem; font-weight: 700; letter-spacing: -.5px; }
    header p  { color: var(--muted); margin-top: .4rem; font-size: .95rem; }

    /* ── Card ────────────────────────────────────── */
    .card {
      background: var(--surface);
      border-radius: 18px;
      padding: 1.5rem 1.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 20px rgba(0,0,0,.05);
      margin-bottom: 1.5rem;
    }

    .card-label {
      font-size: .72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: var(--muted);
      margin-bottom: .625rem;
    }

    /* ── Textarea ────────────────────────────────── */
    textarea {
      width: 100%;
      height: 176px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      padding: .875rem 1rem;
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: .85rem;
      color: var(--text);
      background: #fafbfc;
      resize: vertical;
      outline: none;
      transition: border-color .2s, background .2s;
      line-height: 1.6;
    }
    textarea:focus { border-color: var(--accent); background: #fff; }
    textarea::placeholder { color: #94a3b8; }

    /* ── Buttons ─────────────────────────────────── */
    .actions { display: flex; gap: .75rem; margin-top: 1rem; align-items: center; }

    .btn-check {
      flex: 1;
      padding: .75rem 1.25rem;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: .95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      transition: background .2s, transform .15s, box-shadow .2s;
    }
    .btn-check:hover:not(:disabled) {
      background: var(--accent-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(99,102,241,.4);
    }
    .btn-check:active:not(:disabled) { transform: translateY(0); }
    .btn-check:disabled { opacity: .6; cursor: not-allowed; }

    .btn-clear {
      padding: .75rem 1.1rem;
      background: transparent;
      color: var(--muted);
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-size: .875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background .2s, border-color .2s;
      white-space: nowrap;
    }
    .btn-clear:hover { background: #f1f5f9; border-color: #cbd5e1; }

    /* ── Spinner ─────────────────────────────────── */
    .spinner {
      width: 15px; height: 15px;
      border: 2px solid rgba(255,255,255,.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin .7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Progress bar ────────────────────────────── */
    .progress-wrap {
      height: 3px;
      background: var(--border);
      border-radius: 99px;
      margin-bottom: 1.25rem;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 99px;
      width: 0%;
      transition: width .35s ease;
    }

    /* ── Results header ──────────────────────────── */
    .results-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: .5rem;
      margin-bottom: 1rem;
    }
    .results-title { font-size: 1rem; font-weight: 600; }

    .summary-pills { display: flex; gap: .4rem; flex-wrap: wrap; }
    .pill {
      padding: .2rem .6rem;
      border-radius: 20px;
      font-size: .72rem;
      font-weight: 600;
    }

    /* ── Result item ─────────────────────────────── */
    .result-item {
      display: flex;
      align-items: center;
      gap: .875rem;
      padding: .875rem 1rem;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      margin-bottom: .5rem;
      transition: border-color .2s, box-shadow .2s;
    }
    .result-item:last-child { margin-bottom: 0; }
    .result-item:hover { border-color: #c7d2e4; box-shadow: 0 2px 8px rgba(0,0,0,.07); }

    .status-badge {
      flex-shrink: 0;
      width: 68px;
      padding: .3rem .5rem;
      border-radius: 8px;
      font-size: .875rem;
      font-weight: 700;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    .s-ok { background: var(--ok-bg); color: var(--ok-fg); }
    .s-rd { background: var(--rd-bg); color: var(--rd-fg); }
    .s-cl { background: var(--cl-bg); color: var(--cl-fg); }
    .s-sv { background: var(--sv-bg); color: var(--sv-fg); }
    .s-er { background: var(--er-bg); color: var(--er-fg); }

    .result-url-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: .25rem;
      min-width: 0;
    }
    .result-url {
      font-family: 'Menlo', 'Monaco', monospace;
      font-size: .82rem;
      word-break: break-all;
      color: var(--text);
    }
    .result-dns {
      display: flex;
      align-items: center;
      gap: .35rem;
      font-size: .73rem;
      color: var(--muted);
      flex-wrap: wrap;
    }
    .dns-badge {
      display: inline-flex;
      align-items: center;
      padding: .1rem .38rem;
      border-radius: 4px;
      font-size: .65rem;
      font-weight: 700;
      letter-spacing: .04em;
      flex-shrink: 0;
    }
    .dns-a    { background: #dbeafe; color: #1d4ed8; }
    .dns-cname{ background: #fce7f3; color: #be185d; }
    .dns-none { background: #f1f5f9; color: #94a3b8; }
    .dns-val  {
      font-family: 'Menlo', 'Monaco', monospace;
      font-size: .73rem;
      word-break: break-all;
    }
    .result-desc {
      font-size: .78rem;
      color: var(--muted);
      flex-shrink: 0;
      max-width: 160px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .result-time {
      font-size: .78rem;
      color: var(--muted);
      flex-shrink: 0;
      min-width: 58px;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    /* ── Empty state ─────────────────────────────── */
    .empty-state {
      text-align: center;
      padding: 2.5rem 1rem;
      color: var(--muted);
    }

    .hidden { display: none !important; }

    footer {
      text-align: center;
      margin-top: 2rem;
      font-size: .78rem;
      color: #94a3b8;
    }
    footer a { color: var(--accent); text-decoration: none; }
    footer a:hover { text-decoration: underline; }

    @media (max-width: 540px) {
      .result-desc { display: none; }
      .result-time { display: none; }
      header h1 { font-size: 1.45rem; }
    }
  </style>
</head>
<body>
<div class="container">

  <header>
    <h1>HTTP Status Checker</h1>
    <p>Check the HTTP Status Code of websites from a list of URLs</p>
  </header>

  <!-- Input card -->
  <div class="card">
    <div class="card-label">Enter URLs to check — one per line, up to 50</div>
    <textarea id="urlInput"
      placeholder="https://example.com&#10;https://google.com&#10;example.co.th"></textarea>
    <div class="actions">
      <button class="btn-check" id="checkBtn" onclick="runCheck()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        Check
      </button>
      <button class="btn-clear" onclick="clearAll()">Clear</button>
    </div>
  </div>

  <!-- Results card -->
  <div id="resultsCard" class="card hidden">
    <div class="results-head">
      <span class="results-title" id="resultsTitle">Results</span>
      <div class="summary-pills" id="summaryPills"></div>
    </div>
    <div id="progressWrap" class="progress-wrap hidden">
      <div class="progress-fill" id="progressFill"></div>
    </div>
    <div id="resultsList"></div>
  </div>

  <footer>
    Powered by Bank Nattavut
  </footer>

</div>

<script>
  /* ── Helpers ───────────────────────────────────── */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function statusClass(code) {
    if (!code)            return 's-er';
    if (code >= 200 && code < 300) return 's-ok';
    if (code >= 300 && code < 400) return 's-rd';
    if (code >= 400 && code < 500) return 's-cl';
    return 's-sv';
  }

  var STATUS_TEXT = {
    200:'OK', 201:'Created', 204:'No Content',
    301:'Moved Permanently', 302:'Found', 303:'See Other',
    304:'Not Modified', 307:'Temporary Redirect', 308:'Permanent Redirect',
    400:'Bad Request', 401:'Unauthorized', 403:'Forbidden',
    404:'Not Found', 405:'Method Not Allowed', 408:'Request Timeout',
    429:'Too Many Requests',
    500:'Internal Server Error', 502:'Bad Gateway',
    503:'Service Unavailable', 504:'Gateway Timeout'
  };

  function statusLabel(code) { return STATUS_TEXT[code] || ''; }

  /* ── Check ─────────────────────────────────────── */
  async function runCheck() {
    var raw = document.getElementById('urlInput').value.trim();
    if (!raw) return;

    var lines = raw.split(/\\r?\\n/).map(function(u) { return u.trim(); })
                   .filter(function(u) { return u.length > 0; })
                   .slice(0, 50);
    if (lines.length === 0) return;

    var urls = lines.map(function(u) {
      return (u.indexOf('http://') === 0 || u.indexOf('https://') === 0) ? u : 'https://' + u;
    });

    /* UI: loading state */
    var btn  = document.getElementById('checkBtn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Checking...';

    document.getElementById('resultsCard').classList.remove('hidden');
    document.getElementById('resultsList').innerHTML = '';
    document.getElementById('summaryPills').innerHTML = '';
    document.getElementById('resultsTitle').textContent = 'Checking ' + urls.length + ' URL(s)...';

    var pWrap = document.getElementById('progressWrap');
    var pFill = document.getElementById('progressFill');
    pWrap.classList.remove('hidden');
    pFill.style.width = '8%';

    try {
      var res = await fetch('/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urls })
      });

      pFill.style.width = '85%';
      var results = await res.json();
      pFill.style.width = '100%';

      setTimeout(function() {
        pWrap.classList.add('hidden');
        pFill.style.width = '0%';
      }, 420);

      renderResults(results);
    } catch (err) {
      pWrap.classList.add('hidden');
      document.getElementById('resultsList').innerHTML =
        '<div class="empty-state"><p style="color:#dc2626">Error: ' + esc(err.message) + '</p></div>';
    }

    btn.disabled = false;
    btn.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="9 11 12 14 22 4"/>' +
      '<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' +
      '</svg> Check';
  }

  /* ── Render ────────────────────────────────────── */
  function renderResults(results) {
    var counts = { ok: 0, rd: 0, cl: 0, sv: 0, er: 0 };
    results.forEach(function(r) {
      if (!r.status)                        counts.er++;
      else if (r.status >= 200 && r.status < 300) counts.ok++;
      else if (r.status >= 300 && r.status < 400) counts.rd++;
      else if (r.status >= 400 && r.status < 500) counts.cl++;
      else                                        counts.sv++;
    });

    document.getElementById('resultsTitle').textContent =
      'Results — ' + results.length + ' URL(s)';

    var pills = '';
    if (counts.ok) pills += '<span class="pill s-ok">' + counts.ok + ' 2xx OK</span>';
    if (counts.rd) pills += '<span class="pill s-rd">' + counts.rd + ' 3xx Redirect</span>';
    if (counts.cl) pills += '<span class="pill s-cl">' + counts.cl + ' 4xx Client Error</span>';
    if (counts.sv) pills += '<span class="pill s-sv">' + counts.sv + ' 5xx Server Error</span>';
    if (counts.er) pills += '<span class="pill s-er">' + counts.er + ' Error</span>';
    document.getElementById('summaryPills').innerHTML = pills;

    var html = results.map(function(r) {
      var cls   = statusClass(r.status);
      var badge = r.status ? String(r.status) : 'ERR';
      var desc  = r.error ? r.error : (r.statusText || statusLabel(r.status) || '');
      var time  = r.responseTime ? r.responseTime + ' ms' : '';

      var dnsHtml = '';
      if (r.dns && r.dns.type) {
        var dnsCls = r.dns.type === 'A' ? 'dns-a' : 'dns-cname';
        dnsHtml = '<div class="result-dns">' +
          '<span class="dns-badge ' + dnsCls + '">' + r.dns.type + '</span>' +
          '<span class="dns-val">' + esc(r.dns.value) + '</span>' +
          '</div>';
      } else if (r.dns === null) {
        dnsHtml = '<div class="result-dns">' +
          '<span class="dns-badge dns-none">DNS</span>' +
          '<span class="dns-val">—</span>' +
          '</div>';
      }

      return '<div class="result-item">' +
        '<span class="status-badge ' + cls + '">' + badge + '</span>' +
        '<div class="result-url-wrap">' +
          '<span class="result-url">' + esc(r.url) + '</span>' +
          dnsHtml +
        '</div>' +
        '<span class="result-desc">' + esc(desc)   + '</span>' +
        '<span class="result-time">' + esc(time)   + '</span>' +
        '</div>';
    }).join('');

    document.getElementById('resultsList').innerHTML = html;
  }

  /* ── Misc ──────────────────────────────────────── */
  function clearAll() {
    document.getElementById('urlInput').value = '';
    document.getElementById('resultsCard').classList.add('hidden');
    document.getElementById('resultsList').innerHTML = '';
  }

  /* Ctrl/Cmd+Enter to submit */
  document.getElementById('urlInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runCheck();
  });
</script>
</body>
</html>`;

/* ═══════════════════════════════════════════════════
   Cloudflare Worker entry point
   ═══════════════════════════════════════════════════ */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/check') {
      return handleCheck(request);
    }

    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

/* ── POST /check ─────────────────────────────────── */
async function handleCheck(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const urls = Array.isArray(body.urls) ? body.urls.slice(0, 50) : [];
  if (urls.length === 0) return jsonResponse([], 200);

  const results = await Promise.all(urls.map(checkURL));
  return jsonResponse(results, 200);
}

/* ── Check a single URL ──────────────────────────── */
async function checkURL(url) {
  let hostname;
  try { hostname = new URL(url).hostname; } catch {
    return { url, status: null, error: 'Invalid URL', responseTime: 0, dns: null };
  }

  // Run HTTP check and DNS lookup in parallel
  const [httpResult, dns] = await Promise.all([
    doHTTPCheck(url),
    lookupDNS(hostname),
  ]);

  return { ...httpResult, dns };
}

/* ── HTTP check (HEAD → GET fallback) ───────────── */
async function doHTTPCheck(url) {
  const startTime = Date.now();

  for (const method of ['HEAD', 'GET']) {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch(url, {
        method,
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'HTTPStatusChecker/1.0 (Cloudflare Worker)' },
      });
      clearTimeout(tid);

      if (method === 'HEAD' && response.status === 405) continue;

      return {
        url,
        status:       response.status,
        statusText:   response.statusText,
        responseTime: Date.now() - startTime,
      };
    } catch (err) {
      clearTimeout(tid);

      if (controller.signal.aborted) {
        return { url, status: null, error: 'Request timed out (10 s)', responseTime: Date.now() - startTime };
      }

      if (method === 'HEAD') continue;

      return {
        url,
        status: null,
        error:  String(err.message || 'Connection failed'),
        responseTime: Date.now() - startTime,
      };
    }
  }
}

/* ── DNS lookup via Cloudflare DoH ──────────────── */
async function lookupDNS(hostname) {
  const base    = 'https://cloudflare-dns.com/dns-query';
  const headers = { Accept: 'application/dns-json' };
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 5_000);

  try {
    // 1. Check CNAME first
    const r1  = await fetch(base + '?name=' + encodeURIComponent(hostname) + '&type=CNAME',
                            { headers, signal: controller.signal });
    const d1  = await r1.json();
    const rec = (d1.Answer || []).find(r => r.type === 5);
    if (rec) {
      clearTimeout(tid);
      return { type: 'CNAME', value: rec.data.replace(/\.$/, '') };
    }

    // 2. Fallback to A record
    const r2  = await fetch(base + '?name=' + encodeURIComponent(hostname) + '&type=A',
                            { headers, signal: controller.signal });
    const d2  = await r2.json();
    const ips = (d2.Answer || []).filter(r => r.type === 1).map(r => r.data);
    if (ips.length > 0) {
      clearTimeout(tid);
      return { type: 'A', value: ips.join(', ') };
    }
  } catch { /* timeout or network error */ }

  clearTimeout(tid);
  return null;
}

/* ── Utility ─────────────────────────────────────── */
function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

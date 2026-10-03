from urllib.parse import unquote, urlparse


SUSPICIOUS_KEYWORDS = {
    "login",
    "verify",
    "verification",
    "secure",
    "account",
    "update",
    "confirm",
    "password",
    "signin",
    "bank",
}


SHORTENER_DOMAINS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "is.gd",
    "ow.ly",
}


def analyze_url(url: str) -> dict:
    parsed_url = urlparse(url)

    score = 0
    reasons = []

    hostname = (parsed_url.hostname or "").lower()
    decoded_url = unquote(url)
    url_lower = decoded_url.lower()

    if parsed_url.scheme != "https":
        score += 20
        reasons.append("URL does not use HTTPS")

    if "@" in url:
        score += 25
        reasons.append("URL contains @ symbol")

    if len(url) > 100:
        score += 10
        reasons.append("URL is unusually long")

    if hostname.replace(".", "").isdigit():
        score += 25
        reasons.append("URL uses an IP address instead of a domain name")

    if "-" in hostname:
        score += 5
        reasons.append("Domain contains hyphens")

    if decoded_url != url:
        score += 10
        reasons.append('URL contains percent-encoded characters')

    keyword_matches = sorted(
        {
            keyword
            for keyword in SUSPICIOUS_KEYWORDS
            if keyword in url_lower
        }
    )

    if keyword_matches:
        score += min(len(keyword_matches) * 5, 20)
        reasons.append(
            "URL contains suspicious keywords: "
            + ", ".join(keyword_matches)
        )

    subdomain_count = max(len(hostname.split(".")) - 2, 0)

    if subdomain_count >= 3:
        score += 15
        reasons.append("URL contains an unusually high number of subdomains")

    if parsed_url.port and parsed_url.port not in {80, 443}:
        score += 10
        reasons.append(
            f"URL uses a non-standard port: {parsed_url.port}"
        )

    if hostname in SHORTENER_DOMAINS:
        score += 15
        reasons.append("URL uses a URL shortening service")

    # Multiple phishing indicators together increase the risk.
    indicator_count = len(reasons)

    if indicator_count >= 3:
        score += 20
        reasons.append("URL contains multiple suspicious indicators")
    elif indicator_count == 2:
        score += 10
        reasons.append("URL contains multiple suspicious indicators")

    score = min(score, 100)

    if score >= 60:
        risk_level = "HIGH"
    elif score >= 30:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "reasons": reasons,
    }

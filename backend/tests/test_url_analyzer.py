from app.detection.url_analyzer import analyze_url


def test_safe_https_url():
    result = analyze_url("https://google.com")

    assert result["risk_score"] == 0
    assert result["risk_level"] == "LOW"


def test_http_url_is_flagged():
    result = analyze_url("http://example.com")

    assert result["risk_score"] == 20
    assert result["risk_level"] == "LOW"

def test_ip_address_with_login_is_suspicious():
    result = analyze_url("http://192.168.1.10/login")

    assert result["risk_score"] == 50
    assert result["risk_level"] == "MEDIUM"
    assert "URL uses an IP address instead of a domain name" in result["reasons"]


def test_shortened_url_is_suspicious():
    result = analyze_url("https://bit.ly/example")

    assert result["risk_score"] == 15
    assert result["risk_level"] == "LOW"
    assert "URL uses a URL shortening service" in result["reasons"]


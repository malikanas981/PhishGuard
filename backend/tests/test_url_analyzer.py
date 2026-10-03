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

    assert result["risk_score"] == 70
    assert result["risk_level"] == "HIGH"
    assert "URL uses an IP address instead of a domain name" in result["reasons"]


def test_shortened_url_is_suspicious():
    result = analyze_url("https://bit.ly/example")

    assert result["risk_score"] == 15
    assert result["risk_level"] == "LOW"
    assert "URL uses a URL shortening service" in result["reasons"]


def test_suspicious_account_verification_url():
    result = analyze_url(
        "https://secure-account-verification.example.com/login"
    )

    assert result["risk_score"] == 35
    assert result["risk_level"] == "MEDIUM"
    assert "URL contains multiple suspicious indicators" in result["reasons"]


def test_suspicious_paypal_login_url():
    result = analyze_url(
        "https://paypal-login-secure.example.com/verify-password"
    )

    assert result["risk_score"] == 35
    assert result["risk_level"] == "MEDIUM"
    assert "URL contains multiple suspicious indicators" in result["reasons"]




def test_percent_encoded_login_path_is_suspicious():
    result = analyze_url('https://example.com/%6C%6F%67%69%6E')

    assert result['risk_level'] == 'LOW'
    assert result['risk_score'] == 25


def test_multiple_indicators_use_explicit_indicator_count():
    result = analyze_url('https://example.com/login')

    assert result['risk_score'] == 5
    assert result['risk_level'] == 'LOW'


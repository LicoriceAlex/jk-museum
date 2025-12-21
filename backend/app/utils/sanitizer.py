import bleach

ALLOWED_TAGS = list(bleach.sanitizer.ALLOWED_TAGS.union({"p", "br", "img", "h1", "h2", "h3"}))
ALLOWED_ATTRIBUTES = {
    **bleach.sanitizer.ALLOWED_ATTRIBUTES,
    "img": ["src", "alt", "title"],
    "a": ["href", "title", "target"],
}


def sanitize_html(html: str) -> str:
    return bleach.clean(html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES)

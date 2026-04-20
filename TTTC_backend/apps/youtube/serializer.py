import re
import requests
from urllib.parse import urlparse, parse_qs

from rest_framework import serializers
from .models import YoutubeVideo


def extract_youtube_video_id(url: str) -> str | None:
    """
    Supports:
    - https://www.youtube.com/watch?v=VIDEOID
    - https://youtu.be/VIDEOID
    - https://www.youtube.com/shorts/VIDEOID
    - https://www.youtube.com/embed/VIDEOID
    """
    if not url:
        return None

    # If user directly pastes the id
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", url.strip()):
        return url.strip()

    parsed = urlparse(url)
    host = (parsed.netloc or "").lower()
    path = parsed.path or ""

    # youtu.be/<id>
    if "youtu.be" in host:
        vid = path.strip("/").split("/")[0]
        return vid if vid else None

    # youtube.com/watch?v=<id>
    if "youtube.com" in host:
        if path == "/watch":
            qs = parse_qs(parsed.query)
            vid = (qs.get("v") or [None])[0]
            return vid

        # /shorts/<id>, /embed/<id>
        parts = path.strip("/").split("/")
        if len(parts) >= 2 and parts[0] in ("shorts", "embed"):
            return parts[1]

    return None


def get_title_from_oembed(youtube_url: str) -> str | None:
    """
    Uses YouTube oEmbed (no API key needed) to get title.
    """
    try:
        resp = requests.get(
            "https://www.youtube.com/oembed",
            params={"url": youtube_url, "format": "json"},
            timeout=8,
        )
        if resp.status_code != 200:
            return None
        data = resp.json()
        return data.get("title")
    except Exception:
        return None


class YoutubeVideoSerializer(serializers.ModelSerializer):
    # Only this is required in request
    youtube_url = serializers.URLField()

    class Meta:
        model = YoutubeVideo
        fields = [
            "id",
            "youtube_url",
            "video_id",
            "title",
            "thumbnail",
            "view_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["video_id", "title", "thumbnail", "view_count", "created_at", "updated_at"]

    def validate_youtube_url(self, value: str) -> str:
        vid = extract_youtube_video_id(value)
        if not vid:
            raise serializers.ValidationError("Invalid YouTube link. Please paste a valid YouTube URL.")
        return value

    def create(self, validated_data):
        url = validated_data["youtube_url"]
        video_id = extract_youtube_video_id(url)

        # thumbnail from video_id
        thumbnail = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

        # title from oEmbed
        title = get_title_from_oembed(url) or ""

        return YoutubeVideo.objects.create(
            youtube_url=url,
            video_id=video_id,
            thumbnail=thumbnail,
            title=title,
        )

import { NextRequest, NextResponse } from 'next/server';
import { PlaceCategory } from '@/types/cafe';

function inferCategoryFromName(name: string): PlaceCategory {
  const lower = name.toLowerCase();
  if (
    lower.includes('warkop') ||
    lower.includes('wedang') ||
    lower.includes('hik') ||
    lower.includes('angkr') ||
    lower.includes('warmindo') ||
    lower.includes('kopi tarik')
  ) {
    return 'warkop';
  }
  if (
    lower.includes('resto') ||
    lower.includes('restoran') ||
    lower.includes('rumah makan') ||
    lower.includes('soto') ||
    lower.includes('bakso') ||
    lower.includes('bistik') ||
    lower.includes('selat') ||
    lower.includes('kitchen') ||
    lower.includes('diner') ||
    lower.includes('eatery')
  ) {
    return 'resto';
  }
  return 'cafe';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl = body.url?.trim() || '';

    if (!rawUrl) {
      return NextResponse.json(
        { error: 'Tautan Google Maps harus diisi.' },
        { status: 400 }
      );
    }

    let targetUrl = rawUrl;

    // Follow redirect if short link (maps.app.goo.gl, goo.gl/maps, or google.com/maps)
    if (
      targetUrl.includes('maps.app.goo.gl') ||
      targetUrl.includes('goo.gl/maps') ||
      targetUrl.includes('google.com/maps')
    ) {
      try {
        const redirectRes = await fetch(targetUrl, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8',
          },
        });
        targetUrl = redirectRes.url;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.warn('Google Maps redirect resolution failed, using raw url:', errorMsg);
      }
    }

    // 1. Extract Coordinates
    let lat: number | null = null;
    let lng: number | null = null;

    // Pattern A: Exact pin in Google Maps protobuf data: !3d(-?\d+\.\d+)!4d(-?\d+\.\d+)
    const exactMatch = targetUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (exactMatch) {
      lat = parseFloat(exactMatch[1]);
      lng = parseFloat(exactMatch[2]);
    }

    // Pattern B: Center coordinates /@(-?\d+\.\d+),(-?\d+\.\d+)
    if (lat === null) {
      const atMatch = targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        lat = parseFloat(atMatch[1]);
        lng = parseFloat(atMatch[2]);
      }
    }

    // Pattern C: ?q=lat,lng or ?ll=lat,lng
    if (lat === null) {
      const qCoordMatch = targetUrl.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qCoordMatch) {
        lat = parseFloat(qCoordMatch[1]);
        lng = parseFloat(qCoordMatch[2]);
      }
    }

    // 2. Extract Place Name
    let placeName = '';

    // Pattern A: /place/Place+Name/
    const placeMatch = targetUrl.match(/\/place\/([^/@?]+)/);
    if (placeMatch) {
      placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    }

    // Pattern B: ?q=Place+Name (when not a coordinate)
    if (!placeName) {
      const qNameMatch = targetUrl.match(/[?&]q=([^&]+)/);
      if (qNameMatch && !/^-?\d+\.\d+,-?\d+\.\d+$/.test(qNameMatch[1])) {
        placeName = decodeURIComponent(qNameMatch[1].replace(/\+/g, ' '));
      }
    }

    // Pattern C: /search/Place+Name/
    if (!placeName) {
      const searchMatch = targetUrl.match(/\/search\/([^/@?]+)/);
      if (searchMatch) {
        placeName = decodeURIComponent(searchMatch[1].replace(/\+/g, ' '));
      }
    }

    // Clean up place name artifacts
    if (placeName) {
      placeName = placeName.replace(/[+]+/g, ' ').trim();
    }

    // 3. Fallback resolution via Geocoding if lat/lng or placeName is missing
    let resolvedAddress = 'Surakarta, Jawa Tengah';

    if (lat !== null && lng !== null && !placeName) {
      // We have coordinates, lookup name & address
      try {
        const revRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'CafePulse-Solo/1.0 (contact: info@cafepulse.id)',
              'Accept-Language': 'id',
            },
          }
        );
        if (revRes.ok) {
          const revData = await revRes.json();
          const detectedName =
            revData.name ||
            revData.address?.cafe ||
            revData.address?.restaurant ||
            revData.address?.fast_food ||
            revData.address?.amenity;
          if (detectedName) {
            placeName = detectedName;
          } else {
            const road = revData.address?.road || revData.address?.neighbourhood || 'Surakarta';
            placeName = `Titik Kafe di ${road}`;
          }
          resolvedAddress = revData.display_name || `${placeName}, Surakarta`;
        }
      } catch (err: unknown) {
        console.warn('Reverse geocode failed:', err);
      }
    } else if (lat === null && placeName) {
      // We have place name, lookup coordinates in Surakarta
      try {
        const searchRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            `${placeName} Surakarta`
          )}&limit=1&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'CafePulse-Solo/1.0 (contact: info@cafepulse.id)',
              'Accept-Language': 'id',
            },
          }
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.length > 0) {
            lat = parseFloat(searchData[0].lat);
            lng = parseFloat(searchData[0].lon);
            resolvedAddress = searchData[0].display_name;
          }
        }
      } catch (err: unknown) {
        console.warn('Forward geocode failed:', err);
      }
    } else if (lat !== null && lng !== null && placeName) {
      // Both exist! Let's get the exact street address for the coordinates
      try {
        const revRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'CafePulse-Solo/1.0 (contact: info@cafepulse.id)',
              'Accept-Language': 'id',
            },
          }
        );
        if (revRes.ok) {
          const revData = await revRes.json();
          const road =
            revData.address?.road ||
            revData.address?.suburb ||
            revData.address?.neighbourhood ||
            'Surakarta';
          const houseNo = revData.address?.house_number ? ` No. ${revData.address.house_number}` : '';
          const city = revData.address?.city || revData.address?.county || 'Surakarta';
          resolvedAddress = `${road}${houseNo}, ${city}`;
        }
      } catch {
        resolvedAddress = `${placeName}, Surakarta, Jawa Tengah`;
      }
    }

    if (!placeName && lat === null) {
      return NextResponse.json(
        {
          error:
            'Tautan tidak dapat diurai. Pastikan tautan berasal dari Google Maps (misal: https://maps.app.goo.gl/... atau google.com/maps/place/...).',
        },
        { status: 422 }
      );
    }

    // Default to Solo city center if coordinates couldn't be resolved
    const finalLat = lat ?? -7.562;
    const finalLng = lng ?? 110.818;
    const finalName = placeName || 'Kafe Baru Google Maps';

    return NextResponse.json({
      success: true,
      candidate: {
        id: `gmap-parsed-${Date.now()}`,
        name: finalName,
        address: resolvedAddress,
        latitude: finalLat,
        longitude: finalLng,
        google_maps_url: rawUrl,
        category: inferCategoryFromName(finalName),
        source: 'google_maps_link',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: errorMsg || 'Gagal memproses tautan Google Maps.' },
      { status: 500 }
    );
  }
}


exports.handler = async (event) => {
  const KAKAO_KEY = process.env.KAKAO_REST_API_KEY;
  const { type, query, x, y, radius, page } = event.queryStringParameters || {};

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let url = '';

    if (type === 'search_keyword') {
      // 키워드로 가게 검색 (홈 화면에서 가게 찾기)
      url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&x=${x}&y=${y}&radius=2000&size=10`;
    } else if (type === 'search_category') {
      // 카테고리로 주변 장소 검색 (추천 장소)
      url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&x=${x}&y=${y}&radius=${radius || 800}&size=15&sort=distance`;
    } else if (type === 'coord2address') {
      // 좌표를 주소로 변환
      url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${KAKAO_KEY}` }
    });

    const data = await res.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

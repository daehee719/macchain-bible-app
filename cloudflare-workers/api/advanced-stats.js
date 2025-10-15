/**
 * 고급 통계 및 분석 API
 * 사용자 읽기 패턴 분석, 성장 추이, 개인화된 인사이트 제공
 */

export async function handleAdvancedStats(request, env, ctx) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId') || 'default';
      const period = url.searchParams.get('period') || '30'; // 7, 30, 90, 365
      const type = url.searchParams.get('type') || 'overview';

      switch (type) {
        case 'reading-patterns':
          return await getReadingPatterns(env, userId, period);
        case 'growth-insights':
          return await getGrowthInsights(env, userId, period);
        case 'personalized-recommendations':
          return await getPersonalizedRecommendations(env, userId);
        case 'spiritual-journey':
          return await getSpiritualJourney(env, userId, period);
        default:
          return await getOverviewStats(env, userId, period);
      }
    } catch (error) {
      console.error('Advanced Stats Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: '통계 조회 중 오류가 발생했습니다.',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}

async function getOverviewStats(env, userId, period) {
  // 기본 통계 데이터
  const stats = await env.DB.prepare(`
    SELECT 
      COUNT(*) as total_readings,
      COUNT(DISTINCT DATE(created_at)) as active_days,
      AVG(CASE WHEN completed = 1 THEN 1 ELSE 0 END) * 100 as completion_rate,
      MAX(created_at) as last_reading
    FROM reading_progress 
    WHERE user_id = ? AND created_at >= datetime('now', '-${period} days')
  `).bind(userId).first();

  // 연속 읽기 일수 계산
  const streak = await calculateStreak(env, userId);
  
  // 가장 많이 읽은 성경책
  const topBooks = await env.DB.prepare(`
    SELECT book, COUNT(*) as count
    FROM reading_progress 
    WHERE user_id = ? AND created_at >= datetime('now', '-${period} days')
    GROUP BY book
    ORDER BY count DESC
    LIMIT 5
  `).bind(userId).all();

  return new Response(JSON.stringify({
    success: true,
    data: {
      overview: {
        totalReadings: stats.total_readings || 0,
        activeDays: stats.active_days || 0,
        completionRate: Math.round(stats.completion_rate || 0),
        currentStreak: streak,
        lastReading: stats.last_reading
      },
      topBooks: topBooks.results || [],
      period: parseInt(period),
      generatedAt: new Date().toISOString()
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getReadingPatterns(env, userId, period) {
  // 시간대별 읽기 패턴
  const hourlyPattern = await env.DB.prepare(`
    SELECT 
      strftime('%H', created_at) as hour,
      COUNT(*) as count
    FROM reading_progress 
    WHERE user_id = ? AND created_at >= datetime('now', '-${period} days')
    GROUP BY strftime('%H', created_at)
    ORDER BY hour
  `).bind(userId).all();

  // 요일별 읽기 패턴
  const weeklyPattern = await env.DB.prepare(`
    SELECT 
      strftime('%w', created_at) as day_of_week,
      COUNT(*) as count
    FROM reading_progress 
    WHERE user_id = ? AND created_at >= datetime('now', '-${period} days')
    GROUP BY strftime('%w', created_at)
    ORDER BY day_of_week
  `).bind(userId).all();

  // 월별 읽기 추이
  const monthlyTrend = await env.DB.prepare(`
    SELECT 
      strftime('%Y-%m', created_at) as month,
      COUNT(*) as count
    FROM reading_progress 
    WHERE user_id = ? AND created_at >= datetime('now', '-${period} days')
    GROUP BY strftime('%Y-%m', created_at)
    ORDER BY month
  `).bind(userId).all();

  return new Response(JSON.stringify({
    success: true,
    data: {
      hourlyPattern: hourlyPattern.results || [],
      weeklyPattern: weeklyPattern.results || [],
      monthlyTrend: monthlyTrend.results || [],
      period: parseInt(period)
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getGrowthInsights(env, userId, period) {
  // 성장 지표 계산
  const currentPeriod = await env.DB.prepare(`
    SELECT COUNT(*) as readings, AVG(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completion_rate
    FROM reading_progress 
    WHERE user_id = ? AND created_at >= datetime('now', '-${period} days')
  `).bind(userId).first();

  const previousPeriod = await env.DB.prepare(`
    SELECT COUNT(*) as readings, AVG(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completion_rate
    FROM reading_progress 
    WHERE user_id = ? AND created_at >= datetime('now', '-${parseInt(period) * 2} days') 
    AND created_at < datetime('now', '-${period} days')
  `).bind(userId).first();

  const growthRate = previousPeriod.readings > 0 
    ? ((currentPeriod.readings - previousPeriod.readings) / previousPeriod.readings * 100)
    : 100;

  const completionGrowth = previousPeriod.completion_rate > 0
    ? ((currentPeriod.completion_rate - previousPeriod.completion_rate) / previousPeriod.completion_rate * 100)
    : 100;

  // AI를 활용한 개인화된 인사이트 생성
  const insight = await generatePersonalizedInsight(env, {
    currentReadings: currentPeriod.readings,
    previousReadings: previousPeriod.readings,
    currentCompletion: currentPeriod.completion_rate,
    previousCompletion: previousPeriod.completion_rate,
    growthRate,
    completionGrowth
  });

  return new Response(JSON.stringify({
    success: true,
    data: {
      growthMetrics: {
        readingGrowth: Math.round(growthRate),
        completionGrowth: Math.round(completionGrowth),
        currentReadings: currentPeriod.readings,
        previousReadings: previousPeriod.readings
      },
      insight,
      period: parseInt(period)
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getPersonalizedRecommendations(env, userId) {
  // 사용자의 읽기 히스토리 분석
  const readingHistory = await env.DB.prepare(`
    SELECT book, chapter, COUNT(*) as frequency
    FROM reading_progress 
    WHERE user_id = ? AND created_at >= datetime('now', '-90 days')
    GROUP BY book, chapter
    ORDER BY frequency DESC
    LIMIT 10
  `).bind(userId).all();

  // AI를 활용한 개인화된 추천 생성
  const recommendations = await generateRecommendations(env, readingHistory.results || []);

  return new Response(JSON.stringify({
    success: true,
    data: {
      recommendations,
      basedOn: readingHistory.results || []
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getSpiritualJourney(env, userId, period) {
  // 영적 여정 추적 데이터
  const journeyData = await env.DB.prepare(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as readings,
      AVG(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completion_rate,
      GROUP_CONCAT(DISTINCT book) as books_read
    FROM reading_progress 
    WHERE user_id = ? AND created_at >= datetime('now', '-${period} days')
    GROUP BY DATE(created_at)
    ORDER BY date
  `).bind(userId).all();

  // AI를 활용한 영적 성장 분석
  const spiritualInsight = await generateSpiritualInsight(env, journeyData.results || []);

  return new Response(JSON.stringify({
    success: true,
    data: {
      journey: journeyData.results || [],
      insight: spiritualInsight,
      period: parseInt(period)
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function calculateStreak(env, userId) {
  const readings = await env.DB.prepare(`
    SELECT DISTINCT DATE(created_at) as date
    FROM reading_progress 
    WHERE user_id = ? AND completed = 1
    ORDER BY date DESC
  `).bind(userId).all();

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const reading of readings.results || []) {
    const readingDate = new Date(reading.date);
    const diffTime = today - readingDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

async function generatePersonalizedInsight(env, metrics) {
  try {
    const prompt = `
      다음은 사용자의 성경 읽기 성장 지표입니다:
      - 현재 기간 읽기 수: ${metrics.currentReadings}
      - 이전 기간 읽기 수: ${metrics.previousReadings}
      - 읽기 성장률: ${metrics.growthRate.toFixed(1)}%
      - 완주율 성장: ${metrics.completionGrowth.toFixed(1)}%
      
      이 데이터를 바탕으로 격려하고 동기부여가 되는 개인화된 인사이트를 한국어로 작성해주세요.
      구체적이고 실용적인 조언을 포함해주세요.
    `;

    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.8
    });

    return response.response || response;
  } catch (error) {
    console.error('AI Insight Error:', error);
    return "성경 읽기 여정에서 꾸준한 성장을 보이고 있습니다. 계속해서 하나님의 말씀과 함께하세요!";
  }
}

async function generateRecommendations(env, history) {
  try {
    const prompt = `
      다음은 사용자가 자주 읽는 성경 구절들입니다:
      ${history.map(h => `${h.book} ${h.chapter}장 (${h.frequency}회)`).join(', ')}
      
      이 패턴을 바탕으로 다음을 추천해주세요:
      1. 읽어볼 만한 새로운 성경책
      2. 깊이 있게 묵상할 만한 구절
      3. 영적 성장을 위한 제안
      
      한국어로 구체적이고 실용적인 추천을 해주세요.
    `;

    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.7
    });

    return response.response || response;
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    return "시편과 요한복음을 읽어보시는 것을 추천합니다. 이 책들은 영적 성장에 큰 도움이 됩니다.";
  }
}

async function generateSpiritualInsight(env, journeyData) {
  try {
    const prompt = `
      다음은 사용자의 영적 여정 데이터입니다:
      ${journeyData.map(d => `${d.date}: ${d.readings}개 읽기, 완주율 ${(d.completion_rate * 100).toFixed(1)}%`).join('\n')}
      
      이 데이터를 바탕으로 영적 성장에 대한 인사이트와 격려 메시지를 한국어로 작성해주세요.
    `;

    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.8
    });

    return response.response || response;
  } catch (error) {
    console.error('AI Spiritual Insight Error:', error);
    return "하나님과의 일대일 시간을 통해 영적으로 성장하고 있습니다. 계속해서 말씀과 함께하세요!";
  }
}

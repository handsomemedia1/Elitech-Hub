import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { scoreAssessment, FREE_QUESTIONS } from '@/data/beforeCybersecurityAssessment';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, tier = 'free' } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers payload' }, { status: 400 });
    }

    // Score the submission
    const result = scoreAssessment(answers, FREE_QUESTIONS);

    // If an authenticated user took the assessment, persist session if database tables exist
    const user = await getServerUser();
    let sessionId: string | null = null;

    if (user) {
      try {
        const supabase = createServiceClient();
        if (supabase) {
          const { data: session } = await supabase
            .from('bc_assessment_sessions')
            .insert({
              user_id: user.id,
              assessment_type: tier,
              assessment_version: '1.0',
              status: 'completed',
              completed_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          if (session?.id) {
            sessionId = session.id;

            // Insert top scores
            const scoreRows = Object.entries(result.scores).map(([dimension, score]) => ({
              session_id: session.id,
              dimension,
              score,
            }));

            await supabase.from('bc_assessment_scores').insert(scoreRows);
          }
        }
      } catch (dbErr) {
        // Non-blocking: if table doesn't exist yet, we still return the calculated scores
        console.warn('[Assessment Save Non-Fatal Notice]:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      sessionId,
      result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Assessment calculation failed', details: msg }, { status: 500 });
  }
}
